import React, { useState, useEffect } from "react";
import { Search, Filter, Users, BookOpen, Plus, MoreHorizontal, LayoutGrid, Clock, Calendar } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { classService } from "../services/class.service";

export default function ClassListing() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isFaculty = user?.role?.toLowerCase() === "faculty";
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                const data = await classService.getMyClasses();
                setClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const data = classes;

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
                    {isFaculty && (
                        <div className="flex gap-3">
                            <Button className="px-6 h-10 font-bold uppercase tracking-tighter shadow-lg shadow-primary/10">
                                <Plus size={18} /> New Course
                            </Button>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="p-12 border border-dashed border-border rounded-lg text-center">
                            <p className="text-muted-foreground font-medium">No courses found matching your profile.</p>
                        </div>
                    ) : (
                        classes.map((item, i) => (
                            <Card
                                key={item._id}
                                onClick={() => navigate(`/classes/${item._id}`)}
                                className="hover:border-foreground/20 transition-all cursor-pointer group shadow-sm overflow-hidden border-border bg-card"
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-16 w-16 rounded-xl flex items-center justify-center transition-all ${isFaculty ? 'bg-muted text-foreground border border-border' : 'bg-primary text-primary-foreground'
                                                }`}>
                                                <BookOpen size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl group-hover:text-foreground tracking-tight">{item.class_name}</h3>
                                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">
                                                    <span className="text-foreground bg-muted px-2 py-0.5 rounded-sm">{item.class_code}</span>
                                                    {isFaculty ? (
                                                        <>
                                                            <span className="flex items-center gap-1.5"><Users size={12} className="text-primary" /> {item.students?.length || 0} Enrolled</span>
                                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> Active Code: {item.class_code}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="opacity-30">•</span>
                                                            <span>Instructor ID: {item.faculty_id}</span>
                                                            <span className="opacity-30">•</span>
                                                            <span className="text-primary font-black">Status: Enrolled</span>
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
                                            className={`h-full ${isFaculty ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
