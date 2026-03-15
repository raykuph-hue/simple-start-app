import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Wand2,
  Globe,
  RefreshCw,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// DnD Kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/SortableItem";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Real Estate",
  "Restaurant",
  "Fitness",
  "Creative Agency",
  "Consulting",
  "Non-profit",
  "Other",
];

const colorStyles = [
  { value: "modern", label: "Modern & Clean" },
  { value: "bold", label: "Bold & Vibrant" },
  { value: "minimal", label: "Minimal & Elegant" },
  { value: "warm", label: "Warm & Friendly" },
  { value: "dark", label: "Dark & Professional" },
  { value: "gradient", label: "Gradient & Trendy" },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly & Casual" },
  { value: "luxurious", label: "Luxurious & Premium" },
  { value: "playful", label: "Playful & Fun" },
  { value: "trustworthy", label: "Trustworthy & Reliable" },
];

const Builder = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "generating" | "preview">("form");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState<string[]>(["Home", "About", "Contact"]);
  const [currentPage, setCurrentPage] = useState("Home");
  const [newPageName, setNewPageName] = useState("");
  const [colorStyle, setColorStyle] = useState("modern");
  const [tone, setTone] = useState("professional");
  const [generatedHtml, setGeneratedHtml] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkLimit = async () => {
      if (!user) return;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan, sites_created, sites_limit")
          .eq("user_id", user.id)
          .single();
        if (
          profile &&
          profile.plan === "free" &&
          (profile.sites_created || 0) >= (profile.sites_limit || 1)
        ) {
          setLimitReached(true);
          toast.error(
            "You've reached your free plan limit. Upgrade to create more websites!"
          );
        }
      } catch (e) {
        console.error("Error checking site limit:", e);
      }
    };
    checkLimit();
  }, [user]);

  const generateSubdomain = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 30);

  // Page management
  const addPage = () => {
    if (!newPageName.trim()) return toast.error("Page name cannot be empty");
    if (pages.includes(newPageName.trim()))
      return toast.error("Page already exists");
    setPages([...pages, newPageName.trim()]);
    setNewPageName("");
  };

  const removePage = (page: string) => {
    if (pages.length <= 1) return toast.error("Cannot remove the last page");
    setPages(pages.filter((p) => p !== page));
    if (currentPage === page) setCurrentPage(pages[0]);
  };

  const renamePage = (oldName: string, newName: string) => {
    if (!newName.trim()) return toast.error("Page name cannot be empty");
    if (pages.includes(newName.trim()))
      return toast.error("Page name already exists");
    setPages(pages.map((p) => (p === oldName ? newName.trim() : p)));
    if (currentPage === oldName) setCurrentPage(newName.trim());
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = pages.indexOf(active.id.toString());
      const newIndex = pages.indexOf(over.id.toString());
      const newPages = arrayMove(pages, oldIndex, newIndex);
      setPages(newPages);

      if (websiteId) {
        try {
          await supabase.from("websites").update({ pages: newPages }).eq("id", websiteId);
        } catch (e) {
          console.error("Failed to save page order:", e);
        }
      }
    }
  };

  const handleGenerate = async () => {
    if (limitReached)
      return toast.error(
        "You've reached your free plan limit. Upgrade to create more websites!"
      );
    if (!businessName.trim()) return toast.error("Please enter a business name");
    if (!industry) return toast.error("Please select an industry");

    setIsGenerating(true);
    setStep("generating");

    try {
      const { data, error } = await supabase.functions.invoke("generate-website", {
        body: { businessName, industry, description, pages, colorStyle, tone },
      });
      if (error) throw error;

      // ✅ Fixed sub_domain insertion
      const subdomain = generateSubdomain(businessName) + "-" + Date.now().toString(36);
      const { data: websiteData, error: dbError } = await supabase
        .from("websites")
        .insert({
          user_id: user!.id,
          name: businessName,
          sub_domain: subdomain, // match DB column
          industry,
          pages,
          color_style: colorStyle,
          tone,
          html_content: JSON.stringify(data.multi_page_html),
        })
        .select()
        .single();
      if (dbError) throw dbError;

      // Update sites_created count
      const profileRes = await supabase
        .from("profiles")
        .select("sites_created")
        .eq("user_id", user!.id)
        .single();
      const currentCount = profileRes.data?.sites_created || 0;
      await supabase
        .from("profiles")
        .update({ sites_created: currentCount + 1 })
        .eq("user_id", user!.id);

      setWebsiteId(websiteData.id);
      setGeneratedHtml(data.multi_page_html);
      setCurrentPage(pages[0]);
      setStep("preview");
      toast.success("Website generated successfully!");
    } catch (error: any) {
      console.error("Error generating website:", error);
      toast.error(error.message || "Failed to generate website");
      setStep("form");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setStep("form");
    setGeneratedHtml({});
    setWebsiteId(null);
  };

  const handlePublish = async () => {
    if (!websiteId) return;
    try {
      await supabase
        .from("websites")
        .update({ pages, is_published: true })
        .eq("id", websiteId);
      toast.success("Website published successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to publish website");
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    // ...your full JSX unchanged (form, generating, preview)
    // You already have this, so no need to repeat
    <div className="min-h-screen bg-background"> ... </div>
  );
};

export default Builder;