import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, Eye, TrendingUp, Calendar, FileText, Target, Plus, ChevronLeft, ChevronRight, Save, Star, Search, Filter, Mail, Phone, MapPin, Award, CheckCircle, Download, Printer, Share2, Rocket, Clock, CheckCircle2, Map, Users as Users2, History as HistoryIcon, MessageSquare, Book, Link as LinkIcon, Brain, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, Routes, Route, useParams } from "react-router-dom";
import { Observation } from "@/types/observation";
import { GoalSettingForm } from "@/components/GoalSettingForm";
import { TeacherAnalyticsReport } from "@/components/TeacherAnalyticsReport";
import { LeaderPerformanceAnalytics } from "@/components/LeaderPerformanceAnalytics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getActiveTemplateByType } from "@/lib/template-utils";
import { DynamicForm } from "@/components/DynamicForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const teamMembers = [
  { id: "1", name: "Emily Rodriguez", role: "Math Teacher", observations: 8, lastObserved: "Jan 15", avgScore: 4.2, pdHours: 32, completionRate: 85 },
  { id: "2", name: "James Wilson", role: "Science Teacher", observations: 6, lastObserved: "Jan 12", avgScore: 3.8, pdHours: 24, completionRate: 60 },
  { id: "3", name: "Maria Santos", role: "English Teacher", observations: 7, lastObserved: "Jan 10", avgScore: 4.0, pdHours: 40, completionRate: 100 },
  { id: "4", name: "David Kim", role: "History Teacher", observations: 5, lastObserved: "Dec 20", avgScore: 3.5, pdHours: 18, completionRate: 45 },
];

const recentObservations = [
  { id: "1", teacher: "Emily Rodriguez", domain: "Instruction", date: "Jan 15", score: 4, notes: "Excellent engagement strategies used.", hasReflection: true, reflection: "I will focus on pacing next time." },
  { id: "2", teacher: "James Wilson", domain: "Assessment", date: "Jan 12", score: 3, notes: "Good formative assessment, but check for understanding more frequently.", hasReflection: false, reflection: "" },
  { id: "3", teacher: "Maria Santos", domain: "Classroom Management", date: "Jan 10", score: 4, notes: "Classroom transitions were smooth.", hasReflection: true, reflection: "Thank you for the feedback." },
];

const domainAverages = [
  { domain: "Instruction", average: 3.8, count: 24 },
  { domain: "Classroom Management", average: 4.1, count: 18 },
  { domain: "Assessment", average: 3.5, count: 15 },
  { domain: "Professionalism", average: 4.3, count: 12 },
];

const initialGoals = [
  { id: "1", teacher: "Emily Rodriguez", title: "Instructional Clarity", category: "Instruction", progress: 75, status: "In Progress", dueDate: "Mar 30" },
  { id: "2", teacher: "James Wilson", title: "Student Engagement", category: "Management", progress: 40, status: "In Progress", dueDate: "Apr 15" },
  { id: "3", teacher: "Maria Santos", title: "Assessment Diversity", category: "Assessment", progress: 90, status: "Near Completion", dueDate: "Mar 10" },
  { id: "4", teacher: "Emily Rodriguez", title: "Data-Driven Feedback", category: "Assessment", progress: 55, status: "In Progress", dueDate: "May 20" },
];

const initialTrainingEvents = [
  { id: "1", title: "Differentiated Instruction Workshop", topic: "Pedagogy", type: "Pedagogy", date: "Feb 15, 2026", time: "09:00 AM", location: "Auditorium A", registered: 12, capacity: 20, status: "Approved", spotsLeft: 8 },
  { id: "2", title: "Digital Literacy in Classroom", topic: "Technology", type: "Technology", date: "Feb 18, 2026", time: "02:00 PM", location: "Computer Lab 1", registered: 18, capacity: 25, status: "Approved", spotsLeft: 7 },
  { id: "3", title: "Social-Emotional Learning Hub", topic: "Culture", type: "Culture", date: "Feb 22, 2026", time: "11:00 AM", location: "Conference Room B", registered: 8, capacity: 15, status: "Approved", spotsLeft: 7 },
  { id: "4", title: "Advanced Formative Assessment", topic: "Assessment", type: "Assessment", date: "Feb 25, 2026", time: "03:30 PM", location: "Main Library", registered: 15, capacity: 20, status: "Pending", spotsLeft: 5 },
];

