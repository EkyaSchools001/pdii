import { ReactNode } from "react";
import { PriorityBadge } from "../PriorityBadge";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  priority?: 1 | 2 | 3 | 4;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, priority, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {priority && <PriorityBadge priority={priority} />}
        </div>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
