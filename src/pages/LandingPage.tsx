import { Link } from "react-router-dom";
import { GraduationCap, Users, Shield, ArrowRight, CheckCircle2, BarChart3, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Observation Tracking",
    description: "Real-time feedback and reflection tools for continuous improvement",
    priority: 1 as const,
  },
  {
    icon: Target,
    title: "Goal Management",
    description: "Set, track, and achieve professional development goals",
  },
  {
    icon: Calendar,
    title: "Training Calendar",
    description: "Discover and register for professional development events",
    priority: 1 as const,
  },
  {
    icon: CheckCircle2,
    title: "PD Hours Tracking",
    description: "Automatic tracking of professional development hours",
  },
];

const roles = [
  {
    role: "teacher" as const,
    title: "Teacher",
    description: "Track observations, set goals, and manage your professional development journey",
    icon: GraduationCap,
    path: "/login",
    color: "bg-info/10 text-info",
  },
  {
    role: "leader" as const,
    title: "School Leader",
    description: "Observe teachers, track team progress, and drive school-wide improvement",
    icon: Users,
    path: "/login",
    color: "bg-[hsl(262_83%_58%/0.1)] text-[hsl(262_83%_58%)]",
  },
  {
    role: "admin" as const,
    title: "Administrator",
    description: "Manage users, configure forms, and oversee the entire platform",
    icon: Shield,
    path: "/login",
    color: "bg-success/10 text-success",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent">
                <GraduationCap className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">PD Platform</span>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </nav>
        </div>

        <div className="container mx-auto px-6 py-24 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Professional Development Made Simple
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
            Elevate Teaching.<br />Transform Learning.
          </h1>

          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up">
            A comprehensive platform for managing observations, tracking professional development,
            and empowering educators to reach their full potential.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Learn More
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need for Professional Growth
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive tools for tracking, managing, and improving
              professional development across your entire school.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="dashboard-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your role to access your personalized dashboard with features
              tailored to your responsibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <Link
                key={role.role}
                to={role.path}
                className="dashboard-card p-8 text-center group hover:scale-105 transition-transform duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-4 rounded-2xl ${role.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{role.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{role.description}</p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Enter Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent">
                <GraduationCap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold">PD Platform</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              © 2024 Professional Development Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
