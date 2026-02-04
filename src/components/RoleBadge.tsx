import { cn } from "@/lib/utils";
import { GraduationCap, Users, Shield } from "lucide-react";

export type Role = "teacher" | "leader" | "admin";

interface RoleBadgeProps {
  role: Role;
  showIcon?: boolean;
  className?: string;
}

const roleConfig = {
  teacher: { label: "Teacher", icon: GraduationCap, className: "role-teacher" },
  leader: { label: "School Leader", icon: Users, className: "role-leader" },
  admin: { label: "Admin", icon: Shield, className: "role-admin" },
};

export function RoleBadge({ role, showIcon = true, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.className, className)}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
