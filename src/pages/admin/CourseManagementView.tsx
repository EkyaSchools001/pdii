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
    Search, Plus, BookOpen, Clock, Users, MoreHorizontal, Filter, Edit, Trash2
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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<any>(null);
    const [newCourse, setNewCourse] = useState({ title: "", category: "Pedagogy", hours: "2", instructor: "TBD", status: "Active" });

    const handleAddCourse = () => {
        if (!newCourse.title) {
            toast.error("Please enter a course title");
            return;
        }
        const course = {
            id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
            title: newCourse.title,
            category: newCourse.category,
            hours: parseInt(newCourse.hours),
            instructor: newCourse.instructor || "TBD",
            status: newCourse.status || "Draft",
            enrolled: 0
        };
        setCourses([course, ...courses]);
        setIsAddOpen(false);
        setNewCourse({ title: "", category: "Pedagogy", hours: "2", instructor: "TBD", status: "Active" });
        toast.success("Course added successfully");
    };

    const handleEditCourse = () => {
        if (!currentCourse?.title) {
            toast.error("Please enter a course title");
            return;
        }
        setCourses(courses.map(c => c.id === currentCourse.id ? currentCourse : c));
        setIsEditOpen(false);
        toast.success("Course updated successfully");
    };

    const handleDeleteCourse = () => {
        if (!currentCourse) return;
        setCourses(courses.filter(c => c.id !== currentCourse.id));
        setIsDeleteOpen(false);
        toast.success("Course deleted successfully");
    };

    const handleStatusChange = (id: number, newStatus: string) => {
        setCourses(courses.map(c => c.id === id ? { ...c, status: newStatus } : c));
        toast.success(`Status updated to ${newStatus}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Course Catalogue"
                subtitle="Manage professional development courses and workshops"
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="instructor">Instructor</Label>
                                        <Input id="instructor" value={newCourse.instructor} onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Initial Status</Label>
                                        <Select value={newCourse.status} onValueChange={v => setNewCourse({ ...newCourse, status: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Mandatory">Mandatory</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                <CardContent className="p-0 overflow-x-auto">
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
                                                <DropdownMenuItem onClick={() => { setCurrentCourse(course); setIsEditOpen(true); }}>
                                                    <BookOpen className="w-4 h-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(course.id, course.status === 'Active' ? 'Draft' : 'Active')}>
                                                    <Plus className="w-4 h-4 mr-2" /> Toggle Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => { setCurrentCourse(course); setIsDeleteOpen(true); }}>
                                                    <MoreHorizontal className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>Modify professional development course details.</DialogDescription>
                    </DialogHeader>
                    {currentCourse && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Course Title</Label>
                                <Input id="edit-title" value={currentCourse.title} onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select value={currentCourse.category} onValueChange={v => setCurrentCourse({ ...currentCourse, category: v })}>
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
                                    <Label htmlFor="edit-hours">PD Hours</Label>
                                    <Input id="edit-hours" type="number" value={currentCourse.hours} onChange={e => setCurrentCourse({ ...currentCourse, hours: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={currentCourse.status} onValueChange={v => setCurrentCourse({ ...currentCourse, status: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Mandatory">Mandatory</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditCourse}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{currentCourse?.title}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteCourse}>Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
