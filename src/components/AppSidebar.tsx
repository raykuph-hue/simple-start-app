import { useState } from "react";
import { Inbox, CheckCircle2, Clock, Archive, Plus, Search, LayoutGrid } from "lucide-react";

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  taskCounts: Record<string, number>;
}

const navItems = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "active", label: "Active", icon: Clock },
  { id: "done", label: "Done", icon: CheckCircle2 },
  { id: "archive", label: "Archive", icon: Archive },
];

const AppSidebar = ({ activeView, onViewChange, taskCounts }: AppSidebarProps) => {
  return (
    <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <LayoutGrid size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium tracking-[-0.03em]">TaskFlow</span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-2 h-8 px-2 rounded-md text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="flex-1 text-left">{item.label}</span>
              {taskCounts[item.id] > 0 && (
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {taskCounts[item.id]}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground px-2">© TaskFlow</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
