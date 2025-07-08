import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Image, Video, X } from "lucide-react";
import { platforms, getCharacterLimit } from "@/lib/platforms";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PostComposerProps {
  selectedPlatforms: string[];
  onSubmit: (data: { content: string; mediaUrls: string[]; scheduledAt?: Date }) => void;
  isLoading?: boolean;
}

interface UploadedFile {
  url: string;
  originalName: string;
  size: number;
}

export function PostComposer({ selectedPlatforms, onSubmit, isLoading }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [scheduleType, setScheduleType] = useState("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const characterLimit = getCharacterLimit(selectedPlatforms);
  const isOverLimit = content.length > characterLimit;

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await apiRequest("POST", "/api/upload", formData);
        return await response.json();
      });
      
      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...results]);
      
      toast({
        title: "Upload successful",
        description: `${results.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to post to.",
        variant: "destructive",
      });
      return;
    }
    
    if (isOverLimit) {
      toast({
        title: "Content too long",
        description: `Your post exceeds the character limit for the selected platforms (${characterLimit} characters).`,
        variant: "destructive",
      });
      return;
    }

    let scheduledAt: Date | undefined;
    if (scheduleType === "later" && scheduleDate && scheduleTime) {
      scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
    }

    onSubmit({
      content,
      mediaUrls: uploadedFiles.map(f => f.url),
      scheduledAt,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getCharacterLimitsBadges = () => {
    return selectedPlatforms.map(platformId => {
      const platform = platforms.find(p => p.id === platformId);
      if (!platform) return null;
      
      const isOverPlatformLimit = content.length > platform.characterLimit;
      
      return (
        <span
          key={platform.id}
          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
            isOverPlatformLimit 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <i className={`${platform.icon} mr-1`}></i> 
          {content.length}/{platform.characterLimit.toLocaleString()}
        </span>
      );
    });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Compose Your Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Content */}
        <div>
          <Label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
            Post Content
          </Label>
          <div className="relative">
            <Textarea
              id="post-content"
              rows={4}
              className={`w-full resize-none ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="What's on your mind? Share your thoughts with the world..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className={`absolute bottom-3 right-3 text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/{characterLimit}
            </div>
          </div>
          
          {/* Character limits per platform */}
          {selectedPlatforms.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {getCharacterLimitsBadges()}
            </div>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Media Attachments
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "image/*";
                  fileInputRef.current.click();
                }
              }}
            >
              <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
                <Image className="w-full h-full" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Upload Images</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>

            {/* Video Upload */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "video/*";
                  fileInputRef.current.click();
                }
              }}
            >
              <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
                <Video className="w-full h-full" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Upload Video</p>
              <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
          />

          {/* Uploaded Media Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      {file.url.includes('video') ? (
                        <Video className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Image className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduling Options */}
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Scheduling
          </Label>
          <RadioGroup value={scheduleType} onValueChange={setScheduleType} className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now">Post now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later">Schedule for later</Label>
            </div>
          </RadioGroup>
          
          {scheduleType === "later" && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-date" className="block text-sm text-gray-600 mb-1">Date</Label>
                <Input
                  type="date"
                  id="schedule-date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="schedule-time" className="block text-sm text-gray-600 mb-1">Time</Label>
                <Input
                  type="time"
                  id="schedule-time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button type="button" variant="outline">
              <i className="fas fa-save mr-2"></i>Save Draft
            </Button>
            <Button type="button" variant="outline">
              <i className="fas fa-eye mr-2"></i>Preview All
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Ready to post to <span className="font-medium">{selectedPlatforms.length} platforms</span>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || isUploading || !content.trim() || selectedPlatforms.length === 0 || isOverLimit}
              className="bg-primary hover:bg-blue-700 text-white px-6 py-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Post to All Platforms
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
