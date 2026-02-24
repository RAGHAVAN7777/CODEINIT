import { motion } from 'framer-motion';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="flex justify-between items-center p-6 border-b border-border bg-background">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center text-background">E</div>
                    EduVault
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground mr-2"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <Link to="/login"><Button variant="ghost">Login</Button></Link>
                    <Link to="/signup"><Button>Get Started</Button></Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto pt-32 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl font-bold tracking-tight mb-6">
                        Academic collaboration, <br />
                        <span className="text-muted-foreground">structured and simplified.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-normal">
                        Ditch the messy WhatsApp groups. A professional space for faculty to share notes and students to excel.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup">
                            <Button className="px-10 py-6 text-lg tracking-tight shadow-lg shadow-primary/5 hover:shadow-xl transition-all">
                                Get Started <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* High-Fidelity Dashboard Preview Mockup */}
                <motion.div
                    className="mt-20 border border-border rounded-xl shadow-2xl overflow-hidden bg-muted/50 p-2 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <div className="rounded-lg border border-border bg-background h-[400px] w-full overflow-hidden flex flex-col">
                        {/* Mock Navbar */}
                        <div className="h-12 border-b border-border bg-card flex items-center justify-between px-6">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                            <div className="w-32 h-4 bg-muted rounded-full" />
                        </div>

                        {/* Mock Content */}
                        <div className="flex-1 p-6 space-y-6 overflow-hidden">
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="w-48 h-6 bg-foreground/10 rounded-md" />
                                    <div className="w-32 h-3 bg-muted rounded-md" />
                                </div>
                                <div className="w-24 h-8 bg-foreground rounded-md" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-4 border border-border rounded-lg bg-card space-y-3">
                                        <div className="w-8 h-8 bg-muted rounded-md" />
                                        <div className="w-full h-4 bg-foreground/5 rounded-md" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="p-5 border border-border rounded-xl bg-card flex gap-4">
                                        <div className="w-12 h-12 bg-muted rounded-lg shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="w-3/4 h-4 bg-foreground/10 rounded-md" />
                                            <div className="w-1/2 h-3 bg-muted rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
