import React from "react";
import { Search, Filter, Users, BookOpen, Plus, MoreHorizontal, LayoutGrid, Clock, Calendar } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export default function ClassListing() {
    const { user } = useAuth();
    const isFaculty = user?.role?.toLowerCase() === "faculty";

    const facultyClasses = [
        {
            title: "Advanced Algorithms",
            section: "CS401-B",
            students: 42,
            status: "Active",
            schedule: "Mon, Wed • 10:00 AM",
            room: "Lab 4, Innovation Center"
        },
        {
            title: "Network Security",
            section: "CS302-A",
            students: 38,
            status: "Inactive",
            schedule: "Tue, Thu • 02:00 PM",
            room: "Theory Hall 2"
        },
        {
            title: "Cloud Scale Systems",
            section: "CS505-C",
            students: 124,
            status: "Active",
            schedule: "Friday • 09:00 AM",
            room: "Main Auditorium"
        },
    ];

    const studentCourses = [
        { title: "Intro to Python", code: "CS101", instructor: "Dr. Miller", progress: 85 },
        { title: "Discrete Math", code: "MAT200", instructor: "Prof. Zhang", progress: 60 },
        { title: "UI/UX Design", code: "DES302", instructor: "Sarah Lee", progress: 95 },
    ];

    const data = isFaculty ? facultyClasses : studentCourses;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isFaculty ? "Faculty Course Portfolio" : "Enrolled Courses"}
                        </h1>
                        <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">
                            {isFaculty ? "Master overview of your academic workloads" : "Your active academic journey and progress"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="px-6 h-10 font-bold uppercase tracking-tighter shadow-lg shadow-primary/10">
                            <Plus size={18} /> {isFaculty ? "New Course" : "Enrollment Code"}
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {data.map((item, i) => (
                        <Card key={i} className="hover:border-foreground/20 transition-all cursor-pointer group shadow-sm overflow-hidden border-border bg-card">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`h-16 w-16 rounded-xl flex items-center justify-center transition-all ${isFaculty ? 'bg-foreground text-background shadow-md' : 'bg-primary text-primary-foreground'
                                            }`}>
                                            <BookOpen size={28} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl group-hover:text-foreground tracking-tight">{item.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">
                                                <span className="text-foreground bg-muted px-2 py-0.5 rounded-sm">{isFaculty ? item.section : item.code}</span>
                                                {isFaculty ? (
                                                    <>
                                                        <span className="flex items-center gap-1.5"><Users size={12} className="text-primary" /> {item.students} Enrolled</span>
                                                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {item.schedule}</span>
                                                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {item.room}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="opacity-30">•</span>
                                                        <span>Instructor: {item.instructor}</span>
                                                        <span className="opacity-30">•</span>
                                                        <span className="text-primary font-black">Progress: {item.progress}%</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest px-6 border-border hover:bg-muted transition-all">
                                            {isFaculty ? "Manage Section" : "Launch Course"}
                                        </Button>
                                        <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-muted border border-transparent hover:border-border"><MoreHorizontal size={18} /></Button>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-muted">
                                    <div
                                        className={`h-full ${isFaculty ? (item.status === 'Active' ? 'bg-green-500' : 'bg-amber-500') : 'bg-primary'}`}
                                        style={{ width: isFaculty ? '100%' : `${item.progress}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
