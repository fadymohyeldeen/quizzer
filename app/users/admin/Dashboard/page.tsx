'use client';

import { useAuth } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUsers, FaClipboardList, FaLayerGroup, FaClock, FaBookOpen } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts';
import Loader from '@/app/components/Loader';

export default function Dashboard() {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalQuizzes: 0,
        activeQuizzes: 0,
        completedQuizzes: 0
    });

    const handleLogout = () => {
        logout();
        router.push('/Login');
    };

    const completionData = [
        { quiz: 'Quiz 1', rate: 75 },
        { quiz: 'Quiz 2', rate: 85 },
        { quiz: 'Quiz 3', rate: 65 },
        { quiz: 'Quiz 4', rate: 90 },
    ];

    const activityData = [
        { day: 'Mon', count: 20 },
        { day: 'Tue', count: 30 },
        { day: 'Wed', count: 25 },
        { day: 'Thu', count: 40 },
        { day: 'Fri', count: 35 },
    ];

    useEffect(() => {
        if (!token) {
            router.push('/Login');
            return;
        }

        // Wait for user data to be available
        if (user) {
            setLoading(false);
            if (user.role !== 'admin') {
                router.push('/users/student/Dashboard');
            }
        }
    }, [user, token, router]);

    if (loading || !user) {
        return (
            <Loader />
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <FaUsers className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Fields</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{stats.activeQuizzes}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <FaLayerGroup className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Topics</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{stats.activeQuizzes}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <FaBookOpen className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Quizzes</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{stats.totalQuizzes}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <FaClipboardList className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>



                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Completed</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{stats.completedQuizzes}</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <FaClock className="text-red-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/users/admin/Quizzes/create">
                            <button className="w-full bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow">
                                Create Quiz
                            </button>
                        </Link>
                        <Link href="/users/admin/Quizzes">
                            <button className="w-full bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow">
                                Manage Quizzes
                            </button>
                        </Link>
                        <Link href="/users/admin/users">
                            <button className="w-full bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow">
                                Manage Users
                            </button>
                        </Link>
                    </div>
                    <br />
                    <div className='flex-col flex gap-4'>
                        <Link href="/">
                            <button className="w-full bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow">
                                Home
                            </button>
                        </Link>
                        <Link href="/Login">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow"
                            >
                                Logout
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
                    <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="font-semibold text-gray-800">New Quiz Created</p>
                            <p className="text-sm text-gray-600">Mathematics Quiz - 2 hours ago</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="font-semibold text-gray-800">Quiz Completed</p>
                            <p className="text-sm text-gray-600">Science Quiz - 5 hours ago</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="font-semibold text-gray-800">New User Registered</p>
                            <p className="text-sm text-gray-600">John Doe - 1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Completion Rates</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={completionData}>
                                <XAxis dataKey="quiz" />
                                <YAxis />
                                <Bar dataKey="rate" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">User Activity</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <LineChart data={activityData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Line type="monotone" dataKey="count" stroke="#ef4444" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
