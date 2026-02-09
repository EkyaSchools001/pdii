import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ObservationCard } from "@/components/ObservationCard";
import { GoalCard } from "@/components/GoalCard";
import { TrainingEventCard } from "@/components/TrainingEventCard";
import {
  Clock,
  Eye,
  Target,
  Calendar,
  TrendingUp,
  Book,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Search,
  Play,
  Filter,
  Star,
  Trophy,
  History,
  FileCheck,
  PlusCircle,
  MoreVertical,
  Download,
  Brain,
  Zap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Flag,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, parse, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getActiveTemplateByType } from "@/lib/template-utils";
import { DynamicForm } from "@/components/DynamicForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";


import { Observation, DetailedReflection } from "@/types/observation";
import { ReflectionForm } from "@/components/ReflectionForm";
import { MoocEvidenceForm } from "@/components/MoocEvidenceForm";

// Removed local Observation interface in favor of shared type


const mockObservations: Observation[] = [
  {
    id: "1",
    teacher: "Emily Rodriguez",
    date: "Jan 15, 2024",
    observerName: "Dr. Sarah Johnson",
    observerRole: "Head of School",
    domain: "Instruction",
    score: 4,
    notes: "Excellent engagement strategies used. Student participation was very high.",
    hasReflection: true,
    reflection: "I will focus on pacing next time.",
  },
  {
    id: "new-demo-1",
    teacher: "Emily Rodriguez",
    date: "Feb 5, 2024",
    observerName: "Dr. Sarah Johnson",
    observerRole: "Head of School",
    domain: "Assessment",
    score: 3,
    notes: "Good formative assessment, but check for understanding more frequently.",
    hasReflection: false,
  },
];

const initialGoals = [
  {
    id: "1",
    title: "Implement Project-Based Learning",
    description: "Incorporate at least 2 PBL units this semester with cross-curricular connections",
    progress: 65,
    dueDate: "Mar 30, 2024",
    assignedBy: "Dr. Sarah Johnson",
    isSchoolAligned: true,
    teacher: "Emily Rodriguez"
  },
  {
    id: "2",
    title: "Differentiation Strategies",
    description: "Develop and implement tiered assignments for diverse learner needs",
    progress: 40,
    dueDate: "Apr 15, 2024",
    teacher: "Emily Rodriguez"
  },
];

const initialEvents = [
  {
    id: "1",
    title: "Inquiry-Based Learning Workshop",
    date: "Jan 25, 2024",
    time: "3:00 PM - 5:00 PM",
    location: "Main Campus - Room 201",
    topic: "Teaching Strategies",
    spotsLeft: 8,
    isRegistered: false,
  },
  {
    id: "2",
    title: "Technology Integration Seminar",
    date: "Feb 2, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Virtual",
    topic: "EdTech",
    spotsLeft: 15,
    isRegistered: true,
  },
];

const mockCourses = [
  {
    id: "1",
    title: "Advanced Classroom Management",
    instructor: "Sarah Jenkins, PhD",
    duration: "4h 30m",
    progress: 75,
    category: "Management",
    rating: 4.8,
    students: 1240,
    thumbnail: "bg-blue-500",
    status: "in-progress"
  },
  {
    id: "2",
    title: "Inclusive Education Strategies",
    instructor: "Mark Thompson",
    duration: "6h 15m",
    progress: 30,
    category: "Special Ed",
    rating: 4.9,
    students: 850,
    thumbnail: "bg-purple-500",
    status: "in-progress"
  },
  {
    id: "3",
    title: "Digital Literacy in 2024",
    instructor: "Emily Chen",
    duration: "3h 0m",
    progress: 0,
    category: "Technology",
    rating: 4.7,
    students: 2100,
    thumbnail: "bg-orange-500",
    status: "recommended"
  },
  {
    id: "4",
    title: "Assessment for Learning",
    instructor: "David Miller",
    duration: "5h 45m",
    progress: 0,
    category: "Pedagogy",
    rating: 4.6,
    students: 1500,
    thumbnail: "bg-emerald-500",
    status: "recommended"
  },
  {
    id: "5",
    title: "Mental Health First Aid",
    instructor: "Dr. Lisa Wong",
    duration: "8h 20m",
    progress: 100,
    category: "Wellbeing",
    rating: 5.0,
    students: 3200,
    thumbnail: "bg-rose-500",
    status: "completed"
  }
];

