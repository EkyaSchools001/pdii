import { cn } from "@/lib/utils";
import { Calendar, User, Tag, MessageSquare } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "./ui/button";

interface ObservationCardProps {
  observation: {
    id: string;
    date: string;
    observerName: string;
    observerRole: string;
    domain: string;
    score?: number;
    notes?: string;
    hasReflection?: boolean;
  };
  onReflect?: () => void;
  className?: string;
}

export function ObservationCard({ observation, onReflect, className }: ObservationCardProps) {
  return (
    <div className={cn("dashboard-card p-5 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {observation.date}
          </span>
          <PriorityBadge priority={1} showLabel={false} />
        </div>
        {observation.score !== undefined && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10 text-success font-bold">
            {observation.score}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{observation.observerName}</span>
          <span className="text-muted-foreground">• {observation.observerRole}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {observation.domain}
          </span>
        </div>
        
        {observation.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {observation.notes}
          </p>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        {observation.hasReflection ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <MessageSquare className="w-4 h-4" />
            Reflection added
          </span>
        ) : (
          <Button variant="outline" size="sm" onClick={onReflect} className="gap-1.5">
            <MessageSquare className="w-4 h-4" />
            Add Reflection
          </Button>
        )}
      </div>
    </div>
  );
}
