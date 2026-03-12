import { Button } from "@/components/ui/button";
import {
  Type,
  Image,
  Square,
  Layout,
  Columns,
  MessageSquare,
  Star,
  CreditCard,
  Mail,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Video,
} from "lucide-react";

interface SectionPaletteProps {
  onAddSection: (sectionType: string) => void;
}

const sections = [
  { type: "hero", label: "Hero", icon: Layout, description: "Main banner section" },
  { type: "features", label: "Features", icon: Columns, description: "Feature grid" },
  { type: "text", label: "Text Block", icon: Type, description: "Text content" },
  { type: "image", label: "Image", icon: Image, description: "Single image" },
  { type: "gallery", label: "Gallery", icon: Square, description: "Image gallery" },
  { type: "testimonials", label: "Testimonials", icon: MessageSquare, description: "Reviews" },
  { type: "pricing", label: "Pricing", icon: CreditCard, description: "Pricing tables" },
  { type: "cta", label: "Call to Action", icon: Star, description: "CTA section" },
  { type: "contact", label: "Contact Form", icon: Mail, description: "Contact form" },
  { type: "map", label: "Map", icon: MapPin, description: "Location map" },
  { type: "team", label: "Team", icon: Users, description: "Team members" },
  { type: "services", label: "Services", icon: Briefcase, description: "Service list" },
  { type: "faq", label: "FAQ", icon: FileText, description: "FAQ accordion" },
  { type: "video", label: "Video", icon: Video, description: "Video embed" },
  { type: "schedule", label: "Schedule", icon: Calendar, description: "Event schedule" },
];

export const SectionPalette = ({ onAddSection }: SectionPaletteProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Add Section</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sections.map((section) => (
          <Button
            key={section.type}
            variant="outline"
            className="h-auto py-3 px-2 flex flex-col items-center gap-1 hover:border-primary/50 hover:bg-primary/5"
            onClick={() => onAddSection(section.type)}
            title={section.description}
          >
            <section.icon className="w-4 h-4" />
            <span className="text-xs">{section.label}</span>
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Click to add a section to your page
      </p>
    </div>
  );
};
