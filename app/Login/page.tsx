"use client";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import React, { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { useAuth } from '../../context/AuthContext';

type LoginResponse = {
    statusCode: number;
    message: string;
    data: {
        access_token: string;
        user: {
            id: number;
            email: string;
            password: string;
            role: string;
            user_name: string;
            token: string;
            createdAt: string;
            updatedAt: string;
            deletedAt: string | null;
        };
    };
};

export default function Login() {
    const { setUser, setToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const mockAccessToken = "mock_access_token";
            const mockUser = {
                id: 1,
                email: email,
                userName: "MockUser",
                role: "admin", 
            };
    
            console.log("Token:", mockAccessToken);
            localStorage.setItem('token', mockAccessToken);
            document.cookie = `token=${mockAccessToken}; path=/; max-age=86400; secure; samesite=strict`;
    
            setToken(mockAccessToken);
            setUser(mockUser, mockAccessToken);
    
            toast.success("Login successful!");
            router.push("/users/admin/Dashboard");
        } 
        catch (error) {
            toast.error("An error occurred during login. Please try again.");
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email.length > 0 && password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [email, password]);

    return (
        <>
            <Toaster
                toastOptions={{
                    duration: 5000,
                    style: {
                        animation: "slideIn 0.5s, fadeOut 1s",
                        background: "#444",
                        color: "#fff",
                    },
                }}
            />
            <div className="px-6">
                <section>
                    <div className="mx-auto w-full max-w-3xl  py-16 md:py-20 ">
                        <div className="mx-auto max-w-xl rounded-md bg-gray-100 py-12 text-center px-4">
                            <h2 className="text-3xl mx-auto text-center font-bold max-w-sm md:text-5xl">
                                Welcome back to <span className="text-red-600">Quizzer</span>.
                            </h2>
                            <p className="mx-auto my-5 max-w-md text-sm text-gray-500 sm:text-base lg:mb-8">
                                Log in to continue learning and sharing knowledge with the
                                Quizard community.
                            </p>
                            <div className="mx-auto w-full max-w-sm">
                                <div className="mb-14 mt-14 flex w-full justify-around">
                                    <Image
                                        src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a948ef4e6cf94_Line%203.svg"
                                        alt=""
                                        className="inline-block"
                                        width={100}
                                        height={100}
                                    />
                                    <p className="text-sm text-gray-500">or Login with email</p>
                                    <Image
                                        src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a948ef4e6cf94_Line%203.svg"
                                        alt=""
                                        className="inline-block"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                                <div className="mx-auto mb-4 max-w-sm pb-4">
                                    <form name="wf-form-password" method="get">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-6 text-sm text-black placeholder:text-black"
                                                placeholder="Email Address"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative mb-4">
                                            <input
                                                type="password"
                                                className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-6 text-sm text-black placeholder:text-black"
                                                placeholder="Password (min 8 characters)"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={onLogin}
                                            type="button"
                                            className={`mt-4 inline-block w-full items-center rounded-md bg-red-500 px-6 py-3 text-center font-semibold text-white ${buttonDisabled || loading
                                                ? "opacity-50  cursor-not-allowed"
                                                : "cursor-pointer bg-red-600 hover:bg-red-700 hover:scale-[101%] transition-all ease-in-out duration-300"
                                                }`}
                                            disabled={buttonDisabled || loading}
                                        >
                                            {loading ? "Processing..." : "Login"}
                                        </button>
                                    </form>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Don&apos;t have an account?
                                    <Link href="/Register" className="font-bold hover:text-black">
                                        <span> </span> Register now
                                    </Link>
                                </p>
                                <Link
                                    href="/ForgotPassword"
                                    className="text-sm text-gray-500 hover:text-black underline pt-2"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

