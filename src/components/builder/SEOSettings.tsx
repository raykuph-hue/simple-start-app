import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Globe, FileText } from "lucide-react";

interface SEOSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seo: SEOData) => void;
  initialData?: SEOData;
  websiteName: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  canonicalUrl: string;
}

const defaultSEO: SEOData = {
  title: "",
  description: "",
  keywords: "",
  ogImage: "",
  favicon: "",
  canonicalUrl: "",
};

export const SEOSettings = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  websiteName,
}: SEOSettingsProps) => {
  const [seo, setSEO] = useState<SEOData>(initialData || {
    ...defaultSEO,
    title: websiteName,
  });

  const handleSave = () => {
    onSave(seo);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Settings
          </DialogTitle>
          <DialogDescription>
            Optimize your website for search engines
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="seo-title">Page Title</Label>
            <Input
              id="seo-title"
              value={seo.title}
              onChange={(e) => setSEO({ ...seo, title: e.target.value })}
              placeholder="My Awesome Website"
              className="input-field"
            />
            <p className="text-xs text-muted-foreground">
              {seo.title.length}/60 characters (recommended)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={seo.description}
              onChange={(e) => setSEO({ ...seo, description: e.target.value })}
              placeholder="A brief description of your website..."
              className="input-field min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              {seo.description.length}/160 characters (recommended)
            </p>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="seo-keywords">Keywords</Label>
            <Input
              id="seo-keywords"
              value={seo.keywords}
              onChange={(e) => setSEO({ ...seo, keywords: e.target.value })}
              placeholder="website, business, services"
              className="input-field"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of keywords
            </p>
          </div>

          {/* OG Image */}
          <div className="space-y-2">
            <Label htmlFor="seo-og-image">Social Share Image (OG Image)</Label>
            <Input
              id="seo-og-image"
              value={seo.ogImage}
              onChange={(e) => setSEO({ ...seo, ogImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="input-field"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 1200x630 pixels
            </p>
          </div>

          {/* Canonical URL */}
          <div className="space-y-2">
            <Label htmlFor="seo-canonical">Canonical URL</Label>
            <Input
              id="seo-canonical"
              value={seo.canonicalUrl}
              onChange={(e) => setSEO({ ...seo, canonicalUrl: e.target.value })}
              placeholder="https://yoursite.com"
              className="input-field"
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Search Preview</p>
            <div className="space-y-1">
              <p className="text-primary text-sm font-medium truncate">
                {seo.title || websiteName || "Page Title"}
              </p>
              <p className="text-xs text-green-500 truncate">
                yoursite.phosify.app
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {seo.description || "Add a meta description to improve SEO..."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="btn-primary" onClick={handleSave}>
            Save SEO Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
