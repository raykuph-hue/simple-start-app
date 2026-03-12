import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Monitor, Smartphone, Tablet, Check, ExternalLink, ImageOff } from "lucide-react";
import { Template, TemplateImage } from "@/data/templates";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (template: Template) => void;
}

type DeviceView = "desktop" | "tablet" | "mobile";

// Fallback placeholder images when API fails or images unavailable
const fallbackImages: TemplateImage = {
  hero: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop",
  feature1: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=600&h=400&fit=crop",
  feature2: "https://images.unsplash.com/photo-1557683304-673a23048d34?w=600&h=400&fit=crop",
  feature3: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1557682260-96773eb01377?w=400&h=300&fit=crop",
  ],
};

// Device configuration for accurate preview dimensions
const deviceConfig: Record<DeviceView, { width: string; height: string; frame: boolean; notch?: boolean }> = {
  desktop: { width: "100%", height: "100%", frame: true },
  tablet: { width: "768px", height: "100%", frame: true },
  mobile: { width: "375px", height: "100%", frame: true, notch: true },
};

export const TemplatePreviewModal = ({
  template,
  isOpen,
  onClose,
  onUse,
}: TemplatePreviewModalProps) => {
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset state when modal opens or template changes
  useEffect(() => {
    if (isOpen && template) {
      setImagesLoaded({});
      setImageErrors({});
      setDeviceView("desktop");
    }
  }, [isOpen, template]);

  // Handle device change with smooth transition
  const handleDeviceChange = (newView: DeviceView) => {
    if (newView === deviceView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setDeviceView(newView);
      setTimeout(() => setIsTransitioning(false), 150);
    }, 150);
  };

  const handleImageLoad = (imageKey: string) => {
    setImagesLoaded((prev) => ({ ...prev, [imageKey]: true }));
  };

  const handleImageError = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }));
    setImagesLoaded((prev) => ({ ...prev, [imageKey]: true }));
  };

  // Early return for invalid state
  if (!template || !isOpen) return null;

  // Defensive data extraction
  const templateImages: TemplateImage = template.images || { hero: '' };
  const templatePages = Array.isArray(template.pages) ? template.pages : [];
  const templateFeatures = Array.isArray(template.features) ? template.features : [];
  const templateBadges = Array.isArray(template.badges) ? template.badges : [];

  // Safe image getter with fallback
  const getImageUrl = (key: keyof TemplateImage, index?: number): string => {
    if (key === 'gallery' && index !== undefined) {
      const gallery = templateImages.gallery;
      if (imageErrors[`gallery${index}`] || !gallery?.[index]) {
        return fallbackImages.gallery?.[index % 3] || fallbackImages.hero;
      }
      return gallery[index];
    }
    const imageUrl = templateImages[key];
    if (imageErrors[key] || !imageUrl || typeof imageUrl !== 'string') {
      return (fallbackImages[key] as string) || fallbackImages.hero;
    }
    return imageUrl;
  };

  const config = deviceConfig[deviceView];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-xl font-bold">{template.name}</DialogTitle>
            <Badge variant="secondary">{template.industry}</Badge>
          </div>
          <div className="flex items-center gap-3">
            {/* Device toggles with smooth animation */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(["desktop", "tablet", "mobile"] as DeviceView[]).map((view) => {
                const Icon = view === "desktop" ? Monitor : view === "tablet" ? Tablet : Smartphone;
                return (
                  <Button
                    key={view}
                    variant={deviceView === view ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 transition-all duration-200 ${
                      deviceView === view ? "shadow-lg" : ""
                    }`}
                    onClick={() => handleDeviceChange(view)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
            <Button className="btn-primary gap-2" onClick={() => onUse(template)}>
              <Sparkles className="w-4 h-4" />
              Use This Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Preview Area */}
          <div className="flex-1 bg-secondary/30 flex items-start justify-center p-6 overflow-auto">
            <div
              className={`transition-all duration-300 ease-out ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
              style={{
                width: config.width,
                maxWidth: "100%",
              }}
            >
              {/* Device Frame */}
              <div
                className={`bg-card rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                  deviceView !== "desktop" ? "mx-auto" : ""
                }`}
                style={{
                  width: deviceView === "desktop" ? "100%" : config.width,
                  maxWidth: "100%",
                }}
              >
                {/* Browser Chrome / Device Frame */}
                {config.frame && (
                  <div className={`flex items-center gap-2 p-3 border-b border-border bg-secondary/50 ${
                    deviceView === "mobile" ? "justify-center" : ""
                  }`}>
                    {deviceView === "mobile" && config.notch ? (
                      <div className="w-24 h-6 bg-muted rounded-full" />
                    ) : (
                      <>
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive/60" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                          <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        </div>
                        <div className="flex-1 mx-2 max-w-md">
                          <div className="bg-muted rounded-md px-3 py-1.5 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                            <span>yoursite.phosify.app</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Template Content Preview */}
                <div
                  className="overflow-y-auto overflow-x-hidden"
                  style={{
                    height: deviceView === "desktop" ? "calc(90vh - 180px)" : "calc(90vh - 200px)",
                    background: template.preview,
                  }}
                >
                  {/* Hero Section with Real Image */}
                  <section className="relative">
                    {/* Hero Background Image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      {!imagesLoaded["hero"] && (
                        <Skeleton className="absolute inset-0 w-full h-full" />
                      )}
                      <img
                        src={getImageUrl("hero")}
                        alt={`${template.name} hero`}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${
                          imagesLoaded["hero"] ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad("hero")}
                        onError={() => handleImageError("hero")}
                        loading="eager"
                      />
                      {/* Gradient Overlay */}
                      <div 
                        className="absolute inset-0" 
                        style={{ 
                          background: `linear-gradient(180deg, transparent 0%, ${template.preview.includes("f8f9fa") ? "rgba(248,249,250,0.9)" : "rgba(0,0,0,0.7)"} 100%)` 
                        }} 
                      />
                    </div>

                    {/* Hero Content Overlay */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* Nav */}
                      <div className={`flex justify-between items-center ${
                        deviceView === "mobile" ? "p-4" : "p-6"
                      }`}>
                        <div
                          className="h-6 rounded font-semibold text-white/90"
                          style={{ 
                            backgroundColor: template.accent,
                            padding: "4px 12px",
                            fontSize: deviceView === "mobile" ? "12px" : "14px"
                          }}
                        >
                          {template.name}
                        </div>
                        {deviceView !== "mobile" && (
                          <div className="flex gap-4">
                            {template.pages.slice(0, 4).map((page) => (
                              <div key={page} className="text-sm text-white/70 hover:text-white/90 cursor-pointer transition-colors">
                                {page}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hero Text */}
                      <div className={`flex-1 flex flex-col justify-center items-center text-center ${
                        deviceView === "mobile" ? "px-4 py-8" : "px-8 py-16"
                      }`}>
                        <h1 className={`font-bold text-white mb-4 ${
                          deviceView === "mobile" ? "text-2xl" : deviceView === "tablet" ? "text-3xl" : "text-4xl"
                        }`}>
                          {template.name} Website
                        </h1>
                        <p className={`text-white/80 mb-6 max-w-xl ${
                          deviceView === "mobile" ? "text-sm" : "text-base"
                        }`}>
                          {template.description}
                        </p>
                        <button
                          className={`rounded-lg font-medium shadow-lg transition-transform hover:scale-105 ${
                            deviceView === "mobile" ? "px-6 py-2.5 text-sm" : "px-8 py-3"
                          }`}
                          style={{ 
                            backgroundColor: template.accent, 
                            color: template.preview.includes("f8f9fa") ? "#000" : "#fff" 
                          }}
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Features Section with Real Images */}
                  <section className={`${deviceView === "mobile" ? "p-4" : "p-8"}`} style={{
                    background: template.preview.includes("f8f9fa") ? "#fff" : "rgba(0,0,0,0.3)"
                  }}>
                    <h2 className={`font-bold text-center mb-8 ${
                      template.preview.includes("f8f9fa") ? "text-gray-900" : "text-white"
                    } ${deviceView === "mobile" ? "text-xl" : "text-2xl"}`}>
                      Our Features
                    </h2>
                    <div className={`grid gap-4 ${
                      deviceView === "mobile" ? "grid-cols-1" : deviceView === "tablet" ? "grid-cols-2" : "grid-cols-3"
                    }`}>
                      {[
                        getImageUrl("feature1"),
                        getImageUrl("feature2"),
                        getImageUrl("feature3")
                      ].map((imgSrc, i) => (
                          <div key={i} className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 transition-transform hover:scale-[1.02]">
                            <div className="relative aspect-[3/2]">
                              {!imagesLoaded[`feature${i + 1}`] && (
                                <Skeleton className="absolute inset-0 w-full h-full" />
                              )}
                              <img
                                src={imgSrc}
                                alt={`Feature ${i + 1}`}
                                className={`w-full h-full object-cover transition-opacity duration-500 ${
                                  imagesLoaded[`feature${i + 1}`] ? "opacity-100" : "opacity-0"
                                }`}
                                onLoad={() => handleImageLoad(`feature${i + 1}`)}
                                onError={() => handleImageError(`feature${i + 1}`)}
                                loading="lazy"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className={`font-semibold mb-1 ${
                                template.preview.includes("f8f9fa") ? "text-gray-900" : "text-white"
                              }`}>
                                {templateFeatures[i] || `Feature ${i + 1}`}
                              </h3>
                              <p className={`text-sm ${
                                template.preview.includes("f8f9fa") ? "text-gray-600" : "text-white/70"
                              }`}>
                                Professional quality design
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>

                  {/* Gallery Section with Real Images */}
                  {templateImages.gallery && Array.isArray(templateImages.gallery) && templateImages.gallery.length > 0 && (
                    <section className={`${deviceView === "mobile" ? "p-4" : "p-8"}`} style={{
                      background: template.preview.includes("f8f9fa") ? "#f8f9fa" : "rgba(0,0,0,0.2)"
                    }}>
                      <h2 className={`font-bold text-center mb-8 ${
                        template.preview.includes("f8f9fa") ? "text-gray-900" : "text-white"
                      } ${deviceView === "mobile" ? "text-xl" : "text-2xl"}`}>
                        Gallery
                      </h2>
                      <div className={`grid gap-3 ${
                        deviceView === "mobile" ? "grid-cols-2" : "grid-cols-3"
                      }`}>
                        {templateImages.gallery.map((imgSrc, i) => (
                          <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                            {!imagesLoaded[`gallery${i}`] && (
                              <Skeleton className="absolute inset-0 w-full h-full" />
                            )}
                            <img
                              src={getImageUrl("gallery", i)}
                              alt={`Gallery ${i + 1}`}
                              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                imagesLoaded[`gallery${i}`] ? "opacity-100" : "opacity-0"
                              }`}
                              onLoad={() => handleImageLoad(`gallery${i}`)}
                              onError={() => handleImageError(`gallery${i}`)}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* CTA Section */}
                  <section className={`text-center ${deviceView === "mobile" ? "p-6" : "p-12"}`} style={{
                    background: `linear-gradient(135deg, ${template.accent}22 0%, ${template.accent}44 100%)`
                  }}>
                    <h2 className={`font-bold mb-4 ${
                      template.preview.includes("f8f9fa") ? "text-gray-900" : "text-white"
                    } ${deviceView === "mobile" ? "text-xl" : "text-2xl"}`}>
                      Ready to Get Started?
                    </h2>
                    <p className={`mb-6 ${
                      template.preview.includes("f8f9fa") ? "text-gray-600" : "text-white/80"
                    } ${deviceView === "mobile" ? "text-sm" : "text-base"}`}>
                      Start building your website today
                    </p>
                    <button
                      className={`rounded-lg font-medium shadow-lg ${
                        deviceView === "mobile" ? "px-6 py-2.5 text-sm" : "px-8 py-3"
                      }`}
                      style={{ 
                        backgroundColor: template.accent, 
                        color: template.preview.includes("f8f9fa") ? "#000" : "#fff" 
                      }}
                    >
                      Get Started Now
                    </button>
                  </section>

                  {/* Footer */}
                  <footer className={`border-t ${
                    template.preview.includes("f8f9fa") ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"
                  } ${deviceView === "mobile" ? "p-4" : "p-6"}`}>
                    <div className={`flex items-center justify-between ${
                      deviceView === "mobile" ? "flex-col gap-3" : ""
                    }`}>
                      <div
                        className="font-semibold"
                        style={{ color: template.accent }}
                      >
                        {template.name}
                      </div>
                      <div className={`text-sm ${
                        template.preview.includes("f8f9fa") ? "text-gray-500" : "text-white/50"
                      }`}>
                        © 2024 All rights reserved
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-72 border-l border-border p-4 space-y-6 overflow-y-auto shrink-0 hidden lg:block">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-sm">{template.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Included Pages</h4>
              <ul className="space-y-1">
                {templatePages.map((page) => (
                  <li key={page} className="flex items-center gap-2 text-sm">
                    <Check className="w-3 h-3 text-primary" />
                    {page}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Features</h4>
              <ul className="space-y-1">
                {templateFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-3 h-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Accent Color</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-border shadow-inner"
                  style={{ backgroundColor: template.accent }}
                />
                <span className="text-sm font-mono">{template.accent}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                className="w-full btn-primary gap-2" 
                onClick={() => onUse(template)}
              >
                <Sparkles className="w-4 h-4" />
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