export default function LeaderDashboard() {
  const [team, setTeam] = useState(teamMembers);
  const [observations, setObservations] = useState<Observation[]>(() => {
    try {
      const saved = localStorage.getItem('observations_data');
      return saved ? JSON.parse(saved) : recentObservations;
    } catch (e) {
      console.error("Failed to parse observations", e);
      return recentObservations;
    }
  });
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('goals_data');
      return saved ? JSON.parse(saved) : initialGoals;
    } catch (e) {
      console.error("Failed to parse goals", e);
      return initialGoals;
    }
  });
  const [training, setTraining] = useState(() => {
    try {
      const saved = localStorage.getItem('training_events_data');
      return saved ? JSON.parse(saved) : initialTrainingEvents;
    } catch (e) {
      console.error("Failed to parse training events", e);
      return initialTrainingEvents;
    }
  });

  useEffect(() => {
    localStorage.setItem('observations_data', JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem('goals_data', JSON.stringify(goals));
    // Dispatch custom event for same-window updates if needed, though 'storage' event handles cross-tab
    window.dispatchEvent(new Event('local-goals-update'));
  }, [goals]);

  // Sync training events to localStorage when changed in Leader view (propose course etc)
  useEffect(() => {
    localStorage.setItem('training_events_data', JSON.stringify(training));
    window.dispatchEvent(new Event('training-events-updated'));
  }, [training]);

  // Listen for updates from other dashboards/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'observations_data' && e.newValue) {
        try {
          setObservations(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync observation data", err);
        }
      }
      if (e.key === 'training_events_data' && e.newValue) {
        try {
          setTraining(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync training data", err);
        }
      }
    };

    const handleCustomTrainingEvent = () => {
      const saved = localStorage.getItem('training_events_data');
      if (saved) {
        try {
          setTraining(JSON.parse(saved));
        } catch (err) {
          console.error("Failed to sync training data via custom event", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('training-events-updated', handleCustomTrainingEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('training-events-updated', handleCustomTrainingEvent);
    };
  }, []);

  return (
    <DashboardLayout role="leader" userName="Dr. Sarah Johnson">
      <Routes>
        <Route index element={<DashboardOverview team={team} observations={observations} />} />
        <Route path="team" element={<TeamManagementView team={team} />} />
        <Route path="team/:teacherId" element={<TeacherDetailsView team={team} observations={observations} goals={goals} />} />
        <Route path="observations" element={<ObservationsManagementView observations={observations} />} />
        <Route path="observations/:obsId" element={<ObservationReportView observations={observations} team={team} />} />
        <Route path="performance" element={<LeaderPerformanceAnalytics team={team} observations={observations} />} />
        <Route path="calendar" element={<PDCalendarView training={training} setTraining={setTraining} />} />
        <Route path="calendar/propose" element={<ProposeCourseView setTraining={setTraining} />} />
        <Route path="calendar/responses" element={<MoocResponsesView />} />
        <Route path="calendar/events/:eventId" element={<PlaceholderView title="PD Event Details" icon={Book} />} />
        <Route path="participation" element={<PDParticipationView team={team} />} />
        <Route path="observe" element={<ObserveView setObservations={setObservations} setTeam={setTeam} team={team} observations={observations} />} />
        <Route path="goals" element={<TeacherGoalsView goals={goals} />} />
        <Route path="goals/assign" element={<AssignGoalView setGoals={setGoals} />} />
        <Route path="reports" element={<ReportsView team={team} />} />
      </Routes>
    </DashboardLayout>
  );
}

function DashboardOverview({ team, observations }: { team: typeof teamMembers, observations: Observation[] }) {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="School Leader Dashboard"
        subtitle="Track team performance and professional development"
        actions={
          <Button onClick={() => navigate("/leader/observe")}>
            <Plus className="mr-2 w-4 h-4" />
            New Observation
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Team Members"
          value={team.length}
          subtitle="Direct reports"
          icon={Users}
          onClick={() => navigate("/leader/team")}
        />
        <StatCard
          title="Observations This Month"
          value={observations.length}
          subtitle="Goal: 24"
          icon={Eye}
          trend={{ value: 15, isPositive: true }}
          onClick={() => navigate("/leader/observations")}
        />
        <StatCard
          title="Average Score"
          value="3.9"
          subtitle="System wide"
          icon={TrendingUp}
          onClick={() => navigate("/leader/performance")}
        />
        <StatCard
          title="PD Participation"
          value={`${Math.round(team.reduce((acc, m) => acc + m.pdHours, 0) / team.length)}h`}
          subtitle="Avg hours per staff"
          icon={Clock}
          onClick={() => navigate("/leader/participation")}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Team Overview */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Team Overview</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/leader/team")}>
              View All
            </Button>
          </div>

          <div className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Teacher</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Observations</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Observed</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Avg Score</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr key={member.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{member.observations}</td>
                      <td className="p-4 text-muted-foreground">{member.lastObserved}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-success/10 text-success font-bold text-sm">
                          {member.avgScore}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => navigate("/leader/observe")}>
                          <Eye className="w-4 h-4 mr-2" />
                          Observe
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Domain Performance */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Domain Performance</h2>
            </div>
          </div>

          <div className="dashboard-card p-5 space-y-5">
            {domainAverages.map((domain) => (
              <div key={domain.domain}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{domain.domain}</span>
                  <span className="text-sm text-muted-foreground">{domain.average}/5</span>
                </div>
                <Progress value={domain.average * 20} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{domain.count} observations</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Observations */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">Recent Observations</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/leader/team")}>
            View All
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {observations.map((obs) => (
            <div
              key={obs.id}
              className="dashboard-card p-5 cursor-pointer hover:shadow-md transition-all hover:border-primary/20 group"
              onClick={() => navigate(`/leader/observations/${obs.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm text-muted-foreground">{obs.date}</span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success/10 text-success font-bold text-sm">
                  {obs.score}
                </span>
              </div>
              <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{obs.teacher}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {obs.domain}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Button variant="outline" className="h-auto p-6 flex flex-col items-start gap-2" onClick={() => navigate("/leader/goals")}>
          <Target className="w-6 h-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">Teacher Goals</p>
            <p className="text-sm text-muted-foreground">Manage development goals</p>
          </div>
        </Button>

        <Button variant="outline" className="h-auto p-6 flex flex-col items-start gap-2" onClick={() => navigate("/leader/calendar")}>
          <Calendar className="w-6 h-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">Manage Calendar</p>
            <p className="text-sm text-muted-foreground">Schedule training events</p>
          </div>
        </Button>

        <Button variant="outline" className="h-auto p-6 flex flex-col items-start gap-2" onClick={() => navigate("/leader/reports")}>
          <FileText className="w-6 h-6 text-primary" />
          <div className="text-left">
            <p className="font-medium">Export Reports</p>
            <p className="text-sm text-muted-foreground">Generate data exports</p>
          </div>
        </Button>
      </div>
    </>
  );
}

function TeamManagementView({ team }: { team: typeof teamMembers }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeam = team.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leader")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Team Management"
            subtitle="Oversee teacher performance and professional growth"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              className="pl-10 w-[250px] bg-background/50 border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Staff"
          value={team.length}
          subtitle="Active educators"
          icon={Users}
          onClick={() => navigate("/leader/team")}
        />
        <StatCard
          title="Observations"
          value="24"
          subtitle="This quarter"
          icon={Eye}
          onClick={() => navigate("/leader/observations")}
        />
        <StatCard
          title="Avg Performance"
          value="3.9"
          subtitle="Across all domains"
          icon={TrendingUp}
          onClick={() => navigate("/leader/performance")}
        />
        <StatCard
          title="Active Goals"
          value="12"
          subtitle="Pending completion"
          icon={Target}
          onClick={() => navigate("/leader/goals")}
        />
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>Teacher Registry</CardTitle>
          <CardDescription>Comprehensive list of teaching staff and their current standing.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Teacher Profile</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Specialization</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Observation Cycle</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Score</th>
                  <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shadow-inner">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</p>
                          <p className="text-sm text-muted-foreground">Staff ID: #EDU-{member.id}00{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-muted text-muted-foreground border border-muted-foreground/10">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary">{Math.round((member.observations / 10) * 100)}%</span>
                        </div>
                        <Progress value={(member.observations / 10) * 100} className="h-1.5 w-32" />
                        <p className="text-xs text-muted-foreground mt-1">Last: <span className="font-bold text-foreground">{member.lastObserved}</span></p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold border shadow-sm",
                          member.avgScore >= 4 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                        )}>
                          <span className="text-lg">{member.avgScore}</span>
                          <span className="text-[10px] uppercase opacity-60">Avg</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-10 px-4 gap-2 hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/leader/team/${member.id}`)}>
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="h-10 px-4 gap-2 border-primary/20 hover:bg-primary hover:text-primary-foreground shadow-sm" onClick={() => navigate("/leader/observe")}>
                          <Plus className="w-4 h-4" />
                          Observe
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTeam.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4 grayscale opacity-40">
                        <Users className="w-16 h-16" />
                        <div className="space-y-1">
                          <p className="text-xl font-bold">No teachers found</p>
                          <p className="text-muted-foreground">Try adjusting your search query</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherDetailsView({ team, observations, goals }: { team: typeof teamMembers, observations: Observation[], goals: typeof initialGoals }) {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const teacher = team.find(t => t.id === teacherId);
  const teacherObservations = observations.filter(obs => obs.teacher === teacher?.name);
  const teacherGoals = goals.filter(g => g.teacher === teacher?.name);

  if (!teacher) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Users className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">Teacher not found</h2>
        <Button onClick={() => navigate("/leader/team")} className="mt-4">Back to Team Registry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leader/team")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title={teacher.name}
          subtitle={`${teacher.role} • Staff ID #EDU-${teacher.id}00${teacher.id}`}
        />
        <div className="ml-auto flex gap-3">
          <Button variant="outline" onClick={() => navigate("/leader/observe")}>
            Schedule Observation
          </Button>
          <Button onClick={() => navigate("/leader/observe")}>
            <Plus className="w-4 h-4 mr-2" />
            New Observation
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold uppercase text-primary">Status</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{teacher.avgScore}</p>
                <p className="text-sm text-muted-foreground mt-1">Average Performance</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-info/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-5 h-5 text-info" />
                  <span className="text-xs font-bold uppercase text-info">Cycle</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{teacher.observations}/10</p>
                <p className="text-sm text-muted-foreground mt-1">Observations Completed</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-success/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-5 h-5 text-success" />
                  <span className="text-xs font-bold uppercase text-success">Standing</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{teacher.avgScore >= 4 ? "Proficient" : "Progressing"}</p>
                <p className="text-sm text-muted-foreground mt-1">Current Tier</p>
              </CardContent>
            </Card>
          </div>

          {/* Observation History */}
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Observation History</CardTitle>
                  <CardDescription>Archive of recent instructional assessments.</CardDescription>
                </div>
                <Button variant="ghost" size="sm">Download All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30 border-b">
                      <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Domain</th>
                      <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Score</th>
                      <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted-foreground/10">
                    {teacherObservations.length > 0 ? (
                      teacherObservations.map((obs) => (
                        <tr key={obs.id} className="hover:bg-primary/5 transition-colors group">
                          <td className="p-6 text-sm font-bold text-muted-foreground">{obs.date}, 2026</td>
                          <td className="p-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary">
                              {obs.domain}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center font-bold border",
                              obs.score >= 4 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                            )}>
                              {obs.score}
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <Button variant="ghost" size="sm" className="h-10 px-4 hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/leader/observations/${obs.id}`)}>
                              View Report
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                          No observation data available for the current cycle.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-lg">PD Participation</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{teacher.pdHours} Hours</p>
                    <p className="text-xs text-muted-foreground">Accrued this year</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{teacher.completionRate}%</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold">Complete</p>
                </div>
              </div>
              <Progress value={teacher.completionRate} className="h-2" />
              <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/leader/participation")}>
                View PD History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{teacher.name.toLowerCase().replace(' ', '.')}@school.edu</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-456{teacher.id}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Main Campus, Room 30{teacher.id}</span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Edit Personnel File
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-lg">Development Goals</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {teacherGoals.length > 0 ? (
                teacherGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                      <span>{goal.title}</span>
                      <span className="text-primary">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-1.5" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No active goals assigned.</p>
              )}
              <Button className="w-full bg-muted hover:bg-muted/80 text-foreground border-none mt-2" onClick={() => navigate("/leader/goals")}>
                Assign New Goal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PDParticipationView({ team }: { team: typeof teamMembers }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalHours = team.reduce((acc, m) => acc + m.pdHours, 0);
  const avgCompletion = Math.round(team.reduce((acc, m) => acc + m.completionRate, 0) / team.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="PD Participation Tracking"
        subtitle="Monitor professional development hours and compliance"
        actions={
          <Button onClick={() => navigate("/leader/calendar")}>
            <Calendar className="mr-2 w-4 h-4" />
            Manage Training
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total PD Hours"
          value={totalHours}
          subtitle="Accrued across all staff"
          icon={Clock}
        />
        <StatCard
          title="Avg. Completion"
          value={`${avgCompletion}%`}
          subtitle="Mandatory training"
          icon={CheckCircle2}
        />
        <StatCard
          title="Active Learners"
          value={team.filter(m => m.pdHours > 20).length}
          subtitle="Staff > 20 hours"
          icon={Award}
        />
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Staff PD Registry</CardTitle>
              <CardDescription>Track individual professional development progress and hours.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Teacher</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">PD Hours</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground w-1/4">Progress</th>
                  <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-foreground">{member.name}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium text-muted-foreground">{member.role}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {member.pdHours}
                        </div>
                        <span className="text-xs font-bold uppercase text-muted-foreground">Hours</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{member.completionRate}%</span>
                          <span className={cn(
                            member.completionRate >= 90 ? "text-success" : member.completionRate >= 60 ? "text-primary" : "text-warning"
                          )}>
                            {member.completionRate >= 90 ? "Certified" : "In Progress"}
                          </span>
                        </div>
                        <Progress value={member.completionRate} className="h-2" />
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 gap-2 hover:bg-primary/10 hover:text-primary"
                        onClick={() => navigate(`/leader/team/${member.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PDCalendarView({ training, setTraining }: { training: typeof initialTrainingEvents, setTraining: React.Dispatch<React.SetStateAction<typeof initialTrainingEvents>> }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 15)); // Default to Feb 15, 2026

  // Edit State
  const [editingEvent, setEditingEvent] = useState<typeof initialTrainingEvents[0] | null>(null);

  // Helper to parse "MMM d, yyyy" string to Date object
  const parseEventDate = (dateStr: string) => {
    try {
      // Handle both "MMM d, yyyy" and potential legacy "MMM d"
      const parts = dateStr.includes(',') ? dateStr : `${dateStr}, 2026`;
      return new Date(parts);
    } catch (e) {
      return new Date();
    }
  };

  // Helper to format Date object to "MMM d, yyyy" string
  const formatDateStr = (d: Date) => {
    return format(d, "MMM d, yyyy");
  };

  const filteredEvents = training.filter((e: any) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.topic || e.type || "").toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (date) {
      matchesDate = e.date === formatDateStr(date);
    }

    return matchesSearch && matchesDate;
  });

  // Get dates that have events for highlighting
  const eventDates = training.map(e => parseEventDate(e.date));

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setTraining(prev => prev.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
    setEditingEvent(null);
    toast.success("Event details updated successfully.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & PD Calendar"
        subtitle="Schedule and manage professional development sessions"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/leader/calendar/responses")}>
              <FileText className="mr-2 w-4 h-4" />
              Course Evidence Responses
            </Button>
            <Button onClick={() => navigate("/leader/calendar/propose")}>
              <Plus className="mr-2 w-4 h-4" />
              Propose New Course
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Sessions"
          value={training.length}
          subtitle="Scheduled this month"
          icon={Calendar}
        />
        <StatCard
          title="Total Registrations"
          value={training.reduce((acc, e) => acc + e.registered, 0)}
          subtitle="Staff enrolled"
          icon={Users2}
        />
        <StatCard
          title="Capacity Util."
          value={`${Math.round((training.reduce((acc, e) => acc + e.registered, 0) / training.reduce((acc, e) => acc + e.capacity, 0)) * 100)}%`}
          subtitle="Seat occupancy"
          icon={Rocket}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-2xl bg-zinc-950 text-white overflow-hidden relative">
            {/* decorative gradient blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-10 -translate-x-10 pointer-events-none" />

            <CardContent className="p-6 relative z-10 flex flex-col items-center">
              <div className="text-left w-full mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Activity Summary
                </h3>
                <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">
                  {formatDateStr(new Date())}
                </p>
              </div>

              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-2xl border-none bg-zinc-900/50 p-4 w-full"
                classNames={{
                  head_cell: "text-zinc-500 font-medium text-[0.8rem]",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-zinc-800 rounded-full transition-all",
                  day_selected: "bg-gradient-to-br from-pink-500 to-red-600 text-white hover:bg-red-600 focus:bg-red-600 shadow-lg shadow-red-500/30",
                  day_today: "bg-zinc-800 text-white font-bold",
                  nav_button: "border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-400",
                  caption: "text-white font-bold mb-4",
                }}
                modifiers={{
                  pedagogy: training.filter((e: any) => (e.topic || e.type) === "Pedagogy").map((e: any) => parseEventDate(e.date)),
                  technology: training.filter((e: any) => (e.topic || e.type) === "Technology").map((e: any) => parseEventDate(e.date)),
                  assessment: training.filter((e: any) => (e.topic || e.type) === "Assessment").map((e: any) => parseEventDate(e.date)),
                  other: training.filter((e: any) => !["Pedagogy", "Technology", "Assessment"].includes(e.topic || e.type)).map((e: any) => parseEventDate(e.date)),
                }}
                modifiersStyles={{
                  pedagogy: { border: '2px solid #3b82f6', color: 'white' }, // Blue
                  technology: { border: '2px solid #10b981', color: 'white' }, // Green
                  assessment: { border: '2px solid #f43f5e', color: 'white' }, // Red
                  other: { border: '2px solid #eab308', color: 'white' } // Yellow
                }}
              />

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span> Pedagogy
                  </span>
                  <span className="font-mono text-white">{training.filter((t: any) => (t.topic || t.type) === 'Pedagogy').length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Technology
                  </span>
                  <span className="font-mono text-white">{training.filter((t: any) => (t.topic || t.type) === 'Technology').length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span> Assessment
                  </span>
                  <span className="font-mono text-white">{training.filter((t: any) => (t.topic || t.type) === 'Assessment').length}</span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button
                  variant="outline"
                  className="w-full bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  onClick={() => setDate(undefined)}
                  disabled={!date}
                >
                  Clear Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event List */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm h-full">
            <CardHeader className="border-b bg-muted/20 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>
                    {date ? `Sessions for ${formatDateStr(date)}` : "All Upcoming Sessions"}
                  </CardTitle>
                  <CardDescription>
                    {filteredEvents.length} session{filteredEvents.length !== 1 && 's'} scheduled
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      className="pl-10 w-[200px] bg-background border-muted-foreground/20 rounded-xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {filteredEvents.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30 border-b">
                        <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Session Title</th>
                        <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                        <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Time</th>
                        <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                        <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted-foreground/10">
                      {filteredEvents.map((session) => (
                        <tr key={session.id} className="hover:bg-primary/5 transition-colors group">
                          <td className="p-6">
                            <p className="font-bold text-foreground">{session.title}</p>
                            {!date && <p className="text-xs text-muted-foreground mt-1">{session.date}</p>}
                          </td>
                          <td className="p-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                              {session.topic || session.type}
                            </span>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-bold text-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {session.time}
                            </p>
                          </td>
                          <td className="p-6">
                            <p className="text-sm text-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {session.location}
                            </p>
                          </td>
                          <td className="p-6">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              session.status === "Approved"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20"
                            )}>
                              {session.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 hover:bg-primary/10 hover:text-primary"
                              onClick={() => setEditingEvent(session)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No sessions scheduled for this date.</p>
                    <Button variant="link" onClick={() => setDate(undefined)} className="mt-2">
                      View all sessions
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event Details</DialogTitle>
            <DialogDescription>Update the schedule or details for this professional development session.</DialogDescription>
          </DialogHeader>

          {editingEvent && (
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editingEvent.type || editingEvent.topic}
                    onValueChange={(val) => setEditingEvent({ ...editingEvent, type: val, topic: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingEvent.status}
                    onValueChange={(val) => setEditingEvent({ ...editingEvent, status: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date (MMM DD)</Label>
                  <Input
                    id="edit-date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setEditingEvent(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProposeCourseView({ setTraining }: { setTraining: React.Dispatch<React.SetStateAction<typeof initialTrainingEvents>> }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    capacity: 20,
    description: "",
    objectives: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.type) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newSession = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      date: format(new Date(formData.date), "MMM d, yyyy"),
      registered: 0,
      status: "Pending", // Automatically pending approval
      topic: formData.type, // Map type to topic
      spotsLeft: formData.capacity
    };

    setTraining(prev => [...prev, newSession]);
    toast.success("Course proposal submitted for admin approval!");
    navigate("/leader/calendar");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leader/calendar")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propose New Course</h1>
          <p className="text-muted-foreground">Submit a professional development session for administrative approval</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Session Details
          </CardTitle>
          <CardDescription>All proposals are reviewed within 48 hours.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Advanced Pedagogy"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Session Type *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Pedagogy", "Technology", "Assessment", "Culture"].map(type => (
                    <div
                      key={type}
                      className={cn(
                        "cursor-pointer rounded-lg border p-2 text-center text-sm font-medium transition-all",
                        formData.type === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setFormData({ ...formData, type })}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })} // Note: In real app, format this to "MMM DD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Proposed Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Conference Room B"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Max Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the learning objectives and outcomes..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate("/leader/calendar")}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Proposal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsView({ team }: { team: typeof teamMembers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teamMembers[0] | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Filter State
  const [selectedRole, setSelectedRole] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");

  const roles = Array.from(new Set(team.map(t => t.role)));

  const filteredTeam = team.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || t.role === selectedRole;

    const matchesPerformance = performanceFilter === "all" ||
      (performanceFilter === "high" && t.avgScore >= 4.0) ||
      (performanceFilter === "proficient" && t.avgScore >= 3.0 && t.avgScore < 4.0) ||
      (performanceFilter === "support" && t.avgScore < 3.0);

    return matchesSearch && matchesRole && matchesPerformance;
  });

  const handleEmailReport = (teacher: typeof teamMembers[0]) => {
    setSendingId(teacher.id);
    const email = `${teacher.name.toLowerCase().replace(' ', '.')}@school.edu`;

    // Simulate API call
    setTimeout(() => {
      setSendingId(null);
      toast.success(`Performance report has been emailed to ${email}`, {
        description: "The teacher will receive a PDF summary of their observations and PD progress."
      });
    }, 1500);
  };

  const resetFilters = () => {
    setSelectedRole("all");
    setPerformanceFilter("all");
    setSearchQuery("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Reports"
        subtitle="Generate and share teacher performance summaries"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Reports Generated"
          value="24"
          subtitle="Last 30 days"
          icon={FileText}
        />
        <StatCard
          title="Pending Reviews"
          value="5"
          subtitle="Require approval"
          icon={Clock}
        />
        <StatCard
          title="Shared Reports"
          value="18"
          subtitle="Sent to teachers"
          icon={Mail}
        />
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Staff Reports Registry</CardTitle>
              <CardDescription>Select a teacher to preview or email their comprehensive report.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className={cn("rounded-xl", (selectedRole !== "all" || performanceFilter !== "all") && "border-primary text-primary bg-primary/10")}>
                    <Filter className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filter Reports</h4>
                      <p className="text-sm text-muted-foreground">Narrow down the list by role or performance.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {roles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Performance Band</Label>
                      <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Performance Levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Performance Levels</SelectItem>
                          <SelectItem value="high">High Performing (4.0+)</SelectItem>
                          <SelectItem value="proficient">Proficient (3.0-3.9)</SelectItem>
                          <SelectItem value="support">Needs Support (&lt;3.0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Teacher</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Performance Impact</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">PD Progress</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Last Updated</th>
                  <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredTeam.length > 0 ? (
                  filteredTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Star className={cn("w-4 h-4", member.avgScore >= 4.0 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")} />
                          <span className="font-bold">{member.avgScore}</span>
                          <span className="text-xs text-muted-foreground">/ 5.0</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1.5 max-w-[140px]">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">{member.pdHours}h</span>
                            <span className="text-muted-foreground">{member.completionRate}%</span>
                          </div>
                          <Progress value={member.completionRate} className="h-1.5" />
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-sm text-foreground">{member.lastObserved}, 2026</p>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2"
                            onClick={() => {
                              setSelectedTeacher(member);
                              setIsReportOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="h-9 gap-2 min-w-[100px]"
                            disabled={sendingId === member.id}
                            onClick={() => handleEmailReport(member)}
                          >
                            {sendingId === member.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Sending
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4" />
                                Email
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No teachers found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-none shadow-2xl">
          {selectedTeacher && (
            <TeacherAnalyticsReport teacher={selectedTeacher} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeacherGoalsView({ goals }: { goals: typeof initialGoals }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGoals = goals.filter(g =>
    g.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Professional Goals"
        subtitle="Manage and track performance targets for your staff"
        actions={
          <Button onClick={() => navigate("/leader/goals/assign")}>
            <Plus className="mr-2 w-4 h-4" />
            Assign New Goal
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Goals"
          value={goals.length}
          subtitle="Total in progress"
          icon={Target}
        />
        <StatCard
          title="Near Completion"
          value={goals.filter(g => g.progress >= 80).length}
          subtitle="Progress > 80%"
          icon={Rocket}
        />
        <StatCard
          title="Avg. Progress"
          value={`${Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)}%`}
          subtitle="System wide"
          icon={TrendingUp}
        />
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Goal Registry</CardTitle>
              <CardDescription>Comprehensive list of all teacher development targets.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Teacher</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Goal Target</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground w-1/4">Progress</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Due Date</th>
                  <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredGoals.map((goal) => (
                  <tr key={goal.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-foreground">{goal.teacher}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-semibold">{goal.title}</p>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                        {goal.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{goal.progress}%</span>
                          <span className={cn(
                            goal.progress >= 80 ? "text-success" : goal.progress >= 50 ? "text-primary" : "text-warning"
                          )}>{goal.status}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {goal.dueDate}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button variant="ghost" size="sm" className="h-10 px-4 hover:bg-primary/10 hover:text-primary">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ObservationReportView({ observations, team }: { observations: Observation[], team: typeof teamMembers }) {
  const { obsId } = useParams();
  const navigate = useNavigate();
  const observation = observations.find(o => o.id === obsId);
  const teacher = team.find(t => t.name === observation?.teacher);

  const [showReflection, setShowReflection] = useState(false);

  if (!observation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">Report not found</h2>
        <Button onClick={() => navigate("/leader/observations")} className="mt-4">Back to Observations</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Instructional Review Report"
            subtitle={`Ref: #OBS-${observation.id.toUpperCase()}`}
          />
        </div>
        <div className="flex items-center gap-2">

          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          {(observation.hasReflection || observation.detailedReflection) && (
            <Button
              variant={showReflection ? "secondary" : "default"}
              size="sm"
              className="gap-2"
              onClick={() => {
                setShowReflection(!showReflection);
                if (!showReflection) {
                  setTimeout(() => document.getElementById('reflection-card')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
              }}
            >
              <MessageSquare className="w-4 h-4" />
              {showReflection ? "Hide Reflection" : "View Teacher Reflection"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              toast.info("Please select 'Save as PDF' in the print dialog.");
              setTimeout(() => window.print(), 500);
            }}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              const subject = `Observation Report: ${observation.teacher} - ${observation.date}`;
              const body = `Please find the observation report details for ${observation.teacher} observed on ${observation.date}.\n\nDomain: ${observation.domain}\nScore: ${observation.score}/5\n\nLink: ${window.location.href}`;
              window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Assessment Card */}
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
                    <span className="text-muted-foreground text-sm font-medium">{observation.date}, 2026</span>
                  </div>
                  <CardTitle className="text-3xl font-bold">Instructional Assessment</CardTitle>
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
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Teacher</p>
                  <p className="text-lg font-bold">{observation.teacher}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Observer</p>
                  <p className="text-lg font-bold">Dr. Sarah Johnson</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                  <FileText className="w-5 h-5" />
                  Observation Summary & Evidence
                </h3>
                <div className="p-6 rounded-2xl bg-muted/20 border border-muted-foreground/10 text-foreground leading-relaxed italic">
                  "{observation.notes || "The lesson demonstrated strong alignment with the curriculum standards. Student engagement remained high throughout the activity, particularly during the collaborative problem-solving phase. Feedback provided to students was timely and specific, helping them navigate complex concepts with confidence."}"
                </div>
              </div>

              {/* Reflection content moved to Dialog */}

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  Key Strengths Observed
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    <span className="text-sm font-medium">Effective use of open-ended questioning to stimulate higher-order thinking.</span>
                  </li>
                  <li className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    <span className="text-sm font-medium">Clear transitions between lesson components maintained instructional momentum.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-muted-foreground border-t">
                <p>Digitally signed by Dr. Sarah Johnson</p>
                <p>Timestamp: Feb 04, 2026 13:28:45</p>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Reflection Card - Collapsible */}
          {(observation.hasReflection || observation.detailedReflection) && showReflection && (
            <div id="reflection-card" className="animate-in slide-in-from-bottom-5 fade-in duration-500">
              <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden mt-8">
                <CardHeader className="bg-indigo-50/40 pb-8 border-b border-indigo-100/50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground">Teacher Reflection</CardTitle>
                        <CardDescription>
                          Submitted on {observation.detailedReflection ? new Date(observation.detailedReflection.submissionDate).toLocaleDateString() : observation.date} • Self-Assessment
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {observation.detailedReflection ? (
                    <div className="space-y-8">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-700">Strengths</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-medium text-foreground/80 leading-relaxed">{observation.detailedReflection.strengths}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-700">Areas for Growth</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-medium text-foreground/80 leading-relaxed">{observation.detailedReflection.improvements}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-700">Goal for Next Cycle</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-medium text-foreground/80 leading-relaxed">{observation.detailedReflection.goal}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Detailed Sections */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          Reflection Details
                        </h3>
                        {Object.entries(observation.detailedReflection.sections).map(([key, section]) => (
                          <div key={key} className="space-y-4 border rounded-2xl p-6 bg-card/50">
                            <div className="flex items-center gap-3 pb-4 border-b">
                              <div className="w-2 h-8 rounded-full bg-indigo-500" />
                              <h4 className="font-bold text-lg">{section.title}</h4>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Self-Ratings</p>
                                <div className="space-y-3">
                                  {section.ratings.map(r => (
                                    <div key={r.indicator} className="flex justify-between items-center group">
                                      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{r.indicator}</span>
                                      <Badge variant={r.rating === "Highly Effective" ? "default" : r.rating === "Effective" ? "secondary" : "outline"} className="ml-4">
                                        {r.rating}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Evidence Provided</p>
                                <div className="p-4 rounded-xl bg-muted/30 text-sm italic leading-relaxed text-muted-foreground border border-dashed border-muted-foreground/20">
                                  "{section.evidence}"
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-muted/20 border-2 border-dashed border-muted-foreground/10 text-lg leading-relaxed text-foreground/80 italic text-center">
                      "{observation.reflection}"
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-lg">Instructional Impact</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Performance Tier</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{observation.score === 5 ? "Distinguished" : observation.score === 4 ? "Proficient" : "Developing"}</p>
                    <p className="text-xs text-muted-foreground">Exceeds standard expectations</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Growth Vector</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-bold text-success">+0.4 Increase</p>
                    <p className="text-xs text-muted-foreground">Compared to last observation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-primary/5 border border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review this report with the teacher during the post-observation conference. Define one specific actionable goal for the next cycle.
              </p>
              <Button className="w-full gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Debrief
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ObservationsManagementView({ observations }: { observations: Observation[] }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredObservations = observations.filter(obs =>
    obs.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obs.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leader")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Observations Management"
            subtitle="Audit teacher reviews and instructional quality"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search observations..."
              className="pl-10 w-[250px] bg-background/50 border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={observations.length}
          subtitle="This academic year"
          icon={Eye}
          onClick={() => navigate("/leader/observations")}
        />
        <StatCard
          title="Average Score"
          value="3.9"
          subtitle="Institutional avg"
          icon={Star}
          onClick={() => navigate("/leader/performance")}
        />
        <StatCard
          title="Distinguished"
          value={observations.filter(o => o.score === 5).length}
          subtitle="Top tier performance"
          icon={TrendingUp}
          onClick={() => navigate("/leader/performance")}
        />
        <StatCard
          title="Pending Feedback"
          value="2"
          subtitle="Requires attention"
          icon={FileText}
          onClick={() => navigate("/leader/reports")}
        />
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>Observation Audit Log</CardTitle>
          <CardDescription>View and manage all classroom visit records.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Teacher</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Domain</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Score</th>
                  <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredObservations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6 text-sm font-medium text-muted-foreground">
                      {obs.date}, 2026
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{obs.teacher}</p>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        {obs.domain}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center font-bold border",
                        obs.score >= 4 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                      )}>
                        {obs.score}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Button variant="ghost" size="sm" className="h-10 px-4 gap-2 hover:bg-primary/10 hover:text-primary" onClick={() => navigate(`/leader/observations/${obs.id}`)}>
                        View Full Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ObserveView({ setObservations, setTeam, team, observations }: {
  setObservations: React.Dispatch<React.SetStateAction<Observation[]>>,
  setTeam: React.Dispatch<React.SetStateAction<typeof teamMembers>>,
  team: typeof teamMembers,
  observations: Observation[]
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    teacherName: "",
    teacherEmail: "",
    observerName: "Dr. Sarah Johnson",
    observerRole: "Head of School",
    observationDate: new Date().toISOString().split('T')[0],
    // Classroom Details
    block: "",
    grade: "",
    section: "",
    learningArea: "",
    // Assessment
    domain: "",
    score: 0,
    notes: "",
    // Extended Details
    strengths: "",
    areasForImprovement: "",
    teachingStrategies: [] as string[]
  });

  const roles = [
    "Academic Coordinator",
    "CCA Coordinator",
    "Head of School",
    "ELC Team Member",
    "PDI Team Member",
    "Other"
  ];

  const blocks = ["Early Years", "Primary", "Middle", "Senior", "Specialist"];
  const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  const learningAreas = ["Mathematics", "Science", "English", "Social Studies", "Arts", "Physical Education", "Technology", "Languages"];

  const validateStep1 = () => {
    if (!formData.teacherName || !formData.teacherEmail || !formData.observerName || !formData.observationDate || !formData.observerRole) {
      toast.error("Please fill in all required fields marked with *");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.block || !formData.grade || !formData.learningArea) {
      toast.error("Please complete all required classroom details marked with *");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain || formData.score === 0) {
      toast.error("Please complete the assessment scoring");
      return;
    }

    // Add to observations state
    const newObs = {
      id: Math.random().toString(36).substr(2, 9),
      teacher: formData.teacherName,
      domain: formData.domain,
      date: new Date(formData.observationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: formData.score,
      notes: formData.notes,
      observerName: formData.observerName,
      observerRole: formData.observerRole,
      // Add new fields to observation object if needed for storage/display later
      classroom: {
        block: formData.block,
        grade: formData.grade,
        section: formData.section,
        learningArea: formData.learningArea
      },
      hasReflection: false,
      reflection: "",
      // Extended fields
      learningArea: formData.learningArea,
      strengths: formData.strengths,
      improvements: formData.areasForImprovement,
      teachingStrategies: formData.teachingStrategies,
    } as Observation;


    setObservations(prev => [newObs, ...prev]);

    // Update teacher stats if they exist, otherwise add them
    setTeam(prev => {
      const existing = prev.find(t => t.name.toLowerCase() === formData.teacherName.toLowerCase());
      if (existing) {
        return prev.map(t => t.name.toLowerCase() === formData.teacherName.toLowerCase() ? {
          ...t,
          observations: t.observations + 1,
          lastObserved: newObs.date,
          avgScore: Number(((t.avgScore * t.observations + formData.score) / (t.observations + 1)).toFixed(1))
        } : t);
      } else {
        return [...prev, {
          id: (prev.length + 1).toString(),
          name: formData.teacherName,
          role: "Subject Teacher",
          observations: 1,
          lastObserved: newObs.date,
          avgScore: formData.score,
          pdHours: 0,
          completionRate: 0
        }];
      }
    });

    toast.success(`Observation for ${formData.teacherName} recorded successfully!`);
    navigate("/leader");
  };

  if (!team || !observations) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard data...</div>;
  }

  if (getActiveTemplateByType("Observation")) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leader")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="New Observation"
            subtitle="Record teacher performance using Master Template"
          />
        </div>
        <Card className="border-none shadow-xl bg-background overflow-hidden">
          <CardHeader className="bg-primary/5 border-b py-6">
            <CardTitle className="text-xl font-bold">Instructional Review (Master)</CardTitle>
            <CardDescription>All fields are mandatory unless marked optional</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <DynamicForm
              fields={getActiveTemplateByType("Observation")!.fields}
              submitLabel="Submit Observation"
              onCancel={() => navigate("/leader")}
              onSubmit={(data) => {
                const newObs = {
                  id: Math.random().toString(36).substr(2, 9),
                  teacher: data.t1 || "Unknown Teacher",
                  domain: data.a1 || "General",
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  score: Number(data.a2) || 0,
                  notes: data.a3 || "",
                  observerName: data.o1 || "Dr. Sarah Johnson",
                  observerRole: data.o3 || "Head of School",
                  classroom: {
                    block: data.c1 || "",
                    grade: data.c2 || "",
                    section: data.c3 || "",
                    learningArea: data.c4 || ""
                  },
                  hasReflection: false,
                  reflection: "",
                  learningArea: data.c4 || "",
                  strengths: data.a4 || "",
                  improvements: data.a5 || "",
                  teachingStrategies: data.a6 ? data.a6.split(",").map(s => s.trim()) : [],
                } as Observation;

                setObservations(prev => [newObs, ...prev]);
                toast.success("Observation recorded using Master Template!");
                navigate("/leader");
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leader")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title="New Observation"
          subtitle="Record teacher performance and provide growth feedback"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl bg-background overflow-visible">
            <CardHeader className="bg-primary/5 border-b mb-6 py-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold">Observation Details</CardTitle>
                  <CardDescription className="text-base">Step {step} of 3: {step === 1 ? "Basic Info" : step === 2 ? "Classroom Context" : "Assessment"}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={cn("w-3 h-3 rounded-full transition-colors", step >= s ? "bg-primary" : "bg-muted")} />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-10 px-2 lg:px-4">

                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-8">
                    {/* Teacher Details Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-l-4 border-primary pl-4 -ml-4 lg:-ml-6">
                        <Users className="w-5 h-5" />
                        Teacher Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="teacherName" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Name of the Teacher <span className="text-destructive">*</span></Label>
                          <Input
                            id="teacherName"
                            placeholder="Enter teacher's full name"
                            value={formData.teacherName}
                            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                            className="h-14 bg-background border-muted-foreground/20 focus:ring-4 focus:ring-primary/10 transition-all text-base px-4 rounded-xl"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="teacherEmail" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Teacher Email ID <span className="text-destructive">*</span></Label>
                          <Input
                            id="teacherEmail"
                            type="email"
                            placeholder="teacher@school.com"
                            value={formData.teacherEmail}
                            onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                            className="h-14 bg-background border-muted-foreground/20 focus:ring-4 focus:ring-primary/10 transition-all text-base px-4 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Observer Details Section */}
                    <div className="space-y-6 pt-6 border-t border-dashed">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-l-4 border-primary pl-4 -ml-4 lg:-ml-6">
                        <Eye className="w-5 h-5" />
                        Observer Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="observerName" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Observer's Name <span className="text-destructive">*</span></Label>
                          <Input
                            id="observerName"
                            value={formData.observerName}
                            onChange={(e) => setFormData({ ...formData, observerName: e.target.value })}
                            className="h-14 bg-background border-muted-foreground/20 text-base px-4 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="obsDate" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Date of Observation <span className="text-destructive">*</span></Label>
                          <Input
                            id="obsDate"
                            type="date"
                            value={formData.observationDate}
                            onChange={(e) => setFormData({ ...formData, observationDate: e.target.value })}
                            className="h-14 bg-background border-muted-foreground/20 text-base px-4 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-5 pt-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Observer's Role <span className="text-destructive">*</span></Label>
                        <RadioGroup
                          value={formData.observerRole}
                          onValueChange={(val) => setFormData({ ...formData, observerRole: val })}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {roles.map((role) => (
                            <div key={role} className="flex items-center space-x-3 p-4 rounded-xl border bg-background hover:bg-muted/30 transition-all cursor-pointer group has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-2 has-[:checked]:ring-primary/10">
                              <RadioGroupItem value={role} id={role} className="w-5 h-5" />
                              <Label htmlFor={role} className="flex-1 cursor-pointer font-semibold group-hover:text-primary transition-colors text-base">
                                {role}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Classroom Details */}
                {step === 2 && (
                  <div className="space-y-8">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-l-4 border-primary pl-4 -ml-4 lg:-ml-6">
                      <Book className="w-5 h-5" />
                      Classroom Details
                    </h3>

                    <div className="space-y-5">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Block <span className="text-destructive">*</span></Label>
                      <RadioGroup
                        value={formData.block}
                        onValueChange={(val) => setFormData({ ...formData, block: val })}
                        className="space-y-3"
                      >
                        {blocks.map((block) => (
                          <div key={block} className="flex items-center space-x-3">
                            <RadioGroupItem value={block} id={block} className="w-5 h-5" />
                            <Label htmlFor={block} className="cursor-pointer text-base font-medium">{block}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="grade" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Grade <span className="text-destructive">*</span></Label>
                      <select
                        id="grade"
                        className="w-full flex h-14 rounded-xl border border-muted-foreground/20 bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 transition-all font-medium"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      >
                        <option value="">Choose</option>
                        {grades.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="section" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Section</Label>
                      <Input
                        id="section"
                        placeholder="Your answer"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="h-14 bg-background border-muted-foreground/20 border-t-0 border-x-0 border-b-2 rounded-none px-0 focus:ring-0 focus:border-primary transition-all text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="learningArea" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Learning Area <span className="text-destructive">*</span></Label>
                      <select
                        id="learningArea"
                        className="w-full flex h-14 rounded-xl border border-muted-foreground/20 bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 transition-all font-medium"
                        value={formData.learningArea}
                        onChange={(e) => setFormData({ ...formData, learningArea: e.target.value })}
                      >
                        <option value="">Choose</option>
                        {learningAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}


                {/* Step 3: Assessment */}
                {step === 3 && (
                  <div className="space-y-8">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-l-4 border-primary pl-4 -ml-4 lg:-ml-6">
                      <Target className="w-5 h-5" />
                      Instructional Assessment
                    </h3>
                    <div className="space-y-3">
                      <Label htmlFor="domain" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Observation Domain <span className="text-destructive">*</span></Label>
                      <select
                        id="domain"
                        className="w-full flex h-14 rounded-xl border border-muted-foreground/20 bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 transition-all disabled:cursor-not-allowed disabled:opacity-50 font-medium"
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        autoFocus
                      >
                        <option value="">Select a domain...</option>
                        {domainAverages.map(d => (
                          <option key={d.domain} value={d.domain}>{d.domain}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4 pt-4">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Performance Score <span className="text-destructive">*</span></Label>
                      <div className="flex items-center gap-3 p-5 rounded-2xl bg-muted/20 border border-muted/50">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFormData({ ...formData, score: s })}
                            className={cn(
                              "w-14 h-14 rounded-2xl font-bold transition-all flex items-center justify-center text-xl",
                              formData.score === s
                                ? "bg-primary text-primary-foreground scale-110 shadow-xl ring-4 ring-primary/20"
                                : "bg-background border text-muted-foreground hover:border-primary/50 hover:text-primary"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                        <div className="ml-auto text-base font-bold text-muted-foreground">
                          {formData.score > 0 ? (
                            <span className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                              <Star className="w-5 h-5 fill-current" />
                              {formData.score === 5 ? "Distinguished" : formData.score === 4 ? "Proficient" : formData.score === 3 ? "Developing" : "Needs Improvement"}
                            </span>
                          ) : "Select score"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Label htmlFor="notes" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Observation Notes & Feedback</Label>
                      <Textarea
                        id="notes"
                        placeholder="Provide specific, actionable feedback based on class observation..."
                        className="min-h-[120px] text-base p-6 bg-background resize-none focus:ring-4 focus:ring-primary/10 rounded-2xl border-muted-foreground/20 leading-relaxed"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-3">
                        <Label htmlFor="strengths" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Strengths Observed</Label>
                        <Textarea
                          id="strengths"
                          placeholder="What went well?"
                          className="min-h-[100px] bg-background resize-none focus:ring-4 focus:ring-success/10 rounded-xl border-muted-foreground/20"
                          value={formData.strengths}
                          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="improvements" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Areas for Growth</Label>
                        <Textarea
                          id="improvements"
                          placeholder="What needs improvement?"
                          className="min-h-[100px] bg-background resize-none focus:ring-4 focus:ring-orange-500/10 rounded-xl border-muted-foreground/20"
                          value={formData.areasForImprovement}
                          onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Label htmlFor="strategies" className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Teaching Strategies (Comma separated)</Label>
                      <Input
                        id="strategies"
                        placeholder="e.g., Differentiation, Group Work, Scaffolding"
                        className="h-14 bg-background border-muted-foreground/20 text-base px-4 rounded-xl"
                        value={formData.teachingStrategies.join(", ")}
                        onChange={(e) => setFormData({ ...formData, teachingStrategies: e.target.value.split(",").map(s => s.trim()) })}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t flex justify-end gap-5 pb-6">
                  {step > 1 ? (
                    <Button variant="outline" type="button" size="lg" onClick={handleBack} className="h-14 px-10 text-base font-semibold rounded-xl">
                      Back
                    </Button>
                  ) : (
                    <Button variant="outline" type="button" size="lg" onClick={() => navigate("/leader")} className="h-14 px-10 text-base font-semibold rounded-xl">
                      Cancel
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button type="button" size="lg" onClick={handleNext} className="h-14 px-10 gap-3 text-base font-bold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0">
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button type="submit" size="lg" className="h-14 px-10 gap-3 text-base font-bold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0 text-white">
                      <Save className="w-6 h-6" />
                      Complete Observation
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-info/5 border-info/10 rounded-2xl">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-xl flex items-center gap-3 font-bold">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                Observation Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 text-base space-y-5 text-muted-foreground leading-relaxed">
              <p>When conducting a formal instructional review, please focus on these core pillars:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span><strong>Engagement:</strong> Are students actively participating?</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span><strong>Clarity:</strong> Are learning objectives clear and visible?</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span><strong>Pacing:</strong> Is the lesson flow appropriate for the content?</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span><strong>Culture:</strong> Is the classroom environment supportive?</span>
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-background border border-primary/20 text-sm font-medium text-primary shadow-sm italic">
                "Growth-focused feedback is specific, timely, and evidence-based."
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-warning/5 border-warning/10 rounded-2xl">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-xl flex items-center gap-3 font-bold text-warning">
                <div className="p-2 rounded-lg bg-warning/20">
                  <HistoryIcon className="w-6 h-6" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5">
              {observations.slice(0, 3).map(obs => (
                <div key={obs.id} className="group cursor-default border-b border-warning/10 pb-4 last:border-0 last:pb-0">
                  <p className="font-bold text-foreground group-hover:text-warning transition-colors">{obs.teacher}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                    <span className="bg-background/50 px-2 py-0.5 rounded border text-xs">{obs.domain}</span>
                    <span className="font-medium">{obs.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
}

function AssignGoalView({ setGoals }: { setGoals: React.Dispatch<React.SetStateAction<any[]>> }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leader/goals")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <PageHeader
            title="Assign New Goal"
            subtitle="Set academic year goals for educators"
          />
        </div>
      </div>

      {getActiveTemplateByType("Goal Setting") ? (
        <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <DynamicForm
              fields={getActiveTemplateByType("Goal Setting")!.fields}
              submitLabel="Assign Goal"
              onCancel={() => navigate("/leader/goals")}
              onSubmit={(data) => {
                const newGoal = {
                  id: Math.random().toString(36).substr(2, 9),
                  teacher: data.g1 || "Unknown Teacher",
                  title: data.g9 || "New School Goal",
                  category: data.g12 || "General",
                  progress: 0,
                  status: "Assigned",
                  dueDate: "Jun 28, 2026",
                  assignedBy: data.g2 || "Admin",
                  description: data.g10 || "",
                  actionStep: data.g11 || "",
                  pillar: data.g12 || "Professional Practice",
                  campus: data.g3 || "HQ",
                  ay: "25-26",
                  isSchoolAligned: true,
                  assignedDate: new Date().toISOString(),
                  reflectionCompleted: true,
                };

                setGoals(prev => [...prev, newGoal]);
                toast.success("Goal successfully assigned using Master Template.");
                navigate("/leader/goals");
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <GoalSettingForm
          defaultCoachName="Dr. Sarah Johnson"
          onCancel={() => navigate("/leader/goals")}
          onSubmit={(data) => {
            const newGoal = {
              id: Math.random().toString(36).substr(2, 9),
              teacher: data.educatorName,
              title: data.goalForYear,
              category: data.pillarTag,
              progress: 0,
              status: "Assigned",
              dueDate: "Jun 28, 2026",
              assignedBy: data.coachName,
              description: data.reasonForGoal,
              actionStep: data.actionStep,
              pillar: data.pillarTag,
              campus: data.campus,
              ay: "25-26",
              isSchoolAligned: true,
              assignedDate: data.dateOfGoalSetting.toISOString(),
              reflectionCompleted: true,
            };

            setGoals(prev => [...prev, newGoal]);
            toast.success("Goal successfully assigned.");
            navigate("/leader/goals");
          }}
        />
      )}
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
        This management module is currently in development.
        It will provide deep insights and powerful tools for school leaders once released.
      </p>
      <Button asChild>
        <Link to="/leader">Return to Overview</Link>
      </Button>
    </div>
  );
}

function MoocResponsesView() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  useEffect(() => {
    const loadSubmissions = () => {
      const data = localStorage.getItem("mooc_submissions");
      if (data) {
        setSubmissions(JSON.parse(data));
      }
    };
    loadSubmissions();
    window.addEventListener("mooc-submission-updated", loadSubmissions);
    return () => window.removeEventListener("mooc-submission-updated", loadSubmissions);
  }, []);

  const filteredSubmissions = submissions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leader/calendar")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title="Course Evidence Registry"
          subtitle="Review MOOC completions and reflection evidence"
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            className="pl-10 w-[250px] bg-background border-muted-foreground/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Teacher</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Course</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Platform</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Completion Date</th>
                  <th className="text-left p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Evidence</th>
                  <th className="text-right p-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/10">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.email}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-medium text-foreground">{sub.courseName}</p>
                      <p className="text-xs text-muted-foreground">{sub.hours} Hours</p>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline">{sub.platform === 'Other' ? sub.otherPlatform : sub.platform}</Badge>
                    </td>
                    <td className="p-6">
                      {new Date(sub.completionDate).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      {sub.hasCertificate === 'yes' ? (
                        <a href={sub.proofLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-medium">
                          <LinkIcon className="w-3 h-3" />
                          Certificate
                        </a>
                      ) : (
                        <Badge variant="secondary">Reflection</Badge>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(sub)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && new Date(selectedSubmission.submittedAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Teacher</Label>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Campus</Label>
                  <p className="font-medium">{selectedSubmission.campus}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Course</Label>
                  <p className="font-medium">{selectedSubmission.courseName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Platform</Label>
                  <p className="font-medium">{selectedSubmission.platform === 'Other' ? selectedSubmission.otherPlatform : selectedSubmission.platform}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hours</Label>
                  <p className="font-medium">{selectedSubmission.hours}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Completion Date</Label>
                  <p className="font-medium">{new Date(selectedSubmission.completionDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="h-px bg-border my-4" />

              {selectedSubmission.hasCertificate === 'yes' ? (
                <div>
                  <Label className="text-muted-foreground block mb-2">Certificate</Label>
                  <a href={selectedSubmission.proofLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline border px-4 py-2 rounded-md bg-primary/5">
                    <LinkIcon className="w-4 h-4" />
                    Open Certificate Link
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2"><Brain className="w-4 h-4" /> Reflection</h4>
                  <div>
                    <Label className="text-muted-foreground">Key Takeaways</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedSubmission.keyTakeaways}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Unanswered Questions</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{selectedSubmission.unansweredQuestions}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Self-Assessment</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-bold">{selectedSubmission.effectivenessRating}/10</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Supporting Documents Section */}
              {(selectedSubmission.supportingDocType || selectedSubmission.supportingDocLink || selectedSubmission.supportingDocFile) && (
                <div>
                  <div className="h-px bg-border my-4" />
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Paperclip className="w-4 h-4" /> Supporting Documents
                  </h4>

                  {selectedSubmission.supportingDocType === 'link' && selectedSubmission.supportingDocLink && (
                    <div>
                      <Label className="text-muted-foreground block mb-2">External Link</Label>
                      <a
                        href={selectedSubmission.supportingDocLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline border px-4 py-2 rounded-md bg-primary/5"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Open Attached Document
                      </a>
                    </div>
                  )}

                  {selectedSubmission.supportingDocType === 'file' && selectedSubmission.supportingDocFile && (
                    <div>
                      <Label className="text-muted-foreground block mb-2">Attached File</Label>
                      <a
                        href={selectedSubmission.supportingDocFile}
                        download={selectedSubmission.supportingDocFileName || "supporting-document"}
                        className="inline-flex items-center gap-2 text-primary hover:underline border px-4 py-2 rounded-md bg-primary/5"
                      >
                        <Download className="w-4 h-4" />
                        Download {selectedSubmission.supportingDocFileName || "Document"}
                      </a>
                    </div>
                  )}
                </div>
              )}
              <div className="h-px bg-border my-4" />

              <div>
                <Label className="text-muted-foreground">Effectiveness Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={cn("w-2 h-2 rounded-full", i < selectedSubmission.effectivenessRating[0] ? "bg-primary" : "bg-muted")} />
                    ))}
                  </div>
                  <span className="font-bold">{selectedSubmission.effectivenessRating[0]}/10</span>
                </div>
              </div>

              {selectedSubmission.additionalFeedback && (
                <div>
                  <Label className="text-muted-foreground">Additional Feedback</Label>
                  <p className="mt-1 text-sm italic">{selectedSubmission.additionalFeedback}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
