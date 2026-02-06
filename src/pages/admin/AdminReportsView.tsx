import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, BarChart, Calendar, Users, Activity, Filter, PieChart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const reports = [
    {
        title: "Teacher Performance Summary",
        description: "Aggregated observation scores and goal completion rates by campus.",
        icon: TrendingUp,
        type: "PDF",
        frequency: "Monthly"
    },
    {
        title: "PD Hours & Attendance",
        description: "Detailed log of professional development hours per teacher.",
        icon: ClockIcon,
        type: "Excel",
        frequency: "Weekly"
    },
    {
        title: "Course Popularity & Feedback",
        description: "Analysis of course enrollments and participant feedback ratings.",
        icon: PieChart,
        type: "PDF",
        frequency: "Quarterly"
    },
    {
        title: "System Audit Log",
        description: "Complete history of user actions, logins, and permission changes.",
        icon: FileText,
        type: "CSV",
        frequency: "Real-time"
    }
];

function ClockIcon(props: any) {
    return <Calendar {...props} />
}

export function AdminReportsView() {
    const handleDownload = (reportTitle: string) => {
        toast.success(`Downloading ${reportTitle}...`);
    }

    const handleBuildReport = () => {
        toast.info("Opening Report Builder...");
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Reports & Analytics"
                subtitle="Generate and download system-wide reports"
                priority={1}
                actions={
                    <Button variant="outline" onClick={handleBuildReport}>
                        <Filter className="w-4 h-4 mr-2" />
                        Build Custom Report
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <report.icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground">{report.type}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                            <CardDescription className="mb-4 h-10">{report.description}</CardDescription>

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs text-muted-foreground">Updated: {report.frequency}</span>
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(report.title)}>
                                    <Download className="w-4 h-4" /> Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>


        </div>
    )
}
