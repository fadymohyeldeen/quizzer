'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    user: {
      userName: ReactNode; id: number; email: string 
} | null;
    token: string | null;
    setUser: (user: { id: number; email: string, userName:string }, token: string) => void;
    setToken: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ id: number; email: string, userName:string } | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();

    // Check if user data is stored in localStorage when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));  // Set the user data from localStorage
            setToken(storedToken);           // Set the token from localStorage
        }
    }, []);

    // Function to handle login and store user data and token in localStorage
    const handleLogin = (userData: { id: number; email: string; userName: string }, userToken: string) => {
        setUser(userData);          // Set user data in state
        setToken(userToken);        // Set token in state
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
        localStorage.setItem('token', userToken); // Store token in localStorage
    };

    // Logout function to clear context and localStorage
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push("/");
        
    };

    return (
        <AuthContext.Provider value={{ user, token, setUser: handleLogin, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
