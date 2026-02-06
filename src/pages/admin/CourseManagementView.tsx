import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Search, Plus, BookOpen, Clock, Users, MoreHorizontal, Filter
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";


const initialCourses = [
    { id: 1, title: "Differentiated Instruction Workshop", category: "Pedagogy", hours: 4, instructor: "Dr. A. Smith", status: "Active", enrolled: 45 },
    { id: 2, title: "Digital Literacy in Classroom", category: "Technology", hours: 2, instructor: "Sarah J.", status: "Active", enrolled: 32 },
    { id: 3, title: "Advanced Formative Assessment", category: "Assessment", hours: 6, instructor: "Prof. R. Doe", status: "Draft", enrolled: 0 },
    { id: 4, title: "Inclusive Classroom Strategies", category: "Culture", hours: 3, instructor: "Maria G.", status: "Active", enrolled: 28 },
    { id: 5, title: "Code of Conduct Refresher", category: "Compliance", hours: 1, instructor: "HR Dept", status: "Mandatory", enrolled: 120 },
];

export function CourseManagementView() {
    const [courses, setCourses] = useState(initialCourses);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: "", category: "Pedagogy", hours: "2" });

    const handleAddCourse = () => {
        if (!newCourse.title) {
            toast.error("Please enter a course title");
            return;
        }
        const course = {
            id: courses.length + 1,
            title: newCourse.title,
            category: newCourse.category,
            hours: parseInt(newCourse.hours),
            instructor: "TBD",
            status: "Draft",
            enrolled: 0
        };
        setCourses([course, ...courses]);
        setIsAddOpen(false);
        setNewCourse({ title: "", category: "Pedagogy", hours: "2" });
        toast.success("Course added successfully");
    };

    const handleAction = (action: string, courseTitle: string) => {
        toast.info(`${action} ${courseTitle}`);
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Course Catalogue"
                subtitle="Manage professional development courses and workshops"
                priority={1}
                actions={
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Course</DialogTitle>
                                <DialogDescription>Create a new professional development course.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Course Title</Label>
                                    <Input id="title" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={newCourse.category} onValueChange={v => setNewCourse({ ...newCourse, category: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Assessment">Assessment</SelectItem>
                                                <SelectItem value="Culture">Culture</SelectItem>
                                                <SelectItem value="Compliance">Compliance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="hours">PD Hours</Label>
                                        <Input id="hours" type="number" value={newCourse.hours} onChange={e => setNewCourse({ ...newCourse, hours: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddCourse}>Add Course</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search courses..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            <Card className="border-none shadow-md">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>PD Hours</TableHead>
                                <TableHead>Instructor</TableHead>
                                <TableHead>Enrolled</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded bg-primary/10 text-primary">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            {course.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{course.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="w-3 h-3" /> {course.hours}h
                                        </div>
                                    </TableCell>
                                    <TableCell>{course.instructor}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-muted-foreground" /> {course.enrolled}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={course.status === 'Active' ? 'default' : course.status === 'Draft' ? 'secondary' : 'destructive'}
                                            className={course.status === 'Active' ? 'bg-green-600' : ''}
                                        >
                                            {course.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleAction("Edit", course.title)}>Edit Course</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction("Manage Sessions for", course.title)}>Manage Sessions</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleAction("Delete", course.title)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
