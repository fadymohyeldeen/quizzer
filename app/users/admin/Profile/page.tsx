'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
    id: number;
    userName: string; 
    email: string;
    role: string;
    phoneNumber: string;
    avatar: string;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Current user:', user?.userName); // Debug log
        if (user) {
            setProfile({
                id: user.id,
                userName: user.userName,
                email: user.email || '',
                role: user.role || '',
                phoneNumber: '+1234567890',
                avatar: '/default-avatar.png'
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            // Add your API call here to update the profile
            setProfile({ ...profile, ...formData } as UserProfile);
            setIsEditing(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add loading state check
    if (!user) return <div>Loading user data...</div>;
    if (!profile) return <div>Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="backdrop-blur-sm bg-white/80 rounded-lg shadow-2xl p-8 border border-red-100/50">
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="flex items-center gap-8 mb-12">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg flex items-center justify-center">
                                <span className="text-6xl text-white font-semibold">{profile.userName[0].toUpperCase()}</span>
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="userName"  
                                        defaultValue={profile.userName} 
                                        onChange={handleChange}
                                        className="text-4xl font-bold text-gray-900 mb-2 w-full bg-transparent border-b-2 border-red-300 focus:border-red-500 outline-none"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.userName}</h1> 
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
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setError(null);
                                        }}
                                        className="px-6 py-3 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-md hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setFormData(profile);
                                        setIsEditing(true);
                                        setError(null);
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
