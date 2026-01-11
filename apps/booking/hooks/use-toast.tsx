// Toast notification hook
// File: apps/booking/hooks/use-toast.tsx

'use client';

import React, { useState, useCallback } from 'react';

interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
    duration?: number;
}

interface ToastContextType {
    toast: (props: Omit<Toast, 'id'>) => void;
    toasts: Toast[];
    dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        // Return a no-op toast function if context is not available
        return {
            toast: () => { },
            toasts: [],
            dismiss: () => { },
        };
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((props: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = {
            id,
            duration: 5000,
            ...props,
        };
        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss after duration
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, newToast.duration);
        }
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, toasts, dismiss }}>
            {children}
            {/* Toast Portal */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
                            px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md
                            ${t.variant === 'destructive'
                                ? 'bg-red-500 text-white'
                                : t.variant === 'success'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-800 text-white'
                            }
                        `}
                    >
                        {t.title && <div className="font-medium">{t.title}</div>}
                        {t.description && (
                            <div className="text-sm opacity-90">{t.description}</div>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
