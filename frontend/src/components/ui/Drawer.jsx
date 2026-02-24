import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

export const Drawer = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-2xl bg-card border-l border-border shadow-2xl h-screen flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 bg-muted/20 border-b border-border">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase">{title}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Editor System</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                                    <Maximize2 size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 bg-muted/50 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-muted-foreground border border-transparent hover:border-red-500/20"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {children}
                        </div>

                        {/* Footer decoration */}
                        <div className="p-4 bg-muted/5 flex items-center justify-between border-t border-border">
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">EduVault Pro-Editor v4.0</span>
                            <div className="flex gap-1">
                                <div className="w-8 h-1 bg-border rounded-full" />
                                <div className="w-4 h-1 bg-primary rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
