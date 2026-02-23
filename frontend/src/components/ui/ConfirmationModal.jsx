import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger", // 'danger' or 'info'
    isLoading = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                        }`}>
                        {variant === 'danger' ? <AlertTriangle size={24} /> : <Info size={24} />}
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white border-none' : ''}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