const mockPDHours = {
  total: 24.5,
  target: 30,
  categories: [
    { name: "Workshops", hours: 12, color: "bg-blue-500" },
    { name: "Online Courses", hours: 8, color: "bg-purple-500" },
    { name: "Seminars", hours: 4.5, color: "bg-emerald-500" }
  ],
  history: [
    { id: 1, activity: "Advanced Classroom Management", category: "Online Course", date: "Jan 20, 2024", hours: 4, status: "Approved" },
    { id: 2, activity: "Inquiry-Based Learning Workshop", category: "Workshop", date: "Jan 15, 2024", hours: 3, status: "Approved" },
    { id: 3, activity: "Digital Literacy Seminar", category: "Seminar", date: "Jan 10, 2024", hours: 2.5, status: "Approved" },
    { id: 4, activity: "Inclusive Education Strategies", category: "Online Course", date: "Dec 18, 2023", hours: 4, status: "Approved" },
    { id: 5, activity: "Annual Staff Training Day", category: "Workshop", date: "Nov 05, 2023", hours: 6, status: "Approved" },
    { id: 6, activity: "Faculty Meeting: New Curriculum", category: "Seminar", date: "Oct 22, 2023", hours: 2, status: "Approved" }
  ]
};

const mockInsights = {
  skills: [
    { subject: 'Instruction', A: 120, B: 110, fullMark: 150 },
    { subject: 'Classroom Mgmt', A: 98, B: 130, fullMark: 150 },
    { subject: 'Assessment', A: 86, B: 130, fullMark: 150 },
    { subject: 'Technology', A: 99, B: 100, fullMark: 150 },
    { subject: 'Collaboration', A: 85, B: 90, fullMark: 150 },
    { subject: 'Professionalism', A: 65, B: 85, fullMark: 150 },
  ],
  growth: [
    { month: 'Sep', hours: 4 },
    { month: 'Oct', hours: 7 },
    { month: 'Nov', hours: 15 },
    { month: 'Dec', hours: 19 },
    { month: 'Jan', hours: 24.5 },
  ],
  strengths: [
    { name: "Active Engagement", level: "Expert", description: "Consistently maintains high student participation throughout lessons." },
    { name: "Curriculum Design", level: "Advanced", description: "Skillfully aligns lessons with complex learning objectives." }
  ],
  recommendations: [
    { name: "Differentiation", focus: "Personalization", reason: "Focus on tiered assignments to address diverse learner needs." },
    { name: "Data Analysis", focus: "Assessment", reason: "Leverage assessment data to drive instructional pivots." }
  ]
};

