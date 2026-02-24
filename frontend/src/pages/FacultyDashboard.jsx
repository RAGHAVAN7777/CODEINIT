import React, { useState, useEffect } from 'react';
import { Plus, Users, Book, FileText, MessageSquare, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { classService } from '../services/class.service';
import { announcementService } from '../services/announcement.service';
import { noteService } from '../services/note.service';
import { useAuth } from '../context/AuthContext';
import { AnnouncementBox } from '../components/AnnouncementBox';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BookOpen } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card className="p-5 border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 bg-muted rounded-xl ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div className="text-3xl font-black tracking-tighter">{value}</div>
    </Card>
);

export default function FacultyDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
    const [annTitle, setAnnTitle] = useState("");
    const [annContent, setAnnContent] = useState("");
    const [isAnnouncing, setIsAnnouncing] = useState(false);
    const [notesCount, setNotesCount] = useState(0);

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

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (!annTitle.trim() || !annContent.trim()) return;

        setIsAnnouncing(true);
        try {
            await announcementService.createAnnouncement({
                title: annTitle,
                content: annContent,
                type: 'general'
            });
            setAnnTitle("");
            setAnnContent("");
            setIsAnnounceModalOpen(false);
            // Optional: refresh any announcement streams on the page
        } catch (error) {
            console.error("Failed to post announcement:", error);
        } finally {
            setIsAnnouncing(false);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        setIsCreating(true);
        try {
            await classService.createClass(newClassName);
            setNewClassName("");
            setIsModalOpen(false);
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Failed to create class:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Welcome back, {user?.name || "Professor"}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> New Class
                        </Button>
                        <Button><FileText size={18} /> Upload Note</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={Book} label="Active Classes" value={classes.length} color="text-blue-500" />
                    <StatCard icon={Users} label="Total Students" value={classes.reduce((acc, c) => acc + (c.students?.length || 0), 0)} color="text-purple-500" />
                    <StatCard icon={FileText} label="Shared Notes" value={notesCount} color="text-amber-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-semibold mb-4 text-foreground">My Classes</h2>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : classes.length === 0 ? (
                                <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-muted/20">
                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">No Active Sections Managed</p>
                                    <Button variant="outline" className="mt-4 px-6 h-9 font-black uppercase tracking-widest text-[9px]" onClick={() => setIsModalOpen(true)}>
                                        <Plus size={14} /> Establish Section
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {classes.map((cls) => (
                                        <motion.div
                                            key={cls._id}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            onClick={() => navigate(`/classes/${cls._id}`)}
                                            className="p-5 border border-border/50 rounded-2xl bg-card hover:border-primary/30 transition-all cursor-pointer group shadow-sm relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                                <BookOpen size={120} className="-rotate-12" />
                                            </div>

                                            <div className="flex justify-between items-start mb-6">
                                                <div className="px-2.5 py-1 bg-muted border border-border/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-foreground/70">
                                                    {cls.class_code}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                                                    <Users size={10} />
                                                    <span className="text-[9px] font-black uppercase">{cls.students?.length || 0} Enrolled</span>
                                                </div>
                                            </div>

                                            <h3 className="font-black text-lg mb-4 group-hover:text-primary transition-colors leading-tight">
                                                {cls.class_name}
                                            </h3>

                                            <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                                <div className="space-y-0.5">
                                                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Access Key</p>
                                                    <p className="text-sm font-mono font-black text-foreground">{cls.class_code}</p>
                                                </div>
                                                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-background transition-all">
                                                    <Plus size={14} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold mb-4 text-foreground">Activity Stream</h2>
                        <AnnouncementBox hideAdd={true} />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Class"
            >
                <form onSubmit={handleCreateClass} className="space-y-4">
                    <Input
                        label="Class Name"
                        placeholder="e.g. Advanced Algorithms"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        required
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isCreating}>
                            Create Class
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Floating Announcement Button */}
            <button
                onClick={() => setIsAnnounceModalOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-foreground text-background rounded-full shadow-[0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-background"
                title="Broadcast Announcement"
            >
                <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
                >
                    <Bell size={28} />
                </motion.div>
                <span className="absolute right-full mr-4 px-3 py-1 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-border/50">
                    Transmit Global Signal
                </span>
            </button>

            {/* Announcement Modal */}
            <Modal
                isOpen={isAnnounceModalOpen}
                onClose={() => setIsAnnounceModalOpen(false)}
                title="Broadcast Transmission"
            >
                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-4">
                        Broadcasting to all students & colleagues
                    </p>
                    <Input
                        label="Transmission Title"
                        placeholder="e.g. Schedule Modification"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Message Content
                        </label>
                        <textarea
                            value={annContent}
                            onChange={(e) => setAnnContent(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px] resize-none font-medium"
                            placeholder="Enter the full transmission details here..."
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" type="button" onClick={() => setIsAnnounceModalOpen(false)}>
                            Abort
                        </Button>
                        <Button type="submit" isLoading={isAnnouncing} className="px-8">
                            Execute Broadcast
                        </Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
