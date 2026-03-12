import { motion } from "framer-motion";
import { Circle, CheckCircle2, Clock, MoreHorizontal, Calendar } from "lucide-react";

export type TaskStatus = "todo" | "in_progress" | "done" | "archived";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
  tags: string[];
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onSelect: (task: Task) => void;
}

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  todo: <Circle size={16} strokeWidth={1.5} className="text-muted-foreground" />,
  in_progress: <Clock size={16} strokeWidth={1.5} className="text-accent" />,
  done: <CheckCircle2 size={16} strokeWidth={1.5} className="text-emerald-500" />,
  archived: <Circle size={16} strokeWidth={1.5} className="text-muted-foreground/50" />,
};

const priorityDot: Record<TaskPriority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-muted-foreground/30",
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TaskCard = ({ task, onStatusChange, onSelect }: TaskCardProps) => {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: "in_progress",
    in_progress: "done",
    done: "todo",
    archived: "todo",
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="group bg-card rounded-lg p-3 cursor-pointer will-change-transform"
      style={{
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow 150ms cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
      onClick={() => onSelect(task)}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.id, nextStatus[task.status]);
          }}
          className="mt-0.5 shrink-0 hover:scale-110 transition-transform duration-150 active:scale-95"
        >
          {statusIcon[task.status]}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
          </div>
          <p className={`text-sm font-medium mt-0.5 leading-5 ${task.status === "done" ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
            {task.title}
          </p>
          {task.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {task.tags.map((tag) => (
                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Calendar size={12} strokeWidth={1.5} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
