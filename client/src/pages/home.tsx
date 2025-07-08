import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlatformSelector } from "@/components/platform-selector";
import { PostComposer } from "@/components/post-composer";
import { PlatformPreviews } from "@/components/platform-previews";
import { PostingStatus } from "@/components/posting-status";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertPost } from "@shared/schema";

export default function Home() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      const response = await apiRequest("POST", "/api/posts", data);
      return await response.json();
    },
    onSuccess: (post) => {
      setCurrentPostId(post.id);
      publishPostMutation.mutate(post.id);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: () => {
      toast({
        title: "Failed to create post",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const publishPostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("POST", `/api/posts/${postId}/publish`);
      return await response.json();
    },
    onSuccess: () => {
      setShowStatus(true);
      toast({
        title: "Publishing started",
        description: "Your post is being published to the selected platforms.",
      });
    },
    onError: () => {
      toast({
        title: "Publishing failed",
        description: "Failed to start publishing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: { content: string; mediaUrls: string[]; scheduledAt?: Date }) => {
    setContent(data.content);
    setShowStatus(false);
    
    createPostMutation.mutate({
      content: data.content,
      platforms: selectedPlatforms,
      mediaUrls: data.mediaUrls,
      scheduledAt: data.scheduledAt,
    });
  };

  const isLoading = createPostMutation.isPending || publishPostMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-share-alt text-white text-sm"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SocialBlaster</h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, Alex</span>
              <button className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Selector */}
        <PlatformSelector 
          selectedPlatforms={selectedPlatforms}
          onSelectionChange={setSelectedPlatforms}
        />

        {/* Post Composer */}
        <PostComposer 
          selectedPlatforms={selectedPlatforms}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Platform Previews */}
        <PlatformPreviews 
          selectedPlatforms={selectedPlatforms}
          content={content}
        />

        {/* Posting Status */}
        {currentPostId && (
          <PostingStatus 
            postId={currentPostId}
            show={showStatus}
          />
        )}
      </main>
    </div>
  );
}
