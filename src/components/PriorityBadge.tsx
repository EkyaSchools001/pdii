import { cn } from "@/lib/utils";

type Priority = 1 | 2 | 3 | 4;

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

const priorityConfig = {
  1: { label: "P1", description: "Critical", className: "priority-1" },
  2: { label: "P2", description: "High-value", className: "priority-2" },
  3: { label: "P3", description: "Enhancement", className: "priority-3" },
  4: { label: "P4", description: "Advanced", className: "priority-4" },
};

export function PriorityBadge({ priority, showLabel = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn("priority-badge", config.className, className)}>
      {config.label}
      {showLabel && <span className="ml-1 opacity-75">• {config.description}</span>}
    </span>
  );
}
