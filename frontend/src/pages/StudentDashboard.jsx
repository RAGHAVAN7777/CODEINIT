import React, { useState, useEffect } from "react";
import { Search, GraduationCap, FileText, Download, Play, Trophy, Clock, Plus, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/ui/Modal";
import { classService } from "../services/class.service";
import { noteService } from "../services/note.service";
import { useAuth } from "../context/AuthContext";
import { AnnouncementBox } from "../components/AnnouncementBox";


export default function StudentDashboard() {
    const { user, studyTime } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState("");
    const [recentNotes, setRecentNotes] = useState([]);
    const [notesCount, setNotesCount] = useState(0);

    const formatStudyTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [classesData, notesData] = await Promise.all([
                classService.getMyClasses(),
                noteService.getNotes()
            ]);
            setClasses(classesData);
            setRecentNotes(notesData.slice(0, 5)); // Keep latest 5
            setNotesCount(notesData.length);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinClass = async (e) => {
        e.preventDefault();
        if (!classCode.trim()) return;
        setError("");
        setIsJoining(true);

        try {
            await classService.joinClass(classCode);
            setClassCode("");
            setIsJoinModalOpen(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to join class. Please check the code.");
        } finally {
            setIsJoining(false);
        }
    };

    const getStudentRank = () => {
        if (!classes.length || !user) return "-";

        let bestRank = Infinity;
        classes.forEach(cls => {
            const myGrade = cls.grades?.find(g => (g.student_id === user._id || g.student_id?._id === user._id));
            if (myGrade && myGrade.rank > 0 && myGrade.rank < bestRank) {
                bestRank = myGrade.rank;
            }
        });

        return bestRank === Infinity ? "-" : `#${bestRank}`;
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Student Hub</h1>
                        <p className="text-muted-foreground text-sm">Welcome back, {user?.name || "Student"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64 text-[#333]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search notes..." className="pl-9 h-9" />
                        </div>
                        <Button className="h-9" onClick={() => setIsJoinModalOpen(true)}>
                            <Plus size={18} /> Join Class
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Joined Classes", value: classes.length, icon: GraduationCap, color: "text-blue-500" },
                        { label: "Shared Notes", value: notesCount.toString(), icon: FileText, color: "text-amber-500" },
                        { label: "Study Time", value: formatStudyTime(studyTime), icon: Clock, color: "text-emerald-500" },
                        { label: "Rank", value: getStudentRank(), icon: Trophy, color: "text-purple-500" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-5 border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2.5 bg-muted rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</span>
                            </div>
                            <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-lg">My Classes</CardTitle>
                            <Button variant="ghost" className="text-xs" onClick={() => fetchData()}>Refresh</Button>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : classes.length === 0 ? (
                                <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-muted/20">
                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">No Active Enrollments Located</p>
                                    <Button variant="outline" size="sm" className="mt-4 px-6 h-9 font-black uppercase tracking-widest text-[9px]" onClick={() => setIsJoinModalOpen(true)}>
                                        <Plus size={14} /> Initiate Joining
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {classes.map((cls) => {
                                        const myGrade = cls.grades?.find(g => (g.student_id === user._id || g.student_id?._id === user._id));
                                        return (
                                            <motion.div
                                                key={cls._id}
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                onClick={() => navigate(`/classes/${cls._id}`)}
                                                className="p-5 border border-border/50 rounded-2xl bg-card hover:border-primary/30 transition-all cursor-pointer group shadow-sm relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <BookOpen size={40} />
                                                </div>

                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="px-2.5 py-1 bg-muted border border-border/50 rounded-lg text-[9px] font-black uppercase tracking-widest text-foreground/70">
                                                        {cls.class_code}
                                                    </div>
                                                    {myGrade?.rank > 0 && (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-full border border-purple-500/20">
                                                            <Trophy size={10} />
                                                            <span className="text-[9px] font-black uppercase">Rank #{myGrade.rank}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="font-black text-lg mb-4 group-hover:text-primary transition-colors leading-tight">
                                                    {cls.class_name}
                                                </h3>

                                                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Performance</p>
                                                        <p className="text-sm font-black text-foreground">{myGrade?.average?.toFixed(1) || "0.0"}%</p>
                                                    </div>
                                                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-background transition-all">
                                                        <Plus size={14} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-1 space-y-8">
                        <AnnouncementBox hideAdd={true} />

                        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary/60">Recent Research Fragments</CardTitle>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10" onClick={() => navigate('/notes')}><Plus size={14} /></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {isLoading ? (
                                    <div className="h-10 w-full animate-pulse bg-muted rounded-lg" />
                                ) : recentNotes.length === 0 ? (
                                    <p className="text-[10px] text-center py-4 text-muted-foreground uppercase font-bold">No fragments located</p>
                                ) : (
                                    recentNotes.map((note) => (
                                        <div
                                            key={note._id}
                                            onClick={() => navigate('/notes')}
                                            className="group flex items-center justify-between p-3 rounded-xl border border-border/30 bg-card/50 hover:border-primary/20 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                    <FileText size={14} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[11px] font-bold text-foreground truncate max-w-[120px]">{note.title}</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">
                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                title="Join a Class"
            >
                <form onSubmit={handleJoinClass} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Enter the 6-digit class code provided by your instructor to join the class.
                    </p>
                    <Input
                        label="Class Code"
                        placeholder="e.g. A1B2C3"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        required
                        error={error}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" type="button" onClick={() => setIsJoinModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isJoining}>
                            Join Class
                        </Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
