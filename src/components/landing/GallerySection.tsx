import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { templates } from "@/data/templates";

export const GallerySection = () => {
  const displayedTemplates = templates.slice(0, 6);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium gradient-primary text-primary-foreground mb-4">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Template Gallery
            </span>
            <h2 className="heading-2 mb-4">
              Stunning{" "}
              <span className="gradient-text-premium">templates</span>{" "}
              for every business
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Browse our collection of professionally designed templates. Pick one and customize it with AI in seconds.
            </p>
          </motion.div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="card-glass overflow-hidden transition-all duration-300 hover:glow-md hover:scale-[1.02]">
                {/* Preview with real images */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* Background image */}
                  <img
                    src={template.images.hero}
                    alt={`${template.name} preview`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-60"
                    style={{ background: template.preview }}
                  />

                  {/* Mock website elements */}
                  <div className="absolute inset-0 p-4 flex flex-col">
                    {/* Mock nav */}
                    <div className="flex justify-between items-center mb-4">
                      <div
                        className="w-20 h-4 rounded"
                        style={{ backgroundColor: template.accent }}
                      />
                      <div className="flex gap-2">
                        <div className="w-8 h-2 bg-white/30 rounded" />
                        <div className="w-8 h-2 bg-white/30 rounded" />
                        <div className="w-8 h-2 bg-white/30 rounded" />
                      </div>
                    </div>
                    {/* Mock hero */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      <div className="w-3/4 h-4 bg-white/40 rounded mb-3" />
                      <div className="w-1/2 h-3 bg-white/30 rounded mb-4" />
                      <div
                        className="w-24 h-6 rounded shadow-lg"
                        style={{ backgroundColor: template.accent }}
                      />
                    </div>
                    {/* Mock sections */}
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="w-12 h-12 bg-white/15 rounded-lg backdrop-blur-sm" />
                      <div className="w-12 h-12 bg-white/15 rounded-lg backdrop-blur-sm" />
                      <div className="w-12 h-12 bg-white/15 rounded-lg backdrop-blur-sm" />
                    </div>
                  </div>

                  {/* Badges */}
                  {template.badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                      {template.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-sm border ${
                            badge === "Popular" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                            badge === "New" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            badge === "Trending" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                            "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/builder?template=${template.id}`}>
                      <Button className="btn-primary gap-2">
                        <Eye className="w-4 h-4" />
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span
                      className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: template.accent }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {template.industry}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/gallery">
            <Button variant="outline" className="mr-4 btn-secondary">
              View All {templates.length} Templates
            </Button>
          </Link>
          <Link to="/builder">
            <Button className="btn-primary px-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your Own Design
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
