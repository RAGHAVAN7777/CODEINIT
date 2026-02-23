import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, FileText, Settings, Plus, ChevronRight, Zap, Trash2 } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { classService } from "../services/class.service";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/ui/Modal";
import { AnnouncementBox } from "../components/AnnouncementBox";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";
import { Alert } from "../components/ui/Alert";
import { AnimatePresence } from "framer-motion";

export default function ClassView() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isRosterOpen, setIsRosterOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [gradeScore, setGradeScore] = useState("");
    const [isGrading, setIsGrading] = useState(false);
    const [alert, setAlert] = useState(null);
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

    const handleDeleteClass = async () => {
        setIsConfirmOpen(false);
        setIsDeleting(true);
        try {
            await classService.deleteClass(id);
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to delete class:", error);
            setAlert({ message: "Failed to dissolve class. Please try again.", type: "error" });
            setTimeout(() => setAlert(null), 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleGradeStudent = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !gradeScore) return;

        setIsGrading(true);
        try {
            await classService.gradeStudent(id, selectedStudent._id, parseFloat(gradeScore));
            setAlert({ message: `Grade recorded for ${selectedStudent.name}`, type: "success" });
            setGradeScore("");
            setIsGradeModalOpen(false);
            // Refresh class data to show new ranks
            const data = await classService.getClassDetails(id);
            setClassData(data);
        } catch (error) {
            console.error("Failed to grade student:", error);
            setAlert({ message: "Failed to record grade", type: "error" });
        } finally {
            setIsGrading(false);
            setTimeout(() => setAlert(null), 3000);
        }
    };

    const getStudentStats = (studentId) => {
        const gradeInfo = classData.grades?.find(g => g.student_id === studentId || g.student_id?._id === studentId);
        return gradeInfo || { average: 0, rank: 0 };
    };

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
                                <span>Classes</span><ChevronRight size={10} />
                                <span className="bg-muted px-2 py-0.5 rounded-sm text-foreground border border-border/40 font-mono">
                                    {classData.class_code}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">{classData.class_name}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="text-xs px-3 h-9"
                            onClick={() => setIsRosterOpen(true)}
                        >
                            <Users size={16} /> {classData.students?.length || 0} Students
                        </Button>
                        {isFaculty && (
                            <>
                                <Button
                                    className="text-xs px-3 h-9"
                                    onClick={() => setAlert({ message: "Class Management Console Online", type: "info" })}
                                >
                                    <Settings size={16} /> Manage
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-xs px-3 h-9 text-red-500 hover:bg-red-500 hover:text-white border-red-500/30"
                                    onClick={() => setIsConfirmOpen(true)}
                                    isLoading={isDeleting}
                                >
                                    <Trash2 size={16} /> Delete
                                </Button>
                            </>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <AnnouncementBox classId={id} />
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Class Details</h3>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="flex justify-between items-center text-xs font-medium">
                                    <span className="text-muted-foreground">Class Code</span>
                                    <span className="font-mono bg-muted px-2 py-1 rounded text-foreground border border-border/50">
                                        {classData.class_code}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Instructor ID</span><span className="font-mono text-[10px]">{classData.faculty_id?._id || classData.faculty_id}</span></div>
                                <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Status</span><span className="text-green-600 font-bold uppercase tracking-tighter">Active</span></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteClass}
                title="Dissolve Class?"
                message="Are you certain? This will permanently dissolve this class and remove it from all students' records. This action cannot be undone."
                confirmText="Dissolve Class"
                cancelText="Abort"
                isLoading={isDeleting}
            />

            {/* Student Roster & Ranking Modal */}
            <Modal
                isOpen={isRosterOpen}
                onClose={() => setIsRosterOpen(false)}
                title="Class Roster & Performance"
            >
                <div className="space-y-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-4">
                        Live Strategic Ranking System
                    </p>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {classData.students?.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground text-sm italic">No students active in this sector.</p>
                        ) : (
                            classData.students.map((student) => {
                                const stats = getStudentStats(student._id);
                                return (
                                    <div key={student._id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                {stats.rank > 0 ? `#${stats.rank}` : "—"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{student.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono">{student.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] text-muted-foreground uppercase font-black">Average</p>
                                                <p className="text-xs font-bold text-primary">{stats.average?.toFixed(1) || "0.0"}%</p>
                                            </div>
                                            {isFaculty && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-[10px] font-black uppercase tracking-widest"
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setIsGradeModalOpen(true);
                                                    }}
                                                >
                                                    <Zap size={12} className="text-yellow-500 mr-1" /> Add Rank
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Modal>

            {/* Grade Input Modal */}
            <Modal
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                title={`Grade: ${selectedStudent?.name}`}
            >
                <form onSubmit={handleGradeStudent} className="space-y-4">
                    <div className="p-4 bg-muted/30 border border-border rounded-xl">
                        <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground block mb-4">
                            Assessment Score (0-100)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={gradeScore}
                                onChange={(e) => setGradeScore(e.target.value)}
                                className="w-full bg-background border-2 border-border rounded-lg p-4 text-2xl font-black text-center focus:outline-none focus:border-primary transition-colors focus:ring-4 focus:ring-primary/10"
                                placeholder="0.0"
                                required
                                autoFocus
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">%</div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setIsGradeModalOpen(false)}
                        >
                            Abort
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isGrading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                        >
                            Execute Calibration
                        </Button>
                    </div>
                </form>
            </Modal>

            <AnimatePresence>
                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