const DashboardOverview = ({
  goals,
  events,
  observations,
  onRegister
}: {
  goals: typeof initialGoals,
  events: typeof initialEvents,
  observations: Observation[],
  onRegister: (id: string) => void
}) => {
  const navigate = useNavigate();
  const schoolAlignedGoals = goals.filter(g => g.isSchoolAligned).length;
  const reflectionsCount = observations.filter(o => o.hasReflection).length;
  const upcomingTrainings = events.filter(e => !e.isRegistered).length;

  return (
    <>
      <PageHeader
        title="Welcome back, Emily!"
        subtitle="Here's your professional development overview"

      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="PD Hours Completed"
          value={mockPDHours.total}
          subtitle="This school year"
          icon={Clock}
          trend={{ value: 12, isPositive: true }}

          onClick={() => navigate("/teacher/hours")}
        />
        <StatCard
          title="Observations"
          value={observations.length}
          subtitle={`${reflectionsCount} with reflections`}
          icon={Eye}

          onClick={() => navigate("/teacher/observations")}
        />
        <StatCard
          title="Active Goals"
          value={goals.length}
          subtitle={`${schoolAlignedGoals} school-aligned`}
          icon={Target}

          onClick={() => navigate("/teacher/goals")}
        />
        <StatCard
          title="Upcoming Training"
          value={upcomingTrainings}
          subtitle="Next: Jan 25"
          icon={Calendar}

          onClick={() => navigate("/teacher/calendar")}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Observations</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/teacher/observations">
                View All
                <TrendingUp className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {observations.slice(0, 3).map((obs) => (
              <ObservationCard key={obs.id} observation={obs} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">My Goals</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/teacher/goals">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {goals.filter(g => !g.teacher || g.teacher.toLowerCase().includes("emily")).map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Upcoming Training</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/teacher/calendar">View Calendar</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <TrainingEventCard
              key={event.id}
              event={event}
              onRegister={() => onRegister(event.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ObservationsView({ observations, onReflect }: { observations: Observation[], onReflect: (id: string, reflection: DetailedReflection) => void }) {
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (reflection: DetailedReflection) => {
    if (selectedObs) {
      onReflect(selectedObs.id, reflection);
      setSelectedObs(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Observations" subtitle="Manage and reflect on your classroom observations" />
      <div className="grid gap-4">
        {observations.map((obs) => (
          <ObservationCard
            key={obs.id}
            observation={obs}
            onReflect={() => setSelectedObs(obs)}
            onView={() => navigate(`/teacher/observations/${obs.id}`)}
          />
        ))}
        {/* Placeholder for more observations */}
        {[3, 4, 5].map((id) => (
          <Card key={id} className="opacity-60 grayscale-[0.5]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Observation #{id}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Historical data from previous semester</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedObs && (
        <>
          {getActiveTemplateByType("Reflection") ? (
            <Dialog open={!!selectedObs} onOpenChange={() => setSelectedObs(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Teacher Self-Reflection (Master)</DialogTitle>
                  <DialogDescription>Based on the Ekya Danielson Framework</DialogDescription>
                </DialogHeader>
                <DynamicForm
                  fields={getActiveTemplateByType("Reflection")!.fields}
                  submitLabel="Submit Reflection"
                  onCancel={() => setSelectedObs(null)}
                  onSubmit={(data) => {
                    // Map dynamic data to DetailedReflection structure
                    const reflection: DetailedReflection = {
                      teacherName: selectedObs?.teacher || "Emily Rodriguez",
                      teacherEmail: "emily.r@ekyaschools.com",
                      submissionDate: new Date().toISOString(),
                      sections: {
                        planning: { id: "planning", title: "Planning", ratings: [], evidence: "" },
                        classroomEnvironment: { id: "classroomEnvironment", title: "Classroom Environment", ratings: [], evidence: "" },
                        instruction: { id: "instruction", title: "Instruction", ratings: [], evidence: "" },
                        assessment: { id: "assessment", title: "Assessment", ratings: [], evidence: "" },
                        environment: { id: "environment", title: "Environment", ratings: [], evidence: "" },
                        professionalism: { id: "professionalism", title: "Professionalism", ratings: [], evidence: "" }
                      },
                      strengths: data.r23 || "See details",
                      improvements: data.r24 || "See details",
                      goal: data.r25 || "Assigned by teacher",
                      comments: data.r26 || "Master form reflection submitted.",
                    };
                    handleSubmit(reflection);
                  }}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <ReflectionForm
              isOpen={!!selectedObs}
              onClose={() => setSelectedObs(null)}
              onSubmit={handleSubmit}
              observation={selectedObs}
              teacherName={selectedObs.teacher || "Emily Rodriguez"}
              teacherEmail="emily.r@ekyaschools.com"
            />
          )}
        </>
      )}
    </div>
  );
}

function GoalsView({ goals, onAddGoal }: { goals: typeof initialGoals, onAddGoal: (goal: NewGoal) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", dueDate: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.dueDate) return;
    onAddGoal(newGoal);
    setNewGoal({ title: "", description: "", dueDate: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Professional Goals" subtitle="Track your growth and align with school priorities" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.filter(g => !g.teacher || g.teacher.toLowerCase().includes("emily")).map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed flex items-center justify-center p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="space-y-2">
                <Target className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Create New Goal</h3>
                <p className="text-sm text-muted-foreground">Set a new objective for your professional growth</p>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                New Professional Goal
              </DialogTitle>
              <DialogDescription>
                Define a clear objective to track your growth this semester.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mastery in Classroom Management"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your objective and desired outcomes..."
                  className="min-h-[100px]"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Target Completion Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function CalendarView({
  events,
  onRegister
}: {
  events: typeof initialEvents,
  onRegister: (id: string) => void
}) {
  const [date, setDate] = useState<Date | undefined>(new Date(2024, 0, 25)); // Set a default date in center of mock data

  const eventDates = events.map(event => parse(event.date, "MMM d, yyyy", new Date()));

  const selectedDateEvents = events.filter(event => {
    if (!date) return false;
    const eventDate = parse(event.date, "MMM d, yyyy", new Date());
    return isSameDay(eventDate, date);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Calendar"
        subtitle="Discover and register for professional development sessions"
      />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Calendar Control */}
        <Card className="lg:col-span-5 p-4 bg-background/50 backdrop-blur-sm shadow-xl border-none">
          <CalendarUI
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border-none w-full"
            modifiers={{
              hasEvent: eventDates
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: 'var(--primary)'
              }
            }}
          />
          <div className="mt-4 p-4 rounded-xl bg-primary/5 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Legend
            </h4>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Available Training</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Selected</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Event Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
              <Badge variant="secondary" className="ml-2">
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'Event' : 'Events'}
              </Badge>
            </h3>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="animate-in slide-in-from-right-4 duration-300">
                    <TrainingEventCard
                      event={event}
                      onRegister={() => onRegister(event.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-dashed h-[200px] flex flex-col items-center justify-center text-center p-8 text-muted-foreground bg-muted/20">
                <Calendar className="w-8 h-8 mb-2 opacity-20" />
                <p>No training sessions scheduled for this date.</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setDate(undefined)}
                  className="mt-2"
                >
                  Show all suggestions
                </Button>
              </Card>
            )}

            {!date && (
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold px-1">Upcoming Suggestions</h3>
                {events.map(event => (
                  <TrainingEventCard
                    key={event.id}
                    event={event}
                    onRegister={() => onRegister(event.id)}
                  />
                ))}
              </div>
            )}

            {date && selectedDateEvents.length === 0 && (
              <div className="mt-8 space-y-4 pt-4 border-t border-muted">
                <h3 className="font-semibold text-sm text-muted-foreground px-1 uppercase tracking-wider">Other Suggestions</h3>
                {events.filter(e => !selectedDateEvents.some(s => s.id === e.id)).map(event => (
                  <TrainingEventCard
                    key={event.id}
                    event={event}
                    onRegister={() => onRegister(event.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function CoursesView() {
  const [isMoocFormOpen, setIsMoocFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const categories = Array.from(new Set(mockCourses.map(c => c.category)));

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Course Catalogue"
          subtitle="Expand your knowledge with certified professional development courses"
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsMoocFormOpen(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 mr-2">
            <PlusCircle className="w-4 h-4" />
            Submit MOOC Evidence
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 w-[200px] lg:w-[300px]"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className={selectedCategory !== "all" ? "bg-accent text-accent-foreground border-accent" : ""}>
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isMoocFormOpen} onOpenChange={setIsMoocFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-background/95 backdrop-blur-xl border-none">
          {getActiveTemplateByType("Other", "MOOC") ? (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold">MOOC Submission (Master)</h2>
                <p className="text-muted-foreground italic">Submit your course evidence using the latest official form</p>
              </div>
              <DynamicForm
                fields={getActiveTemplateByType("Other", "MOOC")!.fields}
                submitLabel="Submit MOOC Evidence"
                onCancel={() => setIsMoocFormOpen(false)}
                onSubmit={(data) => {
                  toast.success("MOOC Evidence submitted successfully using Master Template!");
                  setIsMoocFormOpen(false);
                }}
              />
            </div>
          ) : (
            <MoocEvidenceForm
              onCancel={() => setIsMoocFormOpen(false)}
              onSubmitSuccess={() => setIsMoocFormOpen(false)}
              userEmail="emily.r@ekyaschools.com"
              userName="Emily Rodriguez"
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        {/* In Progress */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-primary fill-primary" />
            <h3 className="text-xl font-bold">Continue Learning</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.status === 'in-progress').map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="text-xl font-bold">Recommended for You</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.status === 'recommended').map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-bold">Completed Courses</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(c => c.status === 'completed').map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: typeof mockCourses[0] }) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-none bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col">
      <div className={cn("h-32 w-full relative", course.thumbnail)}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-black border-none backdrop-blur-sm">
            {course.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
            {course.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
            <Star className="w-3 h-3 fill-yellow-600" />
            {course.rating}
          </div>
        </div>
        <CardDescription className="text-xs">By {course.instructor} • {course.duration}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        {course.status === 'in-progress' ? (
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ) : course.status === 'completed' ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mt-2">
            <CheckCircle2 className="w-4 h-4" />
            Course Completed
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            Master the essentials of {course.title.toLowerCase()} in this comprehensive guide.
          </p>
        )}
      </CardContent>
      <div className="p-4 pt-0">
        <Button className="w-full gap-2 group/btn" variant={course.status === 'in-progress' ? 'default' : 'outline'}>
          {course.status === 'in-progress' ? 'Continue Lesson' : course.status === 'completed' ? 'Review Course' : 'Start Learning'}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}

function PDHoursView() {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Professional Development Activity Log", 14, 22);

    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "MMM d, yyyy")}`, 14, 30);

    // Add teacher info
    doc.text("Teacher: Emily Rodriguez", 14, 38);

    // Create table
    const tableColumn = ["Activity", "Category", "Date", "Hours", "Status"];
    const tableRows = mockPDHours.history.map(item => [
      item.activity,
      item.category,
      item.date,
      `${item.hours}h`,
      item.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    // Save the PDF
    doc.save("activity_history.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="PD Hours Tracking"
          subtitle="Monitor your professional development progress and claim credits"
        />
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Request Credit
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Annual Progress</CardTitle>
            <CardDescription>You have completed {mockPDHours.total} of {mockPDHours.target} required hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Completion Status</span>
                <span>{Math.round((mockPDHours.total / mockPDHours.target) * 100)}%</span>
              </div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
                {mockPDHours.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={cn("h-full transition-all duration-500", cat.color)}
                    style={{ width: `${(cat.hours / mockPDHours.target) * 100}%` }}
                    title={`${cat.name}: ${cat.hours}h`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mockPDHours.categories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                    {cat.name}
                  </div>
                  <div className="text-lg font-bold">{cat.hours}h</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="border-none shadow-lg bg-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-50/80 text-sm font-medium">Approved Hours</p>
                  <p className="text-3xl font-bold">{mockPDHours.total}h</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Remaining Target</p>
                  <p className="text-3xl font-bold">{mockPDHours.target - mockPDHours.total}h</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Table */}
      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-muted/50 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Activity History</CardTitle>
            <CardDescription>A detailed log of all your PD activities</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-muted/50">
              <TableHead className="w-[300px]">Activity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPDHours.history.map((row) => (
              <TableRow key={row.id} className="group hover:bg-muted/30 border-muted/50 transition-colors">
                <TableCell className="font-medium">{row.activity}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-xs">{row.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{row.date}</TableCell>
                <TableCell className="text-right font-bold">{row.hours}h</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {row.status}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function InsightsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Professional Insights"
          subtitle="Data-driven overview of your teaching competencies and growth"
        />
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Growth Portfolio
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competency Radar */}
        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Skill Competencies
            </CardTitle>
            <CardDescription>Based on observation scores and PD completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockInsights.skills}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Growth"
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Benchmark"
                    dataKey="B"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Professional Growth Trend
            </CardTitle>
            <CardDescription>Cumulative PD hours over the academic year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockInsights.growth}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Identified Strengths */}
        <Card className="lg:col-span-1 border-none shadow-xl bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              Core Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInsights.strengths.map((strength, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-primary/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{strength.name}</span>
                  <Badge className="bg-primary/20 text-primary border-none hover:bg-primary/20">{strength.level}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{strength.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Personalized Actions */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-5 h-5" />
              Growth Recommendations
            </CardTitle>
            <CardDescription>Targeted actions to reach the next competency level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {mockInsights.recommendations.map((rec, idx) => (
                <div key={idx} className="group p-5 rounded-2xl border border-muted/50 hover:bg-muted/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="font-semibold">{rec.focus}</Badge>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-bold mb-1">{rec.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button variant="link" className="p-0 h-auto gap-2 text-primary font-bold group">
                Browse related courses
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlaceholderView({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <div className="p-4 rounded-3xl bg-primary/10 mb-6">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We're working hard to bring you the best {title.toLowerCase()} experience.
        This module will be available in the next platform update.
      </p>
      <Button asChild>
        <Link to="/teacher">Return to Dashboard</Link>
      </Button>
    </div>
  );
}

interface NewGoal {
  title: string;
  description: string;
  dueDate: string;
}

export default function TeacherDashboard() {
  const location = useLocation();
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('goals_data');
      return saved ? JSON.parse(saved) : initialGoals;
    } catch (e) {
      console.error("Failed to load goals", e);
      return initialGoals;
    }
  });
  const [events, setEvents] = useState(initialEvents);
  const [observations, setObservations] = useState<Observation[]>(() => {
    try {
      const saved = localStorage.getItem('observations_data');
      if (saved) {
        return JSON.parse(saved);
      }
      return mockObservations;
    } catch (e) {
      console.error("Failed to load observations", e);
      return mockObservations;
    }
  });

  useEffect(() => {
    localStorage.setItem('observations_data', JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem('goals_data', JSON.stringify(goals));
  }, [goals]);

  // Listen for updates from Leader Dashboard
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'observations_data' && e.newValue) {
        try {
          setObservations(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync observation data", err);
        }
      }
      if (e.key === 'goals_data' && e.newValue) {
        try {
          setGoals(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync goals data", err);
        }
      }
    };

    const handleLocalGoalsUpdate = () => {
      const saved = localStorage.getItem('goals_data');
      if (saved) {
        setGoals(JSON.parse(saved));
      }
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-goals-update', handleLocalGoalsUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-goals-update', handleLocalGoalsUpdate);
    };
  }, []);

  const handleReflect = (id: string, reflection: DetailedReflection) => {
    setObservations(prev => prev.map(obs => {
      if (obs.id === id) {
        toast.success("Reflection submitted successfully!");
        return {
          ...obs,
          hasReflection: true,
          // Keep legacy string for backward compatibility with existing simple cards if needed
          reflection: reflection.comments || "Detailed reflection submitted.",
          detailedReflection: reflection
        };
      }
      return obs;
    }));
  };

  const handleAddGoal = (newGoal: NewGoal) => {
    const dateObj = new Date(newGoal.dueDate);
    const formattedDate = format(dateObj, "MMM d, yyyy");

    setGoals(prev => [...prev, {
      ...newGoal,
      id: Date.now().toString(),
      progress: 0,
      dueDate: formattedDate
    }]);
  };

  const handleRegister = (eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        toast.success(`Successfully registered for ${event.title}`);
        return { ...event, isRegistered: true, spotsLeft: event.spotsLeft - 1 };
      }
      return event;
    }));
  };

  return (
    <DashboardLayout role="teacher" userName="Emily Rodriguez">
      <Routes>
        <Route index element={<DashboardOverview goals={goals} events={events} observations={observations.filter(o => !o.teacher || o.teacher.toLowerCase().includes("emily"))} onRegister={handleRegister} />} />
        <Route path="observations" element={<ObservationsView observations={observations.filter(o => !o.teacher || o.teacher.toLowerCase().includes("emily"))} onReflect={handleReflect} />} />
        <Route path="observations/:id" element={<ObservationDetailView observations={observations} />} />
        <Route path="goals" element={<GoalsView goals={goals} onAddGoal={handleAddGoal} />} />
        <Route path="calendar" element={<CalendarView events={events} onRegister={handleRegister} />} />
        <Route path="courses" element={<CoursesView />} />
        <Route path="hours" element={<PDHoursView />} />
        <Route path="insights" element={<InsightsView />} />
      </Routes>
    </DashboardLayout>
  );
}

function ObservationDetailView({ observations }: { observations: Observation[] }) {
  const { id } = useParams(); // Using useParams to get the ID from the URL
  const navigate = useNavigate();
  const observation = observations.find(o => o.id === id);

  if (!observation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <FileCheck className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">Observation not found</h2>
        <Button onClick={() => navigate("/teacher/observations")} className="mt-4">Back to Observations</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/observations")}>
          <ChevronRight className="w-5 h-5 rotate-180" />
        </Button>
        <div>
          <PageHeader
            title="Observation Report"
            subtitle={`Ref: #OBS-${observation.id.toUpperCase()}`}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Assessment Card - Similar to Leader View but read-only for teacher */}
          <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader className="bg-muted/10 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {observation.domain}
                    </span>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm font-medium">{observation.date}</span>
                  </div>
                  <CardTitle className="text-3xl font-bold">Instructional Assessment</CardTitle>
                  {observation.learningArea && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 gap-1.5 pl-2 pr-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        <Book className="w-3.5 h-3.5" />
                        Subject: {observation.learningArea}
                      </Badge>
                      {observation.classroom && (
                        <>
                          <Badge variant="outline" className="text-muted-foreground gap-1.5 font-medium">
                            <span className="font-bold text-foreground">Grade:</span> {observation.classroom.grade}
                          </Badge>
                          <Badge variant="outline" className="text-muted-foreground gap-1.5 font-medium">
                            <span className="font-bold text-foreground">Section:</span> {observation.classroom.section}
                          </Badge>
                          <Badge variant="outline" className="text-muted-foreground gap-1.5 font-medium">
                            <span className="font-bold text-foreground">Block:</span> {observation.classroom.block}
                          </Badge>
                        </>
                      )}
                    </div>
                  )}
                  {/* Domain Description */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground border border-muted-foreground/10">
                    <p className="flex gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>
                        <strong>About {observation.domain}:</strong> This domain evaluates the effectiveness of teaching strategies,
                        classroom engagement, and the alignment of activities with learning objectives.
                      </span>
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black border-4 shadow-xl",
                  observation.score >= 4 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                )}>
                  <span className="text-3xl leading-none">{observation.score}</span>
                  <span className="text-[10px] uppercase opacity-60">Score</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid md:grid-cols-2 gap-8 border-b border-dashed pb-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Observer</p>
                  <p className="text-lg font-bold">{observation.observerName || "School Leader"}</p>
                  <p className="text-sm text-muted-foreground">{observation.observerRole || "Administrator"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Teacher</p>
                  <p className="text-lg font-bold">{observation.teacher || "Emily Rodriguez"}</p>
                </div>
              </div>

              {/* Power BI Style Data Visualization Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {observation.strengths && (
                  <Card className="bg-success/5 border-success/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-success flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Strengths Observed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium leading-relaxed text-foreground/90">
                        {observation.strengths}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {observation.improvements && (
                  <Card className="bg-orange-500/5 border-orange-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Areas for Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium leading-relaxed text-foreground/90">
                        {observation.improvements}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {observation.teachingStrategies && observation.teachingStrategies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Strategies Observed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {observation.teachingStrategies.map((strategy, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-dashed">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <FileCheck className="w-5 h-5" />
                  Additional Evidence & Notes
                </h3>
                <div className="p-6 rounded-2xl bg-muted/20 border border-muted-foreground/10 text-foreground leading-relaxed italic">
                  "{observation.notes || "No additional notes provided."}"
                </div>
              </div>

              {/* Teacher's Own Reflection Section */}
              {observation.detailedReflection ? (
                <div className="space-y-6 pt-6 border-t-[3px] border-dashed border-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-info/10">
                      <MessageSquare className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Your Reflection</h3>
                      <p className="text-sm text-muted-foreground">Self-assessment based on Ekya Danielson Framework</p>
                    </div>
                  </div>

                  <Card className="border-info/20 shadow-sm overflow-hidden bg-info/5">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 gap-4 p-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-muted-foreground uppercase mb-1">Strengths</span>
                          <p className="font-medium text-sm">{observation.detailedReflection.strengths}</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-muted-foreground uppercase mb-1">Growth Areas</span>
                          <p className="font-medium text-sm">{observation.detailedReflection.improvements}</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <span className="block text-xs font-bold text-muted-foreground uppercase mb-1">Goal</span>
                          <p className="font-medium text-sm">{observation.detailedReflection.goal}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : observation.hasReflection && (
                <div className="space-y-4 pt-6 border-t border-dashed">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-info">
                    <MessageSquare className="w-5 h-5" />
                    Your Reflection
                  </h3>
                  <div className="p-6 rounded-2xl bg-info/5 border border-info/10 text-foreground leading-relaxed">
                    "{observation.reflection}"
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Sidebar with Actions / Stats */}
          <Card className="border-none shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2" variant="outline" onClick={() => window.print()}>
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                If you have questions about this observation, please schedule a debrief with your observer.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
