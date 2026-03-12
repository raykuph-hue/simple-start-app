import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { TemplateCard } from "@/components/gallery/TemplateCard";
import { TemplatePreviewModal } from "@/components/gallery/TemplatePreviewModal";
import { TemplateFilters } from "@/components/gallery/TemplateFilters";
import { templates, Template } from "@/data/templates";
import { Sparkles, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Loading state component
const GalleryLoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="card-glass overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const Gallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle initial load with graceful rendering
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle hash routes gracefully (e.g., /gallery#pricing)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const filteredTemplates = useMemo(() => {
    // Defensive: ensure templates is valid
    if (!templates || !Array.isArray(templates)) {
      return [];
    }
    
    return templates.filter((template) => {
      // Defensive: validate template object
      if (!template || typeof template !== 'object') {
        return false;
      }
      
      // Search filter
      if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const name = (template.name || '').toLowerCase();
        const description = (template.description || '').toLowerCase();
        const industry = (template.industry || '').toLowerCase();
        const matchesSearch =
          name.includes(query) ||
          description.includes(query) ||
          industry.includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && template.category && template.category !== selectedCategory) {
        return false;
      }

      // Badge filter
      if (selectedBadge && Array.isArray(template.badges) && !template.badges.includes(selectedBadge as any)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedBadge]);

  const handlePreview = (template: Template) => {
    if (!template) return;
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  const handleUseTemplate = (template: Template) => {
    if (!template?.id) return;
    navigate(`/builder?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium gradient-primary text-primary-foreground mb-4">
              <LayoutGrid className="w-4 h-4" />
              Template Gallery
            </span>
            <h1 className="heading-2 mb-4">
              Choose Your <span className="gradient-text">Perfect Template</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Browse {templates.length} professionally designed templates. Pick one and customize it with AI in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="section-container">
        <TemplateFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedBadge={selectedBadge}
          onBadgeChange={setSelectedBadge}
        />
      </section>

      {/* Templates Grid */}
      <section className="section-container pb-24">
        {isLoading ? (
          <GalleryLoadingState />
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedBadge(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                onPreview={handlePreview}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Link to="/builder">
            <Button className="btn-primary px-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Create a Custom Design with AI
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewTemplate(null);
        }}
        onUse={handleUseTemplate}
      />

      <Footer />
    </div>
  );
};

export default Gallery;
