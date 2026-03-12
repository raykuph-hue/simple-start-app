import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  GripVertical,
  Home,
  Info,
  Mail,
  FileText,
  ShoppingCart,
  Users,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

interface PageManagerProps {
  pages: string[];
  activePage: string;
  onPageSelect: (page: string) => void;
  onPagesChange: (pages: string[]) => void;
}

const pageIcons: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  about: <Info className="w-4 h-4" />,
  contact: <Mail className="w-4 h-4" />,
  services: <Briefcase className="w-4 h-4" />,
  products: <ShoppingCart className="w-4 h-4" />,
  team: <Users className="w-4 h-4" />,
};

const getPageIcon = (page: string) => {
  const key = page.toLowerCase();
  return pageIcons[key] || <FileText className="w-4 h-4" />;
};

export const PageManager = ({
  pages,
  activePage,
  onPageSelect,
  onPagesChange,
}: PageManagerProps) => {
  const [newPageName, setNewPageName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      toast.error("Please enter a page name");
      return;
    }

    if (pages.some((p) => p.toLowerCase() === newPageName.toLowerCase())) {
      toast.error("Page already exists");
      return;
    }

    if (pages.length >= 10) {
      toast.error("Maximum 10 pages allowed");
      return;
    }

    onPagesChange([...pages, newPageName.trim()]);
    setNewPageName("");
    setIsAdding(false);
    toast.success(`Page "${newPageName}" added`);
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      toast.error("You need at least one page");
      return;
    }

    const pageName = pages[index];
    const newPages = pages.filter((_, i) => i !== index);
    onPagesChange(newPages);

    if (activePage === pageName) {
      onPageSelect(newPages[0]);
    }

    toast.success(`Page "${pageName}" deleted`);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);
    onPagesChange(newPages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Pages</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      {/* Add Page Input */}
      {isAdding && (
        <div className="flex gap-2 mb-2">
          <Input
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAddPage()}
            autoFocus
          />
          <Button size="sm" className="h-8" onClick={handleAddPage}>
            Add
          </Button>
        </div>
      )}

      {/* Page List */}
      <div className="space-y-1">
        {pages.map((page, index) => (
          <div
            key={page}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
              transition-all duration-150 group
              ${activePage === page ? "bg-primary/20 text-primary" : "hover:bg-secondary"}
              ${draggedIndex === index ? "opacity-50" : ""}
            `}
            onClick={() => onPageSelect(page)}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
            {getPageIcon(page)}
            <span className="flex-1 text-sm truncate">{page}</span>
            {pages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePage(index);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Drag to reorder • {pages.length}/10 pages
      </p>
    </div>
  );
};
