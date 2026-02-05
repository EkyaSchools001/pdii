import { cn } from "@/lib/utils";
import { Target, Calendar, User } from "lucide-react";
import { Progress } from "./ui/progress";
import { PriorityBadge } from "./PriorityBadge";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description: string;
    progress: number;
    dueDate: string;
    assignedBy?: string;
    isSchoolAligned?: boolean;
  };
  className?: string;
}

export function GoalCard({ goal, className }: GoalCardProps) {
  return (
    <div className={cn("dashboard-card p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <Target className="w-4 h-4 text-accent" />
          </div>
          <PriorityBadge priority={2} showLabel={false} />
          {goal.isSchoolAligned && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info font-medium">
              School Priority
            </span>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-2">{goal.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{goal.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} className="h-2" />
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          Due: {goal.dueDate}
        </span>
        {goal.assignedBy && (
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {goal.assignedBy}
          </span>
        )}
      </div>
    </div>
  );
}
