import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Type,
  Palette,
  Image,
  Save,
  X,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";

interface WebsiteEditorProps {
  htmlContent: string;
  onSave: (newHtml: string) => void;
  onClose: () => void;
}

export const WebsiteEditor = ({ htmlContent, onSave, onClose }: WebsiteEditorProps) => {
  const [editedHtml, setEditedHtml] = useState(htmlContent);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<"text" | "color" | "image" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Simple text replacement in HTML
  const replaceText = useCallback((oldText: string, newText: string) => {
    const updated = editedHtml.replace(oldText, newText);
    setEditedHtml(updated);
    toast.success("Text updated!");
  }, [editedHtml]);

  // Color replacement
  const replaceColor = useCallback((oldColor: string, newColor: string) => {
    const updated = editedHtml.replace(new RegExp(oldColor, "gi"), newColor);
    setEditedHtml(updated);
    toast.success("Color updated!");
  }, [editedHtml]);

  // Handle iframe message for element selection
  const handleIframeClick = useCallback((event: MessageEvent) => {
    if (event.data.type === "elementSelected") {
      setSelectedElement(event.data.text);
      setEditValue(event.data.text);
      setEditMode("text");
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedHtml);
      toast.success("Website saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const applyTextChange = () => {
    if (selectedElement && editValue !== selectedElement) {
      replaceText(selectedElement, editValue);
      setSelectedElement(editValue);
    }
    setEditMode(null);
  };

  const applyColorChange = () => {
    if (editValue) {
      // Find and replace color values
      replaceColor(selectedElement || "", editValue);
    }
    setEditMode(null);
  };

  // Inject editor script into iframe content
  const editorScript = `
    <script>
      document.addEventListener('click', function(e) {
        e.preventDefault();
        const text = e.target.innerText || e.target.textContent;
        if (text && text.trim()) {
          window.parent.postMessage({
            type: 'elementSelected',
            text: text.trim(),
            tagName: e.target.tagName
          }, '*');
          e.target.style.outline = '2px solid #00d4ff';
          setTimeout(() => { e.target.style.outline = ''; }, 1000);
        }
      });
    </script>
  `;

  const iframeContent = editedHtml.replace("</body>", `${editorScript}</body>`);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Editor Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold">Website Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Toolbar */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border bg-card p-4 space-y-6 overflow-y-auto max-h-[40vh] md:max-h-none">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Edit Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={editMode === "text" ? "default" : "outline"}
                size="sm"
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => setEditMode("text")}
              >
                <Type className="w-4 h-4" />
                <span className="text-xs">Text</span>
              </Button>
              <Button
                variant={editMode === "color" ? "default" : "outline"}
                size="sm"
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => setEditMode("color")}
              >
                <Palette className="w-4 h-4" />
                <span className="text-xs">Color</span>
              </Button>
              <Button
                variant={editMode === "image" ? "default" : "outline"}
                size="sm"
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => setEditMode("image")}
              >
                <Image className="w-4 h-4" />
                <span className="text-xs">Image</span>
              </Button>
            </div>
          </div>

          {/* Text Editor Panel */}
          {editMode === "text" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Edit Text</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Click on any text in the preview to select it
                </p>
                {selectedElement && (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="input-field mb-2"
                      placeholder="Enter new text"
                    />
                    <div className="flex gap-2 mb-3">
                      <Button variant="outline" size="sm">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlignRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button className="w-full" onClick={applyTextChange}>
                      Apply Change
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Color Editor Panel */}
          {editMode === "color" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Change Colors</label>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Find Color</span>
                    <Input
                      type="text"
                      placeholder="#000000"
                      value={selectedElement || ""}
                      onChange={(e) => setSelectedElement(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Replace With</span>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editValue || "#00d4ff"}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-12 h-10 p-1 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input-field flex-1"
                        placeholder="#00d4ff"
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={applyColorChange}>
                    Apply Color
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Image Editor Panel */}
          {editMode === "image" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Replace Image</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Paste a new image URL to replace existing images
                </p>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="input-field mb-3"
                />
                <Button className="w-full" disabled>
                  Replace Image (Coming Soon)
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Click text in preview to select it</li>
              <li>• Use color picker to change colors</li>
              <li>• Changes are saved to your website</li>
            </ul>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-secondary/20 p-2 md:p-4 overflow-hidden min-h-0">
          <div className="bg-white rounded-lg overflow-hidden h-full shadow-lg">
            <iframe
              srcDoc={iframeContent}
              className="w-full h-full border-0"
              title="Website Editor Preview"
              onLoad={() => {
                window.addEventListener("message", handleIframeClick);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
