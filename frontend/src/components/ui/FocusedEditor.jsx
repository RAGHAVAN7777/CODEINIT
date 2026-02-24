import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Save, FileText } from 'lucide-react';

export const FocusedEditor = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Immersive Blurred Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/40 backdrop-blur-2xl"
                    />

                    {/* Centered Focus Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.98 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="relative w-full max-w-5xl h-[92vh] bg-card border border-border shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden m-4"
                    >
                        {/* Minimalist Top Control Bar */}
                        <div className="flex items-center justify-between px-10 py-6 border-b border-border bg-muted/10">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter text-foreground uppercase">{title}</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">High-Focus Mode</span>
                                        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex items-center gap-2 mr-4 px-4 py-2 bg-muted/20 rounded-full border border-border/50">
                                    <Save size={14} className="text-primary" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Cloud Sync Active</span>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-3 bg-muted/50 hover:bg-foreground hover:text-background rounded-xl transition-all text-muted-foreground border border-transparent"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Immersive Writing Environment */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-card/50">
                            <div className="max-w-3xl mx-auto py-12 px-6 h-full">
                                {children}
                            </div>
                        </div>

                        {/* Aesthetic Meta Bar */}
                        <div className="px-10 py-4 bg-muted/5 flex items-center justify-between border-t border-border">
                            <div className="flex gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Module</span>
                                    <span className="text-[10px] font-bold text-primary italic">EduVault_Notes_Terminal</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Status</span>
                                    <span className="text-[10px] font-bold text-green-500">Awaiting_Input...</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                                <div className="h-1.5 w-12 bg-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="w-full h-full bg-primary/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
