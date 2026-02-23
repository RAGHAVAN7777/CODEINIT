import React from "react";
import { Search, GraduationCap, FileText, Download, Play, Trophy, Clock } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

const NoteCard = ({ title, course, date }) => (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <FileText size={18} />
            </div>
            <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{course} • {date}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 w-8 p-0"><Download size={14} /></Button>
            <Button className="h-8 w-8 p-0"><Play size={14} /></Button>
        </div>
    </div>
);

export default function StudentDashboard() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Student Hub</h1>
                        <p className="text-muted-foreground text-sm">Organize your academic journey</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search notes..." className="pl-9 h-9" />
                        </div>
                        <Button className="h-9"><GraduationCap size={18} /> Join Class</Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Joined Classes", value: "8", icon: GraduationCap },
                        { label: "Shared Notes", value: "24", icon: FileText },
                        { label: "Study Time", value: "42h", icon: Clock },
                        { label: "Global Rank", value: "#4", icon: Trophy },
                    ].map((stat, i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-muted rounded-md text-muted-foreground"><stat.icon size={18} /></div>
                                <span className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-lg">Recent Resources</CardTitle>
                            <Button variant="ghost" className="text-xs">See all</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <NoteCard title="Advanced Algorithms Intro" course="CS401" date="2h ago" />
                            <NoteCard title="Database Indexing Patterns" course="CS302" date="5h ago" />
                            <NoteCard title="Cloud Scaling Protocol" course="CS505" date="Yesterday" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Saved Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "React Design Patterns", type: "PDF" },
                                { title: "SQL Mastery Guide", type: "DOCX" },
                                { title: "Quantum Physics Notes", type: "PDF" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer group">
                                    <span className="text-xs font-medium group-hover:text-foreground">{item.title}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase bg-background">{item.type}</span>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full mt-4 text-xs">Manage Vault</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
