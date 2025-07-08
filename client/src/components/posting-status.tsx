import { useQuery } from "@tanstack/react-query";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import { platforms } from "@/lib/platforms";
import type { PostResult } from "@shared/schema";

interface PostingStatusProps {
  postId: number;
  show: boolean;
}

export function PostingStatus({ postId, show }: PostingStatusProps) {
  const { data: results = [], isLoading } = useQuery<PostResult[]>({
    queryKey: ["/api/posts", postId, "results"],
    enabled: show && postId > 0,
    refetchInterval: 2000, // Refetch every 2 seconds while posting
  });

  if (!show || isLoading) {
    return null;
  }

  const completedCount = results.filter(r => r.status !== "pending").length;
  const successCount = results.filter(r => r.status === "success").length;
  const failedCount = results.filter(r => r.status === "failed").length;
  const overallProgress = results.length > 0 ? Math.round((completedCount / results.length) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "pending":
      default:
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Posted successfully";
      case "failed":
        return "Failed to post";
      case "pending":
      default:
        return "Posting...";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
      default:
        return "text-blue-600";
    }
  };

  return (
    <section className="mt-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Posting Status</h3>
        
        <div className="space-y-3">
          {results.map((result) => {
            const platform = platforms.find(p => p.id === result.platform);
            if (!platform) return null;

            return (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <i className={`${platform.icon} ${platform.color}`}></i>
                  <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    result.status === "success" ? "bg-green-600" :
                    result.status === "failed" ? "bg-red-600" : "bg-blue-600"
                  } ${result.status === "pending" ? "animate-pulse" : ""}`}></div>
                  <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                    {getStatusText(result.status)}
                  </span>
                  {getStatusIcon(result.status)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Overall Progress</p>
              <p className="text-xs text-blue-700">
                {successCount} successful, {failedCount} failed, {results.length - completedCount} pending
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-900">{overallProgress}%</p>
              <div className="w-24 h-2 bg-blue-200 rounded-full mt-1">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
