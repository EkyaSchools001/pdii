import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { PriorityBadge } from "./PriorityBadge";

interface TrainingEventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    topic: string;
    spotsLeft: number;
    isRegistered?: boolean;
  };
  onRegister?: () => void;
  className?: string;
}

export function TrainingEventCard({ event, onRegister, className }: TrainingEventCardProps) {
  return (
    <div className={cn("dashboard-card p-5 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-info/10 text-info">
          {event.topic}
        </span>
        <PriorityBadge priority={1} showLabel={false} />
      </div>
      
      <h3 className="font-semibold text-foreground mb-3">{event.title}</h3>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{event.spotsLeft} spots left</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        {event.isRegistered ? (
          <Button variant="outline" className="w-full" disabled>
            ✓ Registered
          </Button>
        ) : (
          <Button className="w-full" onClick={onRegister}>
            Register Now
          </Button>
        )}
      </div>
    </div>
  );
}
