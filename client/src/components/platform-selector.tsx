import { useState } from "react";
import { Check } from "lucide-react";
import { platforms, type Platform } from "@/lib/platforms";
import { Button } from "@/components/ui/button";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onSelectionChange: (platforms: string[]) => void;
}

export function PlatformSelector({ selectedPlatforms, onSelectionChange }: PlatformSelectorProps) {
  const handlePlatformToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onSelectionChange(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onSelectionChange([...selectedPlatforms, platformId]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(platforms.map(p => p.id));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Select Platforms</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-primary hover:text-blue-700 font-medium"
          >
            Select All
          </Button>
          <span className="text-gray-300">|</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <div
              key={platform.id}
              className="platform-card group cursor-pointer"
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <div className={`
                ${isSelected 
                  ? `bg-blue-50 border-2 ${platform.borderColor}` 
                  : `bg-gray-50 ${platform.hoverColor} border-2 border-gray-200`
                }
                rounded-xl p-4 text-center transition-all duration-200 relative
              `}>
                <div className={`w-8 h-8 mx-auto mb-2 ${platform.color}`}>
                  <i className={`${platform.icon} text-2xl`}></i>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{platform.name}</h3>
                <span className="text-xs text-gray-500">{platform.requirements}</span>
                <div className={`
                  absolute top-2 right-2 w-4 h-4 border-2 rounded transition-colors
                  ${isSelected 
                    ? `${platform.borderColor} bg-current flex items-center justify-center`
                    : `border-gray-300 group-hover:${platform.borderColor.replace('border-', 'border-')}`
                  }
                `}>
                  {isSelected && <Check className="w-2 h-2 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <i className="fas fa-info-circle mr-2"></i>
          <span className="font-medium">{selectedPlatforms.length} platforms selected</span> - Content will be optimized for each platform's requirements
        </p>
      </div>
    </section>
  );
}
