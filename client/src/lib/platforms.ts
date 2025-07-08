export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
  borderColor: string;
  characterLimit: number;
  requirements: string;
  requiresMedia?: boolean;
}

export const platforms: Platform[] = [
  {
    id: "twitter",
    name: "Twitter",
    icon: "fab fa-twitter",
    color: "text-blue-500",
    hoverColor: "hover:bg-blue-50 hover:border-blue-300",
    borderColor: "border-blue-500",
    characterLimit: 280,
    requirements: "280 chars"
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "fab fa-facebook",
    color: "text-blue-600",
    hoverColor: "hover:bg-blue-50 hover:border-blue-300",
    borderColor: "border-blue-500",
    characterLimit: 63206,
    requirements: "63,206 chars"
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "fab fa-youtube",
    color: "text-red-600",
    hoverColor: "hover:bg-red-50 hover:border-red-300",
    borderColor: "border-red-500",
    characterLimit: 5000,
    requirements: "Video req.",
    requiresMedia: true
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "fab fa-tiktok",
    color: "text-gray-900",
    hoverColor: "hover:bg-gray-50 hover:border-gray-400",
    borderColor: "border-gray-900",
    characterLimit: 2200,
    requirements: "2,200 chars"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: "fab fa-pinterest",
    color: "text-red-600",
    hoverColor: "hover:bg-red-50 hover:border-red-300",
    borderColor: "border-red-500",
    characterLimit: 500,
    requirements: "500 chars"
  },
  {
    id: "threads",
    name: "Threads",
    icon: "fas fa-at",
    color: "text-gray-900",
    hoverColor: "hover:bg-gray-50 hover:border-gray-400",
    borderColor: "border-gray-900",
    characterLimit: 500,
    requirements: "500 chars"
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: "fab fa-snapchat",
    color: "text-yellow-500",
    hoverColor: "hover:bg-yellow-50 hover:border-yellow-300",
    borderColor: "border-yellow-500",
    characterLimit: 250,
    requirements: "Image req.",
    requiresMedia: true
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "fab fa-whatsapp",
    color: "text-green-600",
    hoverColor: "hover:bg-green-50 hover:border-green-300",
    borderColor: "border-green-500",
    characterLimit: 65536,
    requirements: "65,536 chars"
  }
];

export function getPlatformById(id: string): Platform | undefined {
  return platforms.find(p => p.id === id);
}

export function getCharacterLimit(platformIds: string[]): number {
  if (platformIds.length === 0) return 280; // Default to Twitter limit
  
  const limits = platformIds.map(id => {
    const platform = getPlatformById(id);
    return platform ? platform.characterLimit : 280;
  });
  
  return Math.min(...limits);
}
