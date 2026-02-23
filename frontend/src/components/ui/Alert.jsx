import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Alert = ({ message, type = 'info', onClose }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" size={18} />,
        error: <AlertCircle className="text-red-500" size={18} />,
        info: <Info className="text-primary" size={18} />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4"
        >
            <div className="flex items-center gap-3">
                {icons[type]}
                <p className="text-xs font-bold uppercase tracking-tight text-foreground">{message}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <X size={16} />
            </button>
        </motion.div>
    );
};
