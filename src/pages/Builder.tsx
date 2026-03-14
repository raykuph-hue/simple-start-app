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

      // Save new order immediately if website exists
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

      const subdomain = generateSubdomain(businessName) + "-" + Date.now().toString(36);
      const { data: websiteData, error: dbError } = await supabase
        .from("websites")
        .insert({
          user_id: user!.id,
          name: businessName,
          subdomain,
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
      const profileRes = await supabase.from("profiles").select("sites_created").eq("user_id", user!.id).single();
      const currentCount = profileRes.data?.sites_created || 0;
      await supabase.from("profiles").update({ sites_created: currentCount + 1 }).eq("user_id", user!.id);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="section-container flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AI Builder</span>
            </div>
          </div>

          {step === "preview" && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRegenerate} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </Button>
              <Button className="btn-primary gap-2" onClick={handlePublish}>
                <Globe className="w-4 h-4" /> Publish
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="section-container py-8">
        {step === "form" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Form Inputs */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center glow-md">
                <Wand2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create Your Website</h1>
              <p className="text-muted-foreground">Tell us about your business and manage your pages</p>
            </div>

            <div className="card-glass space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" placeholder="e.g., Acme Technologies" value={businessName} onChange={e => setBusinessName(e.target.value)} className="input-field"/>
              </div>

              <div className="space-y-2">
                <Label>Industry *</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="input-field"><SelectValue placeholder="Select your industry"/></SelectTrigger>
                  <SelectContent>{industries.map(ind => <SelectItem key={ind} value={ind.toLowerCase()}>{ind}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea id="description" placeholder="Briefly describe what your business does..." value={description} onChange={e => setDescription(e.target.value)} className="input-field min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label>Color Style</Label>
                <Select value={colorStyle} onValueChange={setColorStyle}>
                  <SelectTrigger className="input-field"><SelectValue/></SelectTrigger>
                  <SelectContent>{colorStyles.map(style => <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone & Voice</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="input-field"><SelectValue/></SelectTrigger>
                  <SelectContent>{tones.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Pages */}
              <div className="space-y-2">
                <Label>Pages</Label>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={pages} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                      {pages.map(page => (
                        <SortableItem key={page} id={page}>
                          <div className="flex items-center gap-2 bg-secondary/20 px-2 py-1 rounded">
                            <span>{page}</span>
                            <Trash2 className="w-4 h-4 cursor-pointer text-red-500" onClick={() => removePage(page)} />
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="New page name" value={newPageName} onChange={e => setNewPageName(e.target.value)} />
                  <Button onClick={addPage}>Add Page</Button>
                </div>
              </div>

              <Button className="btn-primary w-full py-6 text-lg" onClick={handleGenerate}>
                <Sparkles className="w-5 h-5 mr-2" /> Generate Website
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center glow-lg mb-8 animate-pulse-slow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Generating Your Website</h2>
            <p className="text-muted-foreground mb-8">AI is creating your custom website...</p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin"/>
              <span>This usually takes 10-30 seconds</span>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Preview Your Website</h2>
                <p className="text-muted-foreground">Review your AI-generated website before publishing</p>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span>Generated successfully</span>
              </div>
            </div>

            {/* Page Selector */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {pages.map(page => (
                <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)}>{page}</Button>
              ))}
            </div>

            <div className="gradient-border rounded-xl p-1">
              <div className="bg-card rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 p-3 border-b border-border bg-secondary/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded px-3 py-1.5 text-sm text-muted-foreground text-center">
                      {generateSubdomain(businessName)}.phosify.app/{currentPage.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="aspect-video bg-white">
                  <iframe srcDoc={generatedHtml[currentPage]} className="w-full h-full border-0" title={`Preview ${currentPage}`} sandbox="allow-scripts"/>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button variant="outline" onClick={handleRegenerate} className="btn-secondary gap-2">
                <RefreshCw className="w-4 h-4"/> Regenerate
              </Button>
              <Button className="btn-primary gap-2 px-8" onClick={handlePublish}>
                <Globe className="w-4 h-4"/> Publish Website
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Builder;