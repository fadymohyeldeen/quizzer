"use client";
import React from 'react';

interface WelcomeUserProps {
    userName: string;
    role: string;
    profilePicture?: string;
}

const WelcomeUser: React.FC<WelcomeUserProps> = ({ userName, role, profilePicture }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="lg:w-full sm:w-4/5 mx-auto mt-2">
            <div className="flex bg-white flex-col rounded-xl p-2 sm:flex-row items-center"
                style={{
                    backgroundImage: "url(/assets/coursesBG.svg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                {/* Profile Picture */}
                <img
                    src={profilePicture || "/assets/default-avatar.png"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                />

                {/* User Info */}
                <div className="sm:ml-2 mt-1 sm:mt-0 text-center sm:text-left p-1">
                    <h1 className="text-lg font-bold text-gray-800">
                        Welcome back, <span className="text-red-600">{userName}!</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{role}</p>
                    {/* <p className="text-xs text-gray-400 mt-1">{currentDate}</p> */}
                </div>
            </div>
        </div>
    );
};

export default WelcomeUser;
