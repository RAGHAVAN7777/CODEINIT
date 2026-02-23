import { Plus, Users, Book, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../layouts/DashboardLayout';

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
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Welcome back, Prof. Anderson</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline"><Plus size={18} /> New Class</Button>
                        <Button><FileText size={18} /> Upload Note</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={Book} label="Active Classes" value="8" />
                    <StatCard icon={Users} label="Total Students" value="442" />
                    <StatCard icon={FileText} label="Shared Notes" value="128" />
                </div>

                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Classes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className="p-5 border border-border rounded-lg bg-card cursor-pointer hover:border-foreground/20 transition-all shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-foreground text-background rounded-md text-xs font-bold uppercase tracking-tighter">CS10{i}</div>
                                    <span className="text-xs text-muted-foreground">42 Students</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-1">Advanced Algorithms</h3>
                                <p className="text-sm text-muted-foreground mb-4">Section B • Computer Science</p>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(u => (
                                        <div key={u} className="w-7 h-7 rounded-full border-2 border-background bg-muted" />
                                    ))}
                                    <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]">+38</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
