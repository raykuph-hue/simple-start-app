import { useState } from "react";
import { X, Plus } from "lucide-react";
import { TaskStatus, TaskPriority, Task } from "./TaskCard";

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
}

const NewTaskDialog = ({ open, onClose, onSubmit }: NewTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      tags,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setTags([]);
    setTagInput("");
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div
        className="relative bg-card rounded-xl p-6 w-full max-w-lg mx-4"
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium tracking-[-0.03em]">New Task</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors duration-150">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full h-9 px-3 rounded-md bg-transparent text-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-transparent text-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-9 px-3 rounded-md bg-transparent text-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-9 px-3 rounded-md bg-transparent text-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 h-9 px-3 rounded-md bg-transparent text-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
              <button type="button" onClick={addTag} className="h-9 px-3 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors duration-150">
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    {tag} <X size={10} />
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-150 active:scale-[0.98]">
              Cancel
            </button>
            <button type="submit" className="h-9 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 active:scale-[0.98]">
              <span className="flex items-center gap-1.5">
                <Plus size={14} strokeWidth={2} />
                Create Task
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskDialog;
