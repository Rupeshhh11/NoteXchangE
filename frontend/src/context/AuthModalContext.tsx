import React, { createContext, useContext, useState, useCallback } from 'react';

export type AuthModalTab = 'login' | 'signup';

interface AuthModalContextValue {
    isOpen: boolean;
    tab: AuthModalTab;
    openAuth: (tab?: AuthModalTab) => void;
    closeAuth: () => void;
    setTab: (tab: AuthModalTab) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<AuthModalTab>('login');

    const openAuth = useCallback((initialTab: AuthModalTab = 'login') => {
        setTab(initialTab);
        setIsOpen(true);
    }, []);

    const closeAuth = useCallback(() => setIsOpen(false), []);

    return (
        <AuthModalContext.Provider value={{ isOpen, tab, openAuth, closeAuth, setTab }}>
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const ctx = useContext(AuthModalContext);
    if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
    return ctx;
}
