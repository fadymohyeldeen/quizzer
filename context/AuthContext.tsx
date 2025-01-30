'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: number;
    email: string;
    userName: string;
    role: string;  // Add role to User interface
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null, token: string | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);

    const setUser = (newUser: User | null, newToken: string | null) => {
        if (newUser) {
            // Ensure role is included when setting user
            setUserState({
                id: newUser.id,
                email: newUser.email,
                userName: newUser.userName,
                role: newUser.role
            });
        } else {
            setUserState(null);
        }
        setTokenState(newToken);
    };

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
    };

    const logout = () => {
        setUserState(null);
        setTokenState(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
