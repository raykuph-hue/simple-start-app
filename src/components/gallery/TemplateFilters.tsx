import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";

interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedBadge: string | null;
  onBadgeChange: (badge: string | null) => void;
}

const categories = [
  { value: "all", label: "All Templates" },
  { value: "business", label: "Business" },
  { value: "creative", label: "Creative" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "service", label: "Service" },
];

const badges = [
  { value: "Popular", label: "Popular" },
  { value: "New", label: "New" },
  { value: "Trending", label: "Trending" },
  { value: "Premium", label: "Premium" },
];

export const TemplateFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBadge,
  onBadgeChange,
}: TemplateFiltersProps) => {
  const hasFilters = searchQuery || selectedCategory || selectedBadge;

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange(null);
    onBadgeChange(null);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value || (cat.value === "all" && !selectedCategory) ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(cat.value === "all" ? null : cat.value)}
            className="rounded-full"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Badge filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {badges.map((badge) => (
          <Button
            key={badge.value}
            variant={selectedBadge === badge.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onBadgeChange(selectedBadge === badge.value ? null : badge.value)}
            className="rounded-full text-xs"
          >
            {badge.label}
          </Button>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="rounded-full text-xs text-muted-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
