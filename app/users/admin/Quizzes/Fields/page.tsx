"use client";
import React, { useEffect, useState } from "react";

type Field = {
    id: string;
    name: string;
    description?: string;
};

type APIResponse = {
    data: Field[];
};
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import toast, { Toaster, Toast } from "react-hot-toast";

function Page() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false); 

    useEffect(() => {
        setIsClient(true); 
    }, []);

    useEffect(() => {
        if (!isClient) return;

        if (!token) {
            router.push("/Login");
            return;
        }

        if (user?.role !== "admin") {
            router.push("/Login");
            return;
        }

        const fetchFields = async () => {
            try {
                setError(null);
                const response = await fetch("http://localhost:5000/fields", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    const errorData = await response.json();
                    setError(errorData.message || "Unauthorized access");
                    router.push("/Login");
                    return;
                }

                if (response.ok) {
                    const responseData: APIResponse = await response.json();
                    setFields(responseData.data as Field[]);
                } else {
                    setError("Failed to fetch fields");
                }
            } catch (error) {
                setError("Failed to fetch fields");
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [isClient, token, router, user?.role]);

    if (!isClient) {
        return null; 
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-red-100">
                    <div className="text-red-500 flex items-center gap-3 mb-4">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="font-medium">Error Occurred</span>
                    </div>
                    <p className="text-zinc-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                }}
            />
        </div>
    );
}

export default Page;