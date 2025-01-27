"use client";
import { useAuth } from '../../../../context/AuthContext';
import WelcomeUser from '../../Welcome';
import dynamic from 'next/dynamic';

interface User {
    firstName: string;
    lastName: string;
    role: string;
    profilePicture: string;
} 

const Loader = dynamic(() => import('../../Loader'), {
    ssr: false, // Ensures the loader is only rendered on the client
});

const Dashboard: React.FC = () => {
    const user: User | null = useAuth().user;

    if (!user) {
        return <Loader />;
    }

    return (
        <div
            className={"xl:ml-64 lg:ml-52"}
            style={{ flex: 1, padding: '20px' }}
        >
            <div className='flex flex-col pl-10 pr-10'>
                <WelcomeUser
                    userName={`${user.firstName} ${user.lastName}`}
                    role={user.role}
                    profilePicture={user.profilePicture}
                />
                <div className='xl:flex xl:flex-row gap-5'>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
