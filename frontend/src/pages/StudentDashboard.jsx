import React, { useState, useEffect } from "react";
import { Search, GraduationCap, FileText, Download, Play, Trophy, Clock, Plus } from "lucide-react";
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

// ... NoteCard ...

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
    const { user, studyTime } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState("");
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
                        { label: "Joined Classes", value: classes.length, icon: GraduationCap },
                        { label: "Shared Notes", value: notesCount.toString(), icon: FileText },
                        { label: "Study Time", value: formatStudyTime(studyTime), icon: Clock },
                        { label: "Rank", value: getStudentRank(), icon: Trophy },
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
                            <CardTitle className="text-lg">My Classes</CardTitle>
                            <Button variant="ghost" className="text-xs" onClick={() => fetchData()}>Refresh</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : classes.length === 0 ? (
                                <div className="p-8 border border-dashed border-border rounded-lg text-center">
                                    <p className="text-muted-foreground text-sm">You haven't joined any classes yet.</p>
                                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsJoinModalOpen(true)}>
                                        <GraduationCap size={14} /> Join Now
                                    </Button>
                                </div>
                            ) : (
                                classes.map((cls) => {
                                    const myGrade = cls.grades?.find(g => (g.student_id === user._id || g.student_id?._id === user._id));
                                    return (
                                        <div
                                            key={cls._id}
                                            onClick={() => navigate(`/classes/${cls._id}`)}
                                            className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold">
                                                    {myGrade?.rank > 0 ? `#${myGrade.rank}` : cls.class_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{cls.class_name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-black">ID:</span>
                                                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-mono font-bold border border-border/30">
                                                            {cls.class_code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {myGrade && (
                                                    <div className="text-right mr-4">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">Performance</p>
                                                        <p className="text-xs font-bold text-primary">{myGrade.average?.toFixed(1) || "0.0"}%</p>
                                                    </div>
                                                )}
                                                <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Open
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>

                    <AnnouncementBox />
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
