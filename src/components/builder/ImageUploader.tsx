import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Image as ImageIcon, Link, X, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { StockImagePicker } from "./StockImagePicker";

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
}

export const ImageUploader = ({ isOpen, onClose, onImageSelect }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showStockPicker, setShowStockPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // For now, we use a data URL - in production, upload to storage
      // This would integrate with Supabase Storage
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      setPreviewUrl(dataUrl);
      toast.success("Image ready to use");
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      setPreviewUrl(imageUrl);
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  const handleStockSelect = (stockImageUrl: string) => {
    setPreviewUrl(stockImageUrl);
    setShowStockPicker(false);
    setActiveTab("upload");
    toast.success("Stock image selected");
  };

  const handleSelect = () => {
    if (previewUrl) {
      onImageSelect(previewUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setImageUrl("");
    setPreviewUrl(null);
    setActiveTab("upload");
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Add Image
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="stock">Stock Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 mx-auto text-muted-foreground animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                  />
                  <Button variant="outline" onClick={handleUrlSubmit}>
                    <Link className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stock" className="space-y-4 mt-4">
              <div className="text-center py-6">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Free Stock Photos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Search millions of free photos from Unsplash & Pexels
                </p>
                <Button onClick={() => setShowStockPicker(true)} className="btn-primary">
                  <Camera className="w-4 h-4 mr-2" />
                  Browse Stock Photos
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          {previewUrl && (
            <div className="relative mt-4">
              <Label className="mb-2 block">Preview</Label>
              <div className="relative rounded-lg overflow-hidden bg-secondary">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={() => {
                    setPreviewUrl(null);
                    toast.error("Failed to load image");
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 bg-background/80"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="btn-primary"
              onClick={handleSelect}
              disabled={!previewUrl}
            >
              Use Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Image Picker Modal */}
      <StockImagePicker
        isOpen={showStockPicker}
        onClose={() => setShowStockPicker(false)}
        onSelect={handleStockSelect}
      />
    </>
  );
};
