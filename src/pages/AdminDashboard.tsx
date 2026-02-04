import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Users, FileText, BookOpen, Calendar, Settings, Shield, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const quickStats = [
  { label: "Total Users", value: "248", change: "+12 this month" },
  { label: "Active Forms", value: "8", change: "2 pending approval" },
  { label: "Courses", value: "34", change: "5 new this quarter" },
  { label: "Training Events", value: "12", change: "This month" },
];

const recentActivity = [
  { id: "1", action: "User role updated", user: "admin@school.edu", target: "Maria Santos → Department Head", time: "2 hours ago" },
  { id: "2", action: "Form template created", user: "admin@school.edu", target: "Classroom Observation v2", time: "5 hours ago" },
  { id: "3", action: "Course added", user: "admin@school.edu", target: "Differentiated Instruction Workshop", time: "1 day ago" },
  { id: "4", action: "Training event scheduled", user: "admin@school.edu", target: "Technology Integration Seminar", time: "2 days ago" },
];

const adminModules = [
  {
    title: "User Management",
    description: "Manage users, roles, and permissions across the platform",
    icon: Users,
    path: "/admin/users",
    priority: 1 as const,
    stats: "248 active users",
  },
  {
    title: "Form Templates",
    description: "Create and manage observation and goal-setting forms",
    icon: FileText,
    path: "/admin/forms",
    priority: 1 as const,
    stats: "8 templates",
  },
  {
    title: "Course Catalogue",
    description: "Manage courses, prerequisites, and PD hour assignments",
    icon: BookOpen,
    path: "/admin/courses",
    priority: 3 as const,
    stats: "34 courses",
  },
  {
    title: "Training Calendar",
    description: "Schedule and manage training events across campuses",
    icon: Calendar,
    path: "/admin/calendar",
    priority: 2 as const,
    stats: "12 events this month",
  },
  {
    title: "Reports & Analytics",
    description: "Generate cross-campus analytics and comparison reports",
    icon: Activity,
    path: "/admin/reports",
    priority: 2 as const,
    stats: "Export to PDF/Excel",
  },
  {
    title: "Platform Settings",
    description: "Configure observation rules, workflows, and system settings",
    icon: Settings,
    path: "/admin/settings",
    priority: 1 as const,
    stats: "System configuration",
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" userName="Admin User">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage platform settings, users, and content"
        priority={1}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="248"
          subtitle="+12 this month"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          priority={1}
        />
        <StatCard
          title="Active Forms"
          value="8"
          subtitle="2 pending approval"
          icon={FileText}
          priority={1}
        />
        <StatCard
          title="Courses"
          value="34"
          subtitle="5 new this quarter"
          icon={BookOpen}
          priority={3}
        />
        <StatCard
          title="Training Events"
          value="12"
          subtitle="This month"
          icon={Calendar}
          priority={2}
        />
      </div>

      {/* Admin Modules Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Platform Management</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Link
              key={module.title}
              to={module.path}
              className="dashboard-card p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <module.icon className="w-6 h-6" />
                </div>
                <PriorityBadge priority={module.priority} showLabel={false} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{module.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
              <span className="text-xs text-primary font-medium">{module.stats}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Audit Log Preview */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
              <PriorityBadge priority={2} showLabel={false} />
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/audit">View Audit Log</Link>
            </Button>
          </div>
          
          <div className="dashboard-card divide-y">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.target}</p>
                    <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">System Status</h2>
              <PriorityBadge priority={1} showLabel={false} />
            </div>
          </div>
          
          <div className="dashboard-card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <div className="flex-1">
                <p className="font-medium text-foreground">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">Last checked: 2 minutes ago</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="text-sm font-medium text-success">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Authentication</span>
                <span className="text-sm font-medium text-success">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Storage</span>
                <span className="text-sm font-medium text-success">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Service</span>
                <span className="text-sm font-medium text-success">Healthy</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/settings">
                  <Settings className="mr-2 w-4 h-4" />
                  Configure Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
