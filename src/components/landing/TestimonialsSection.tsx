import { Star, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Legal-compliant placeholder testimonials for Canadian compliance
// These are clearly marked as sample content - not real endorsements
const sampleTestimonials = [
  {
    name: "Alex P.",
    role: "Example Corp",
    content: "Sample testimonial — replace with your own client feedback before publishing your site.",
    avatar: "AP",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    name: "Jamie L.",
    role: "Demo Agency",
    content: "This is placeholder content to show how testimonials will appear on your finished website.",
    avatar: "JL",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Taylor R.",
    role: "Sample Studio",
    content: "Add real testimonials from your clients to build trust and credibility with visitors.",
    avatar: "TR",
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Morgan K.",
    role: "Demo Business",
    content: "Customize this section with genuine feedback from your satisfied customers.",
    avatar: "MK",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Casey D.",
    role: "Example LLC",
    content: "Replace these sample quotes with authentic reviews to showcase your work.",
    avatar: "CD",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    name: "Jordan M.",
    role: "Placeholder Inc",
    content: "Real client testimonials help establish credibility — add yours before launching.",
    avatar: "JM",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-2 mb-4">
              See what a completed site{" "}
              <span className="gradient-text-coral">could look like</span>
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Sample testimonials to show your website's testimonial layout.
            </p>
          </motion.div>
        </div>

        {/* Editor Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              These are sample testimonials — replace with real client feedback before publishing
            </span>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-glass relative"
            >
              {/* Sample Badge */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="absolute top-3 right-3 text-xs bg-muted/50 text-muted-foreground border-border/50"
                  >
                    Sample
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Replace with your real client testimonial</p>
                </TooltipContent>
              </Tooltip>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-muted-foreground/30 text-muted-foreground/30" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/70 mb-6 leading-relaxed italic">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} opacity-50 flex items-center justify-center text-sm font-semibold text-white`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground/70">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Build your own website and add real testimonials from your customers
          </p>
        </motion.div>
      </div>
    </section>
  );
};
