import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Search, Plus, MoreVertical, Shield, Mail, Pencil, Trash2, UserCheck, UserX
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const initialUsers = [
    { id: 1, name: "Maria Santos", email: "maria.s@school.edu", role: "Leader", campus: "North Campus", status: "Active", lastActive: "2 hours ago" },
    { id: 2, name: "David Kim", email: "d.kim@school.edu", role: "Teacher", campus: "South Campus", status: "Active", lastActive: "5 mins ago" },
    { id: 3, name: "Emily Rodriguez", email: "e.rod@school.edu", role: "Teacher", campus: "North Campus", status: "Active", lastActive: "1 day ago" },
    { id: 4, name: "James Wilson", email: "j.wilson@school.edu", role: "Teacher", campus: "West Campus", status: "Inactive", lastActive: "2 weeks ago" },
    { id: 5, name: "Sarah Johnson", email: "s.johnson@school.edu", role: "Admin", campus: "Main Office", status: "Active", lastActive: "Just now" },
];

export function UserManagementView() {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "Teacher", campus: "" });
    const [editingUser, setEditingUser] = useState<typeof initialUsers[0] | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [campusFilter, setCampusFilter] = useState("all");

    // Get unique campuses for dropdown
    const uniqueCampuses = Array.from(new Set(initialUsers.map(user => user.campus)));

    // Calculate stats based on Campus Filter only (ignoring tab processing for the summary)
    const usersInCampus = campusFilter === "all" ? users : users.filter(u => u.campus === campusFilter);
    const teacherCount = usersInCampus.filter(u => u.role === "Teacher").length;
    const leaderCount = usersInCampus.filter(u => u.role === "Leader").length;

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTab = true;
        if (activeTab === "leader") matchesTab = user.role === "Leader";
        if (activeTab === "teacher") matchesTab = user.role === "Teacher";

        let matchesCampus = true;
        if (campusFilter !== "all") matchesCampus = user.campus === campusFilter;

        return matchesSearch && matchesTab && matchesCampus;
    });

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.campus) {
            toast.error("Please fill in all fields");
            return;
        }
        const user = {
            id: users.length + 1,
            ...newUser,
            status: "Active",
            lastActive: "Just now"
        };
        setUsers([user, ...users]);
        setIsAddDialogOpen(false);
        setNewUser({ name: "", email: "", role: "Teacher", campus: "" });
        toast.success("User added successfully");
    };

    const handleEditUser = () => {
        if (!editingUser || !editingUser.name || !editingUser.email || !editingUser.campus) {
            toast.error("Please fill in all fields");
            return;
        }
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setIsEditDialogOpen(false);
        setEditingUser(null);
        toast.success("User updated successfully");
    };

    const handleAction = (action: string, user: typeof initialUsers[0]) => {
        if (action === "Edit Details") {
            setEditingUser(user);
            setIsEditDialogOpen(true);
        } else {
            toast.info(`${action} for ${user.name}`);
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ... PageHeader ... */}
            <PageHeader
                title="User Management"
                subtitle="Manage user accounts, roles, and access permissions"
                actions={
                    // ... Dialogs ...
                    <>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            {/* ... */}
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                {/* ... existing Add Content ... */}
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>Create a new account for a staff member.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                                    <SelectItem value="Leader">Leader</SelectItem>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="campus">Campus</Label>
                                            <Select value={newUser.campus} onValueChange={v => setNewUser({ ...newUser, campus: v })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select campus" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {uniqueCampuses.map(campus => (
                                                        <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddUser}>Create User</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            {/* ... existing Edit Content ... */}
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                    <DialogDescription>Update account details for staff member.</DialogDescription>
                                </DialogHeader>
                                {editingUser && (
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-name">Full Name</Label>
                                            <Input id="edit-name" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-email">Email Address</Label>
                                            <Input id="edit-email" type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-role">Role</Label>
                                                <Select value={editingUser.role} onValueChange={v => setEditingUser({ ...editingUser, role: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Teacher">Teacher</SelectItem>
                                                        <SelectItem value="Leader">Leader</SelectItem>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit-campus">Campus</Label>
                                                <Select value={editingUser.campus} onValueChange={v => setEditingUser({ ...editingUser, campus: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select campus" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {uniqueCampuses.map(campus => (
                                                            <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleEditUser}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacherCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {campusFilter === "all" ? "Across all campuses" : `In ${campusFilter}`}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Leaders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leaderCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {campusFilter === "all" ? "Across all campuses" : `In ${campusFilter}`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-[400px]">
                    <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="leader">Leaders</TabsTrigger>
                        <TabsTrigger value="teacher">Teachers</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={campusFilter} onValueChange={setCampusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Campuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Campuses</SelectItem>
                            {uniqueCampuses.map(campus => (
                                <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-md">
                <CardContent className="p-0">
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Campus</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{user.name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{user.campus}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === "Active" ? "bg-green-600 hover:bg-green-700" : ""}>
                                                {user.status === "Active" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{user.lastActive}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleAction("Edit Details", user)}>
                                                        <Pencil className="w-4 h-4 mr-2" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction("Change Role", user)}>
                                                        <Shield className="w-4 h-4 mr-2" /> Change Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleAction("Deactivate", user)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Deactivate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
