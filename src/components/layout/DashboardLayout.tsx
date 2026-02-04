import { ReactNode, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Role } from "../RoleBadge";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
  userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        role={role}
        userName={userName}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen overflow-x-hidden",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
