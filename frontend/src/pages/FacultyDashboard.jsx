import React, { useState, useEffect } from 'react';
import { Plus, Users, Book, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { classService } from '../services/class.service';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="p-6 border border-border rounded-lg bg-card">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-muted rounded-md"><Icon size={20} className="text-muted-foreground" /></div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

export default function FacultyDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

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

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        setIsCreating(true);
        try {
            await classService.createClass(newClassName);
            setNewClassName("");
            setIsModalOpen(false);
            fetchClasses(); // Refresh list
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
                    <StatCard icon={Book} label="Active Classes" value={classes.length} />
                    <StatCard icon={Users} label="Total Students" value={classes.reduce((acc, c) => acc + (c.students?.length || 0), 0)} />
                    <StatCard icon={FileText} label="Shared Notes" value="0" />
                </div>

                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">My Classes</h2>
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="p-12 border border-dashed border-border rounded-lg text-center">
                            <p className="text-muted-foreground">No classes created yet. Start by creating your first class!</p>
                            <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
                                <Plus size={16} /> Create Class
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classes.map((cls) => (
                                <motion.div
                                    key={cls._id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => navigate(`/classes/${cls._id}`)}
                                    className="p-5 border border-border rounded-lg bg-card cursor-pointer hover:border-foreground/20 transition-all shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-foreground text-background rounded-md text-xs font-bold uppercase tracking-tighter">
                                            {cls.class_code}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{cls.students?.length || 0} Students</span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{cls.class_name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">6-Digit Code: <span className="font-mono font-bold text-foreground">{cls.class_code}</span></p>
                                    <div className="flex -space-x-2">
                                        {/* Placeholder for student avatars */}
                                        <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]">
                                            <Users size={12} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
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
        </DashboardLayout>
    );
}
