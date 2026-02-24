import React, { useState, useEffect } from "react";
import { Search, Filter, Mail, MoreHorizontal, UserCheck, UserX, ExternalLink, UserPlus } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { userService } from "../services/user.service";
import { classService } from "../services/class.service";
import { Modal } from "../components/ui/Modal";
import { Alert } from "../components/ui/Alert";
import { AnimatePresence } from "framer-motion";

export default function StudentListing() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [myClasses, setMyClasses] = useState([]);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [enrollingClassId, setEnrollingClassId] = useState("");
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [studentsData, classesData] = await Promise.all([
                userService.getAllStudents(),
                classService.getMyClasses()
            ]);
            setStudents(studentsData);
            setMyClasses(classesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                                                <div className="flex justify-center mb-4">
                                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                </div>
                                                Fetching Academic Records...
                                            </td>
                                        </tr>
                                    ) : students.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest">No Students Found</td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student._id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-bold font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded tracking-tighter">STUDENT_{student._id.slice(-4)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                                        <p className="text-[10px] text-muted-foreground lowercase tracking-tight">{student.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium text-foreground">{student.classes?.length || 0} Sections Enrolled</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-muted-foreground">Recent</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <UserCheck size={14} className="text-green-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter text-green-600">
                                                            Verified
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 text-[#333]">
                                                        <Button
                                                            variant="outline"
                                                            className="h-8 px-3 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/10 text-primary"
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setIsEnrollModalOpen(true);
                                                            }}
                                                        >
                                                            <UserPlus size={14} className="mr-1.5" /> Add to Class
                                                        </Button>
                                                        <Button variant="ghost" className="h-8 w-8 p-0" title="View Profile">
                                                            <ExternalLink size={14} />
                                                        </Button>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold uppercase tracking-widest px-2">
                    <span>Showing {students.length} of {students.length} students</span>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-8 px-3 text-[10px]" disabled>Prev</Button>
                        <Button variant="outline" className="h-8 px-3 text-[10px]" disabled>Next</Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isEnrollModalOpen}
                onClose={() => setIsEnrollModalOpen(false)}
                title={`Enroll ${selectedStudent?.name}`}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-muted/30 border border-border rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                            Select Academic Section
                        </p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {myClasses.length === 0 ? (
                                <p className="text-center py-8 text-xs text-muted-foreground italic">No active classes found. Create a class first.</p>
                            ) : (
                                myClasses.map((cls) => (
                                    <div
                                        key={cls._id}
                                        onClick={() => setEnrollingClassId(cls._id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${enrollingClassId === cls._id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border/50 bg-card hover:border-primary/30'
                                            }`}
                                    >
                                        <div>
                                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{cls.class_name}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground uppercase">{cls.class_code}</p>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${enrollingClassId === cls._id ? 'border-primary bg-primary' : 'border-border'
                                            }`}>
                                            {enrollingClassId === cls._id && <div className="h-2 w-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsEnrollModalOpen(false)}>
                            Abort
                        </Button>
                        <Button
                            disabled={!enrollingClassId || isEnrolling}
                            isLoading={isEnrolling}
                            onClick={async () => {
                                setIsEnrolling(true);
                                try {
                                    await classService.addStudentToClass(enrollingClassId, selectedStudent.email);
                                    setAlert({ message: `${selectedStudent.name} successfully enrolled in ${myClasses.find(c => c._id === enrollingClassId)?.class_name}`, type: "success" });
                                    setIsEnrollModalOpen(false);
                                    setEnrollingClassId("");
                                    fetchData(); // Refresh to show new enrollment counts
                                } catch (error) {
                                    setAlert({ message: error.response?.data?.message || "Enrollment failed", type: "error" });
                                } finally {
                                    setIsEnrolling(false);
                                    setTimeout(() => setAlert(null), 5000);
                                }
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold uppercase tracking-widest text-[10px]"
                        >
                            Execute Enrollment
                        </Button>
                    </div>
                </div>
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
