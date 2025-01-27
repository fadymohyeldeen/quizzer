'use client'
import { useEffect, useState } from 'react';
import Login from "../app/components/Login";
import dynamic from 'next/dynamic';

const Loader = dynamic(() => import('../app/components/Loader'), {
    ssr: false,
});

interface User {
    id: string;
    name: string;
    email: string;
    // Add other properties as needed
}

export default function Page() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // useEffect(() => {
    //     async function fetchUsers() {
    //         try {
    //             const usersRes = await fetch("https://67608e416be7889dc35e4f1e.mockapi.io/users");
    //             const usersData: User[] = await usersRes.json();
    //             setUsers(usersData);
    //         } catch (error) {
    //             console.error('Failed to fetch users:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    //     fetchUsers();
    // }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <Login />
        </div>
    );
}
