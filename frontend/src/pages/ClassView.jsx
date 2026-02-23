import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, FileText, Settings, Plus, ChevronRight, Zap } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { classService } from "../services/class.service";
import { useAuth } from "../context/AuthContext";

export default function ClassView() {
    const { id } = useParams();
    const { user } = useAuth();
    const [classData, setClassData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFaculty = user?.role === "faculty";

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const data = await classService.getClassDetails(id);
                setClassData(data);
            } catch (error) {
                console.error("Failed to fetch class details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center p-24">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (!classData) {
        return (
            <DashboardLayout>
                <div className="p-12 text-center">
                    <h2 className="text-xl font-bold">Class not found</h2>
                    <Link to="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/classes"><Button variant="outline" className="h-10 w-10 p-0 rounded-full"><ArrowLeft size={18} /></Button></Link>
                        <div>
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-widest">
                                <span>Classes</span><ChevronRight size={10} /><span>{classData.class_code}</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">{classData.class_name}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-xs px-3 h-9"><Users size={16} /> {classData.students?.length || 0} Students</Button>
                        {isFaculty && <Button className="text-xs px-3 h-9"><Settings size={16} /> Manage</Button>}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-lg">Announcements</CardTitle>
                                <Button variant="outline" className="text-xs h-8 px-3"><Plus size={14} /> New</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="p-5 border border-border rounded-lg bg-muted/30">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-foreground text-background rounded-md shadow-sm"><Zap size={18} /></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm">Midterm Preparation Required</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">2h ago</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Please review all materials in the Archive section under "Graph Theory".
                                                The midterm will take place in Section B hall next week.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Class Details</h3>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Class Code</span><span className="font-mono">{classData.class_code}</span></div>
                                <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Instructor ID</span><span className="font-mono text-[10px]">{classData.faculty_id?._id || classData.faculty_id}</span></div>
                                <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Status</span><span className="text-green-600 font-bold uppercase tracking-tighter">Active</span></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
