import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";

type DeviceView = "desktop" | "tablet" | "mobile";

interface DevicePreviewToggleProps {
  currentView: DeviceView;
  onViewChange: (view: DeviceView) => void;
}

const deviceInfo: { view: DeviceView; icon: typeof Monitor; label: string }[] = [
  { view: "desktop", icon: Monitor, label: "Desktop" },
  { view: "tablet", icon: Tablet, label: "Tablet" },
  { view: "mobile", icon: Smartphone, label: "Mobile" },
];

export const DevicePreviewToggle = ({
  currentView,
  onViewChange,
}: DevicePreviewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {deviceInfo.map(({ view, icon: Icon, label }) => (
        <Button
          key={view}
          variant={currentView === view ? "default" : "ghost"}
          size="sm"
          className={`h-8 w-8 p-0 transition-all duration-200 ${
            currentView === view ? "shadow-md scale-105" : "hover:scale-100"
          }`}
          onClick={() => onViewChange(view)}
          title={label}
          aria-label={`Preview on ${label}`}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
};

export const getDeviceWidth = (view: DeviceView): string => {
  switch (view) {
    case "mobile":
      return "375px";
    case "tablet":
      return "768px";
    case "desktop":
    default:
      return "100%";
  }
};

export const getDeviceHeight = (view: DeviceView): string => {
  switch (view) {
    case "mobile":
      return "812px";
    case "tablet":
      return "1024px";
    case "desktop":
    default:
      return "100%";
  }
};

export type { DeviceView };
