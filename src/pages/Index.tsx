import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import TaskColumn from "@/components/TaskColumn";
import TaskCard, { Task, TaskStatus } from "@/components/TaskCard";
import NewTaskDialog from "@/components/NewTaskDialog";
import TaskDetail from "@/components/TaskDetail";
import { motion } from "framer-motion";

const initialTasks: Task[] = [
  { id: "TSK-001", title: "Design system tokens", description: "Define color palette, typography, and spacing tokens for the design system.", status: "done", priority: "high", createdAt: new Date("2026-03-01"), tags: ["design"] },
  { id: "TSK-002", title: "Set up project structure", status: "done", priority: "medium", createdAt: new Date("2026-03-02"), tags: ["setup"] },
  { id: "TSK-003", title: "Build sidebar navigation", status: "in_progress", priority: "medium", createdAt: new Date("2026-03-05"), tags: ["ui"] },
  { id: "TSK-004", title: "Implement task card component", description: "Create the task card with status toggle, priority indicator, and metadata.", status: "in_progress", priority: "high", createdAt: new Date("2026-03-06"), tags: ["ui", "component"] },
  { id: "TSK-005", title: "Add search and filtering", status: "todo", priority: "medium", createdAt: new Date("2026-03-08"), tags: ["feature"] },
  { id: "TSK-006", title: "Write documentation", status: "todo", priority: "low", createdAt: new Date("2026-03-10"), dueDate: new Date("2026-03-20"), tags: ["docs"] },
  { id: "TSK-007", title: "Keyboard shortcuts", status: "todo", priority: "low", createdAt: new Date("2026-03-11"), tags: ["ux"] },
];

let nextId = 8;

const viewTitles: Record<string, string> = {
  inbox: "Inbox",
  active: "Active",
  done: "Done",
  archive: "Archive",
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeView, setActiveView] = useState("inbox");
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");

  const taskCounts = useMemo(() => ({
    inbox: tasks.filter((t) => t.status !== "archived" && t.status !== "done").length,
    active: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    archive: tasks.filter((t) => t.status === "archived").length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (activeView === "inbox") filtered = tasks.filter((t) => t.status !== "archived");
    else if (activeView === "active") filtered = tasks.filter((t) => t.status === "in_progress");
    else if (activeView === "done") filtered = tasks.filter((t) => t.status === "done");
    else if (activeView === "archive") filtered = tasks.filter((t) => t.status === "archived");

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)));
    }
    return filtered;
  }, [tasks, activeView, search]);

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleNewTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const id = `TSK-${String(nextId++).padStart(3, "0")}`;
    setTasks((prev) => [{ ...taskData, id, createdAt: new Date() }, ...prev]);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress");
  const doneTasks = filteredTasks.filter((t) => t.status === "done");

  const showColumns = activeView === "inbox";

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} taskCounts={taskCounts} />

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 h-14">
            <h1 className="text-2xl font-medium tracking-[-0.03em]">{viewTitles[activeView]}</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="h-9 pl-9 pr-3 w-56 rounded-md bg-transparent text-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setShowNewTask(true)}
                className="h-9 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 active:scale-[0.98] flex items-center gap-1.5"
              >
                <Plus size={14} strokeWidth={2} />
                New Task
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {showColumns ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskColumn title="To Do" tasks={todoTasks} onStatusChange={handleStatusChange} onSelectTask={setSelectedTask} />
              <TaskColumn title="In Progress" tasks={inProgressTasks} onStatusChange={handleStatusChange} onSelectTask={setSelectedTask} />
              <TaskColumn title="Done" tasks={doneTasks} onStatusChange={handleStatusChange} onSelectTask={setSelectedTask} />
            </div>
          ) : (
            <motion.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
              initial="hidden"
              animate="show"
              className="space-y-2 max-w-2xl"
            >
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onSelect={setSelectedTask} />
              ))}
              {filteredTasks.length === 0 && (
                <p className="text-sm text-muted-foreground py-12 text-center">No tasks here. Create one to get started.</p>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <NewTaskDialog open={showNewTask} onClose={() => setShowNewTask(false)} onSubmit={handleNewTask} />
      <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </div>
  );
};

export default Index;
