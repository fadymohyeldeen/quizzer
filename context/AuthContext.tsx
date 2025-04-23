'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, getCurrentUser } from '../services/authService';

interface User {
    id: number;
    email: string;
    userName: string;  
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null, token: string | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    login: (email: string, password: string) => Promise<User>;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setTokenState] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const userData = await getCurrentUser(savedToken);
                    const transformedUser = {
                        id: userData.id,
                        email: userData.email,
                        userName: userData.user_name,
                        role: userData.role
                    };
                    setUserState(transformedUser);
                } catch (error) {
                    console.error('Error fetching user:', error); 
                    logout();
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    const setUser = (newUser: User | null, newToken: string | null) => {
        if (newUser) {
            setUserState(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            setUserState(null);
            localStorage.removeItem('user');
        }
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
    };

    const logout = () => {
        setUserState(null);
        setTokenState(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user: userData, token: authToken } = await loginUser(email, password);
            const transformedUser = {
                id: userData.id,
                email: userData.email,
                userName: userData.user_name,
                role: userData.role
            };
            setUser(transformedUser, authToken);
            return transformedUser;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            setUser, 
            setToken, 
            logout, 
            login,
            isLoading,
            error 
        }}>
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
