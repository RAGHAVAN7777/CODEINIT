import React from "react";
import { Search, Filter, Mail, MoreHorizontal, UserCheck, UserX, ExternalLink } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function StudentListing() {
    const students = [
        { id: "ST001", name: "Alex Johnson", email: "alex.j@cam.edu", course: "Advanced Algorithms", lastActive: "2h ago", status: "Active" },
        { id: "ST002", name: "Mia Wang", email: "mia.w@cam.edu", course: "Network Security", lastActive: "5h ago", status: "Active" },
        { id: "ST003", name: "Jordan Smith", email: "jordan.s@cam.edu", course: "Cloud Systems", lastActive: "1d ago", status: "Inactive" },
        { id: "ST004", name: "Liam O'Connor", email: "liam.o@cam.edu", course: "Advanced Algorithms", lastActive: "15m ago", status: "Active" },
        { id: "ST005", name: "Sofia Garcia", email: "sofia.g@cam.edu", course: "Cloud Systems", lastActive: "3h ago", status: "Active" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Management</h1>
                        <p className="text-muted-foreground text-sm uppercase font-black tracking-widest mt-1">Oversee all learners across your academic sections</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-10 px-6 font-bold uppercase tracking-tighter"><Mail size={18} /> Bulk Email</Button>
                        <Button className="h-10 px-6 font-bold uppercase tracking-tighter shadow-lg shadow-primary/10">Export Data</Button>
                    </div>
                </header>

                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input placeholder="Search students by name, ID or email..." className="pl-10 h-10 border-border bg-muted/20" />
                    </div>
                    <Button variant="outline" className="h-10 px-4 text-xs font-bold uppercase tracking-widest ring-1 ring-border">
                        <Filter size={16} /> Filter
                    </Button>
                </div>

                <Card className="border-border overflow-hidden shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-border">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enrolled Course</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Activity</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{student.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                                    <p className="text-[10px] text-muted-foreground lowercase tracking-tight">{student.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-foreground">{student.course}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-muted-foreground">{student.lastActive}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {student.status === "Active" ? (
                                                        <UserCheck size={14} className="text-green-500" />
                                                    ) : (
                                                        <UserX size={14} className="text-amber-500" />
                                                    )}
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${student.status === "Active" ? "text-green-600" : "text-amber-600"}`}>
                                                        {student.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" className="h-8 w-8 p-0" title="View Profile">
                                                        <ExternalLink size={14} />
                                                    </Button>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold uppercase tracking-widest px-2">
                    <span>Showing 5 of {students.length} students</span>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-8 px-3 text-[10px]" disabled>Prev</Button>
                        <Button variant="outline" className="h-8 px-3 text-[10px]" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
