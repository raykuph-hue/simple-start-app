import { motion } from "framer-motion";
import TaskCard, { Task, TaskStatus } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
}

const TaskColumn = ({ title, tasks, onStatusChange, onSelectTask }: TaskColumnProps) => {
  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-2 px-1 mb-3">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <span className="text-xs font-mono text-muted-foreground tabular-nums">{tasks.length}</span>
      </div>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.04 } },
        }}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onSelect={onSelectTask}
          />
        ))}
      </motion.div>
      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground px-1 py-6 text-center">No tasks here.</p>
      )}
    </div>
  );
};

export default TaskColumn;
