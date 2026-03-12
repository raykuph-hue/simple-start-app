import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkles, Star, Flame, Zap, Crown, ImageOff } from "lucide-react";
import { Template, TemplateImage } from "@/data/templates";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateCardProps {
  template: Template;
  index: number;
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
}

// Deterministic fallback gradient for when images fail
const fallbackGradient = "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";

const badgeIcons: Record<string, React.ReactNode> = {
  Popular: <Star className="w-3 h-3" />,
  New: <Zap className="w-3 h-3" />,
  Trending: <Flame className="w-3 h-3" />,
  Premium: <Crown className="w-3 h-3" />,
};

const badgeColors: Record<string, string> = {
  Popular: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  New: "bg-green-500/20 text-green-400 border-green-500/30",
  Trending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Premium: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const TemplateCard = ({ template, index, onPreview, onUse }: TemplateCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Defensive checks for template data
  if (!template || typeof template !== 'object') {
    return null;
  }

  const templateName = template.name || 'Template';
  const templateDescription = template.description || 'Website template';
  const templateIndustry = template.industry || 'General';
  const templatePages = Array.isArray(template.pages) ? template.pages : [];
  const templateBadges = Array.isArray(template.badges) ? template.badges : [];
  const templateImages: TemplateImage = template.images || { hero: '' };
  const templateAccent = template.accent || '#6366f1';
  const templatePreview = template.preview || fallbackGradient;

  // Get safe hero image URL
  const heroImageUrl = templateImages.hero || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="card-glass overflow-hidden transition-all duration-300 hover:glow-md hover:scale-[1.02]">
        {/* Preview with real image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 w-full h-full z-10" />
          )}
          
          {/* Hero image as background - only render if URL exists */}
          {heroImageUrl && (
            <img
              src={heroImageUrl}
              alt={`${templateName} preview`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          )}
          
          {/* Fallback gradient if image fails or no URL */}
          {(imageError || !heroImageUrl) && (
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ background: templatePreview }}
            />
          )}
          
          {/* Gradient overlay for text readability */}
          <div 
            className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-40"
            style={{ 
              background: `linear-gradient(180deg, transparent 0%, ${templatePreview.includes("f8f9fa") ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.7)"} 100%)` 
            }}
          />
          
          {/* Mock website elements overlay */}
          <div className="absolute inset-0 p-4 flex flex-col">
            {/* Mock nav */}
            <div className="flex justify-between items-center mb-4">
              <div
                className="px-3 py-1 rounded text-xs font-semibold text-white/90"
                style={{ backgroundColor: templateAccent }}
              >
                {templateName.split(" ")[0]}
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-2 bg-white/30 rounded" />
                <div className="w-8 h-2 bg-white/30 rounded" />
                <div className="w-8 h-2 bg-white/30 rounded" />
              </div>
            </div>
            
            {/* Mock hero text */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-3/4 h-4 bg-white/40 rounded mb-3" />
              <div className="w-1/2 h-3 bg-white/30 rounded mb-4" />
              <div
                className="px-4 py-1.5 rounded text-xs font-medium shadow-lg"
                style={{ backgroundColor: templateAccent, color: "#fff" }}
              >
                Get Started
              </div>
            </div>
            
            {/* Mock sections indicator */}
            <div className="flex justify-center gap-3 mt-4">
              <div className="w-10 h-10 bg-white/15 rounded-lg backdrop-blur-sm" />
              <div className="w-10 h-10 bg-white/15 rounded-lg backdrop-blur-sm" />
              <div className="w-10 h-10 bg-white/15 rounded-lg backdrop-blur-sm" />
            </div>
          </div>

          {/* Badges */}
          {templateBadges.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-20">
              {templateBadges.map((badge) => (
                <span
                  key={badge}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${badgeColors[badge]}`}
                >
                  {badgeIcons[badge]}
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-30">
            <Button
              variant="outline"
              className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
              onClick={() => onPreview(template)}
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              className="btn-primary gap-2"
              onClick={() => onUse(template)}
            >
              <Sparkles className="w-4 h-4" />
              Use Template
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">{templateName}</h3>
            <span
              className="w-4 h-4 rounded-full border-2 border-background shadow-sm ring-1 ring-border/50"
              style={{ backgroundColor: templateAccent }}
            />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {templateDescription}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {templateIndustry}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {templatePages.length} pages
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
