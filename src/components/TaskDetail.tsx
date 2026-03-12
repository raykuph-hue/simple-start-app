import { useState } from "react";
import { X, Circle, CheckCircle2, Clock, Calendar, Trash2 } from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "./TaskCard";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  archived: "Archived",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const TaskDetail = ({ task, onClose, onStatusChange, onDelete }: TaskDetailProps) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div
        className="relative bg-card rounded-xl p-6 w-full max-w-lg mx-4"
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors duration-150">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <h2 className="text-xl font-medium tracking-[-0.03em] mb-2">{task.title}</h2>
        {task.description && (
          <p className="text-sm text-muted-foreground leading-6 mb-4">{task.description}</p>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="h-8 px-2 rounded-md bg-secondary text-sm text-secondary-foreground border-none focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Priority</span>
            <span className="text-sm font-medium">{priorityLabels[task.priority]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">{task.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          {task.tags.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tags</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <button
            onClick={() => { onDelete(task.id); onClose(); }}
            className="h-9 px-4 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-150 active:scale-[0.98] flex items-center gap-1.5"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Delete
          </button>
          <button onClick={onClose} className="h-9 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 active:scale-[0.98]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
