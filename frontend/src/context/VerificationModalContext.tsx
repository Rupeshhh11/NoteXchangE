import React, { createContext, useContext, useState, useCallback } from 'react';

interface VerificationModalContextValue {
    isOpen: boolean;
    openVerification: () => void;
    closeVerification: () => void;
}

const VerificationModalContext = createContext<VerificationModalContextValue | null>(null);

export function VerificationModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openVerification = useCallback(() => setIsOpen(true), []);
    const closeVerification = useCallback(() => setIsOpen(false), []);

    return (
        <VerificationModalContext.Provider value={{ isOpen, openVerification, closeVerification }}>
            {children}
        </VerificationModalContext.Provider>
    );
}

export function useVerificationModal() {
    const ctx = useContext(VerificationModalContext);
    if (!ctx) throw new Error('useVerificationModal must be used within VerificationModalProvider');
    return ctx;
}
