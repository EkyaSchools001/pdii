
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    Settings, Bell, Lock, Globe, Mail, Save, Server
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

export function SystemSettingsView() {
    const handleSave = () => {
        toast.success("Settings saved successfully");
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Platform Settings"
                subtitle="Configure system preferences, notifications, and security"
                priority={1}
                actions={
                    <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                }
            />

            <Tabs defaultValue="general" className="gap-6 flex flex-col md:flex-row">
                <TabsList className="bg-transparent flex-col h-auto items-start gap-1 p-0 w-full md:w-64">
                    <TabsTrigger value="general" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Settings className="w-4 h-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Bell className="w-4 h-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Lock className="w-4 h-4" /> Security & Access
                    </TabsTrigger>
                    <TabsTrigger value="email" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Mail className="w-4 h-4" /> Email Templates
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Globe className="w-4 h-4" /> Integrations
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1">
                    <TabsContent value="general" className="m-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Configuration</CardTitle>
                                <CardDescription>Basic system information and display settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="schoolName">School Name</Label>
                                    <Input id="schoolName" defaultValue="Springfield High School" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="domain">Primary Domain</Label>
                                    <Input id="domain" defaultValue="school.edu" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Maintenance Mode</Label>
                                        <p className="text-sm text-muted-foreground">Temporarily disable access for all users except admins.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Academic Year Settings</CardTitle>
                                <CardDescription>Configure current term and year dates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Current Academic Year</Label>
                                        <Input defaultValue="AY 2025-2026" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Current Term</Label>
                                        <Input defaultValue="Term 2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="m-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Manage how and when system emails are sent.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>New User Registration</Label>
                                        <p className="text-sm text-muted-foreground">Notify admins when a new user registers.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Observation Completed</Label>
                                        <p className="text-sm text-muted-foreground">Notify teachers when an observation report is finalized.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Weekly Digest</Label>
                                        <p className="text-sm text-muted-foreground">Send weekly summary of platform activity to leaders.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Add other tab contents as needed */}
                </div>
            </Tabs>
        </div>
    )
}
