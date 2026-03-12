import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Loader2, 
  ExternalLink, 
  Image as ImageIcon,
  Camera 
} from "lucide-react";
import { useStockImages, StockImage } from "@/hooks/useStockImages";

interface StockImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, attribution?: string) => void;
}

const POPULAR_SEARCHES = [
  "business", "technology", "nature", "office", "team", 
  "abstract", "minimal", "food", "travel", "wellness"
];

export const StockImagePicker = ({ isOpen, onClose, onSelect }: StockImagePickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<StockImage | null>(null);
  const { images, isLoading, error, searchImages, loadMore, hasMore } = useStockImages();

  useEffect(() => {
    if (isOpen && images.length === 0) {
      searchImages("");
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(searchQuery);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    searchImages(term);
  };

  const handleSelect = (image: StockImage) => {
    const attribution = `Photo by ${image.photographer} on ${image.source === "unsplash" ? "Unsplash" : "Pexels"}`;
    onSelect(image.url, attribution);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Stock Images
            <Badge variant="secondary" className="ml-2">Unsplash + Pexels</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search free high-resolution photos..."
                className="pl-10 input-field"
              />
            </div>
            <Button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <Badge
                key={term}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors capitalize"
                onClick={() => handleQuickSearch(term)}
              >
                {term}
              </Badge>
            ))}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
              <Button variant="outline" onClick={() => searchImages("")} className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {/* Image Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pr-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage?.id === image.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedImage(image)}
                  onDoubleClick={() => handleSelect(image)}
                >
                  <div className="aspect-[4/3] relative bg-secondary">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        className="btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(image);
                        }}
                      >
                        Use Image
                      </Button>
                    </div>

                    {/* Source Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 left-2 text-xs capitalize"
                    >
                      {image.source}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Loading Placeholder */}
              {isLoading && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <div key={`skeleton-${i}`} className="aspect-[4/3] bg-secondary rounded-lg animate-pulse" />
                  ))}
                </>
              )}
            </div>

            {/* Load More */}
            {hasMore && !isLoading && images.length > 0 && (
              <div className="text-center py-6">
                <Button variant="outline" onClick={loadMore}>
                  Load More Images
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && images.length === 0 && !error && (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No images found. Try a different search term.</p>
              </div>
            )}
          </ScrollArea>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src={selectedImage.thumbnailUrl}
                  alt={selectedImage.alt}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">Selected Image</p>
                  <p className="text-xs text-muted-foreground">
                    by {selectedImage.photographer} on {selectedImage.source}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedImage.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Credit
                </a>
                <Button className="btn-primary" onClick={() => handleSelect(selectedImage)}>
                  Use This Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
