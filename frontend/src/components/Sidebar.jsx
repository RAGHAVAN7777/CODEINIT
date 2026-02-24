import { LayoutDashboard, BookOpen, Settings, LogOut, ChevronLeft, Users, FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const facultyItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Classes', path: '/classes' },
        { icon: Users, label: 'Students', path: '/students' },
        { icon: FilePlus, label: 'Resources', path: '/notes' },
    ];

    const studentItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: BookOpen, label: 'Courses', path: '/classes' },
        { icon: FilePlus, label: 'Resources', path: '/notes' },
    ];

    const menuItems = user?.role === 'faculty' ? facultyItems : studentItems;

    return (
        <motion.aside
            animate={{ width: isOpen ? 260 : 80 }}
            className="h-full border-r border-border bg-card flex flex-col relative z-50 shadow-sm transition-all"
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold">E</div>
                {isOpen && <span className="font-bold tracking-tighter text-lg">EduVault</span>}
            </div>

            <nav className="flex-1 px-3 space-y-1">
                <div className="mb-4 px-3">
                    {isOpen && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user?.role} Navigation</p>}
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <item.icon size={20} />
                            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                    <LogOut size={20} />
                    {isOpen && <span className="text-sm font-medium">Clear Session</span>}
                </button>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-10 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted shadow-sm z-50"
            >
                <ChevronLeft size={14} className={!isOpen ? 'rotate-180' : ''} />
            </button>
        </motion.aside>
    );
};
