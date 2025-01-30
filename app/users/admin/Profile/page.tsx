'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    avatar: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        setProfile({
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'Administrator',
            phoneNumber: '+1234567890',
            avatar: '/default-avatar.png'
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setProfile({ ...profile, ...formData } as UserProfile);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="backdrop-blur-sm bg-white/80 rounded-lg shadow-2xl p-8 border border-red-100/50">
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="flex items-center gap-8 mb-12">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg flex items-center justify-center">
                                <span className="text-4xl text-white font-semibold">{profile.name[0]}</span>
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={profile.name}
                                        onChange={handleChange}
                                        className="text-4xl font-bold text-gray-900 mb-2 w-full bg-transparent border-b-2 border-red-300 focus:border-red-500 outline-none"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                                )}
                                <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                                    {profile.role}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-md bg-white shadow-sm border border-red-100">
                                <p className="text-sm text-red-600 font-medium mb-2">Email Address</p>
                                <p className="text-gray-800">{profile.email}</p>
                            </div>
                            <div className="p-6 rounded-md bg-white shadow-sm border border-red-100">
                                <p className="text-sm text-red-600 font-medium mb-2">Role</p>
                                <p className="text-gray-800">{profile.role}</p>
                            </div>
                            <div className="p-6 rounded-md bg-white shadow-sm border border-red-100">
                                <p className="text-sm text-red-600 font-medium mb-2">Phone Number</p>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        defaultValue={profile.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b-2 border-red-300 focus:border-red-500 outline-none text-gray-800 py-1"
                                    />
                                ) : (
                                    <p className="text-gray-800">{profile.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-12">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-md hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setFormData(profile);
                                        setIsEditing(true);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-md hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
