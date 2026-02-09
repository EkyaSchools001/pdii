
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Clock, MapPin, Map, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

// Mock Data (Reusing structure for consistency)
const initialTrainingEvents = [
    { id: "1", title: "Differentiated Instruction Workshop", type: "Pedagogy", date: "Feb 15", time: "09:00 AM", location: "Auditorium A", registered: 12, capacity: 20, status: "Approved" },
    { id: "2", title: "Digital Literacy in Classroom", type: "Technology", date: "Feb 18", time: "02:00 PM", location: "Computer Lab 1", registered: 18, capacity: 25, status: "Approved" },
    { id: "3", title: "Social-Emotional Learning Hub", type: "Culture", date: "Feb 22", time: "11:00 AM", location: "Conference Room B", registered: 8, capacity: 15, status: "Approved" },
    { id: "4", title: "Advanced Formative Assessment", type: "Assessment", date: "Feb 25", time: "03:30 PM", location: "Main Library", registered: 15, capacity: 20, status: "Pending" },
];

export function AdminCalendarView() {
    const [training, setTraining] = useState(initialTrainingEvents);
    const [searchQuery, setSearchQuery] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 1, 15)); // Default to Feb 15, 2026
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const [newEvent, setNewEvent] = useState({ title: "", type: "Pedagogy", date: new Date(2026, 1, 15), time: "09:00 AM", location: "" });

    // Helper to format Date object to "MMM DD" string
    const formatDateStr = (d: Date) => {
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const handleScheduleEvent = () => {
        if (!newEvent.title || !newEvent.date) {
            toast.error("Please fill in required fields");
            return;
        }
        const event = {
            id: (training.length > 0 ? Math.max(...training.map(t => parseInt(t.id))) + 1 : 1).toString(),
            ...newEvent,
            date: formatDateStr(newEvent.date),
            registered: 0,
            capacity: 30,
            status: "Approved"
        };
        setTraining([...training, event]);
        setIsScheduleOpen(false);
        setNewEvent({ title: "", type: "Pedagogy", date: new Date(2026, 1, 15), time: "09:00 AM", location: "" });
        toast.success("Event scheduled successfully");
    };

    const handleEditEvent = () => {
        if (!currentEvent?.title || !currentEvent?.date) {
            toast.error("Please fill in required fields");
            return;
        }

        // Ensure date is string if it was changed to Date object in dialog
        const updatedEvent = {
            ...currentEvent,
            date: typeof currentEvent.date === 'string' ? currentEvent.date : formatDateStr(currentEvent.date)
        };

        setTraining(training.map(t => t.id === updatedEvent.id ? updatedEvent : t));
        setIsEditOpen(false);
        toast.success("Event updated successfully");
    };

    const handleDeleteEvent = () => {
        if (!currentEvent) return;
        setTraining(training.filter(t => t.id !== currentEvent.id));
        setIsDeleteOpen(false);
        toast.success("Event deleted successfully");
    };

    const handleManageSession = (event: any) => {
        setCurrentEvent(event);
        setIsEditOpen(true);
    }

    // Helper to parse "MMM DD" string to Date object for year 2026
    const parseEventDate = (dateStr: string) => {
        try {
            const [monthStr, dayStr] = dateStr.split(" ");
            const month = new Date(`${monthStr} 1, 2026`).getMonth();
            return new Date(2026, month, parseInt(dayStr));
        } catch (e) {
            return new Date();
        }
    };

    const filteredEvents = training.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.type.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesDate = true;
        if (date) {
            matchesDate = e.date === formatDateStr(date);
        }

        return matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Training Calendar"
                subtitle="Schedule and manage professional development sessions"
                actions={
                    <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule Training Event</DialogTitle>
                                <DialogDescription>Add a new session to the PD calendar.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="event-title">Event Title</Label>
                                    <Input id="event-title" placeholder="Workshop Name" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-type">Type</Label>
                                        <Select value={newEvent.type} onValueChange={v => setNewEvent({ ...newEvent, type: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Assessment">Assessment</SelectItem>
                                                <SelectItem value="Culture">Culture</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !newEvent.date && "text-muted-foreground"
                                                    )}
                                                >
                                                    {newEvent.date ? (
                                                        formatDateStr(newEvent.date)
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={newEvent.date}
                                                    onSelect={(d) => d && setNewEvent({ ...newEvent, date: d })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-time">Time</Label>
                                        <Input id="event-time" placeholder="09:00 AM" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="event-location">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="event-location" className="pl-9" placeholder="Room/Lab" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                                <Button onClick={handleScheduleEvent}>Schedule</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Widget - Fitness Style (Reused) */}
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
                                    pedagogy: training.filter(e => e.type === "Pedagogy").map(e => parseEventDate(e.date)),
                                    technology: training.filter(e => e.type === "Technology").map(e => parseEventDate(e.date)),
                                    assessment: training.filter(e => e.type === "Assessment").map(e => parseEventDate(e.date)),
                                    other: training.filter(e => !["Pedagogy", "Technology", "Assessment"].includes(e.type)).map(e => parseEventDate(e.date)),
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
                                    <span className="font-mono text-white">{training.filter(t => t.type === 'Pedagogy').length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2 text-zinc-300">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Technology
                                    </span>
                                    <span className="font-mono text-white">{training.filter(t => t.type === 'Technology').length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2 text-zinc-300">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span> Assessment
                                    </span>
                                    <span className="font-mono text-white">{training.filter(t => t.type === 'Assessment').length}</span>
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

                {/* Events List */}
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
                                                        {session.type}
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
                                                    <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-primary/10 hover:text-primary" onClick={() => handleManageSession(session)}>
                                                        Manage
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
            </div>

            {/* Edit Event Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Training Event</DialogTitle>
                        <DialogDescription>Modify the details of this professional development session.</DialogDescription>
                    </DialogHeader>
                    {currentEvent && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-event-title">Event Title</Label>
                                <Input id="edit-event-title" value={currentEvent.title} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-event-type">Type</Label>
                                    <Select value={currentEvent.type} onValueChange={v => setCurrentEvent({ ...currentEvent, type: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Assessment">Assessment</SelectItem>
                                            <SelectItem value="Culture">Culture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !currentEvent.date && "text-muted-foreground"
                                                )}
                                            >
                                                {currentEvent.date ? (
                                                    typeof currentEvent.date === 'string' ? currentEvent.date : formatDateStr(currentEvent.date)
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={typeof currentEvent.date === 'string' ? parseEventDate(currentEvent.date) : currentEvent.date}
                                                onSelect={(d) => d && setCurrentEvent({ ...currentEvent, date: d })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-event-time">Time</Label>
                                    <Input id="edit-event-time" value={currentEvent.time} onChange={e => setCurrentEvent({ ...currentEvent, time: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-event-location">Location</Label>
                                    <Input id="edit-event-location" value={currentEvent.location} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} />
                                </div>
                            </div>
                            <div className="pt-4 border-t mt-2">
                                <Button variant="destructive" size="sm" className="w-full" onClick={() => { setIsEditOpen(false); setIsDeleteOpen(true); }}>
                                    Delete Event
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditEvent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{currentEvent?.title}</strong>? This will remove it from the calendar for all staff members.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteEvent}>Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
