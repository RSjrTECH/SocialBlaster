import { platforms } from "@/lib/platforms";

interface PlatformPreviewsProps {
  selectedPlatforms: string[];
  content: string;
}

export function PlatformPreviews({ selectedPlatforms, content }: PlatformPreviewsProps) {
  if (selectedPlatforms.length === 0 || !content.trim()) {
    return null;
  }

  const previewPlatforms = selectedPlatforms.slice(0, 3); // Show max 3 previews

  const truncateContent = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit - 3) + "...";
  };

  const renderPreview = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;

    const previewContent = truncateContent(content, platform.characterLimit);

    switch (platformId) {
      case "facebook":
        return (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <i className={`${platform.icon} ${platform.color}`}></i>
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AL</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Alex Smith</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <p className="text-sm text-gray-800 mb-3">{previewContent}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>📤 Share</span>
              </div>
            </div>
          </div>
        );

      case "threads":
        return (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <i className={`${platform.icon} ${platform.color}`}></i>
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AL</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">@alexsmith</p>
                  <p className="text-sm text-gray-800 mt-1">{previewContent}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <span>❤️</span>
                    <span>💬</span>
                    <span>🔄</span>
                    <span>📤</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "tiktok":
        return (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <i className={`${platform.icon} ${platform.color}`}></i>
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-white">
              <div className="aspect-w-9 aspect-h-16 bg-gray-800 rounded mb-3 flex items-center justify-center h-48">
                <div className="text-center">
                  <i className="fas fa-play text-4xl mb-2 opacity-50"></i>
                  <p className="text-sm opacity-75">Video will appear here</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                <span className="text-sm">@alexsmith</span>
              </div>
              <p className="text-sm mt-2">{previewContent}</p>
            </div>
          </div>
        );

      case "twitter":
        return (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <i className={`${platform.icon} ${platform.color}`}></i>
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AL</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-gray-900">Alex Smith</p>
                    <p className="text-sm text-gray-500">@alexsmith</p>
                    <span className="text-gray-500">·</span>
                    <p className="text-sm text-gray-500">now</p>
                  </div>
                  <p className="text-sm text-gray-800 mt-1">{previewContent}</p>
                  <div className="flex items-center space-x-6 mt-3 text-gray-500">
                    <span className="text-sm">💬</span>
                    <span className="text-sm">🔄</span>
                    <span className="text-sm">❤️</span>
                    <span className="text-sm">📤</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <i className={`${platform.icon} ${platform.color}`}></i>
              <span className="text-sm font-medium text-gray-900">{platform.name}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AL</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Alex Smith</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <p className="text-sm text-gray-800">{previewContent}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {previewPlatforms.map(platformId => (
          <div key={platformId}>
            {renderPreview(platformId)}
          </div>
        ))}
      </div>
      
      {selectedPlatforms.length > 3 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            +{selectedPlatforms.length - 3} more platforms will receive this content
          </p>
        </div>
      )}
    </section>
  );
}
