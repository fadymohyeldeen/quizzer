"use client";

import Image from "next/image";
import background from "../../public/bg.jpg";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Signup() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
            setError(
                `Password must include uppercase, lowercase, and a number, and be at least 8 characters long.`
            );
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const existingUsersResponse = await fetch(
                "https://67608e416be7889dc35e4f1e.mockapi.io/users",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!existingUsersResponse.ok) {
                throw new Error("Failed to fetch existing users.");
            }

            const existingUsers: FormData[] = await existingUsersResponse.json();

            const userExists = existingUsers.some(
                (user) =>
                    user.userName === formData.userName || user.email === formData.email
            );

            if (userExists) {
                alert(
                    "Username or email already exists. Please use different credentials."
                );
                return;
            }

            const response = await fetch(
                "https://67608e416be7889dc35e4f1e.mockapi.io/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName: formData.userName,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        password: formData.password,
                        role: "student",
                    }),
                }
            );

            const result = await response.json();
            if (response.ok) {
                alert("Signup successful!");
                router.push("/");
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error(error);
        }
    };

    return (
        <>
            <section>
                <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                    <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                        <Image
                            alt="Background"
                            src={background}
                            layout="fill"
                            objectFit="cover"
                            className="absolute inset-0 opacity-80"
                        />

                        <div className="hidden lg:relative lg:block lg:p-12">
                            <svg
                                className="h-8 sm:h-10"
                                xmlns="http://www.w3.org/2000/svg"
                                width="148"
                                height="41"
                                viewBox="0 0 148 41"
                                fill="none"
                            >
                                <path
                                    d="M28.6875 41V34.9375H16.5L12.5625 41H0.5625L24.25 4.4375C25.875 1.9375 28.1042 0.6875 30.9375 0.6875C33.0625 0.6875 34.8958 1.47917 36.4375 3.0625C38.0208 4.60417 38.8125 6.4375 38.8125 8.5625V22.875H28.6875V16.125L22.9375 24.875H38.8125V41H28.6875ZM81.125 41V16.125C79.5417 19 78.25 21.3333 77.25 23.125C73.75 29.25 70.3333 32.3125 67 32.3125C63.7083 32.3125 60.3125 29.2708 56.8125 23.1875C55.4792 20.8542 54.1667 18.5 52.875 16.125V41H42.8125V8.5625C42.8125 6.39583 43.5833 4.54167 45.125 3C46.6667 1.45833 48.5208 0.6875 50.6875 0.6875C54.3958 0.6875 58.3125 4.1875 62.4375 11.1875C63.9375 13.8958 65.4583 16.6042 67 19.3125C68.2917 16.9792 69.6042 14.6458 70.9375 12.3125C72.9375 8.8125 74.75 6.1875 76.375 4.4375C78.7083 1.9375 81.0208 0.6875 83.3125 0.6875C85.4792 0.6875 87.3333 1.45833 88.875 3C90.4167 4.54167 91.1875 6.39583 91.1875 8.5625V41H81.125ZM96.1875 41V0.6875H106.312V41H96.1875ZM140.812 10.75H133.438V0.6875H147.562L140.812 10.75ZM121.375 41V10.75H111.312V0.6875H131.438V41H121.375Z"
                                    className="fill-red-600"
                                />
                            </svg>
                            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                Welcome to AMIT
                            </h2>
                            <p className="mt-4 leading-relaxed text-white/90 text-xl">
                                Start your learning journey today
                            </p>
                        </div>
                    </section>
                    <main
                        className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                        style={{
                            backgroundImage:
                                "linear-gradient(to bottom, transparent, white), url(/assets/coursesBG.svg)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="max-w-xl lg:max-w-3xl">
                            <div className="relative -mt-16 block lg:hidden">
                                <Link
                                    className="inline-flex size-16 items-center justify-center rounded-full bg-white text-red-600 sm:size-20"
                                    href="/">
                                    <span className="sr-only">Home</span>
                                    <svg
                                        className="h-8 sm:h-10"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="148"
                                        height="41"
                                        viewBox="0 0 148 41"
                                        fill="none">
                                        <path
                                            d="M28.6875 41V34.9375H16.5L12.5625 41H0.5625L24.25 4.4375C25.875 1.9375 28.1042 0.6875 30.9375 0.6875C33.0625 0.6875 34.8958 1.47917 36.4375 3.0625C38.0208 4.60417 38.8125 6.4375 38.8125 
                          8.5625V22.875H28.6875V16.125L22.9375 24.875H38.8125V41H28.6875ZM81.125 41V16.125C79.5417 19 78.25 21.3333 77.25 23.125C73.75 29.25 70.3333 32.3125 67 32.3125C63.7083 32.3125 60.3125 29.2708 56.8125 
                          23.1875C55.4792 20.8542 54.1667 18.5 52.875 16.125V41H42.8125V8.5625C42.8125 6.39583 43.5833 4.54167 45.125 3C46.6667 1.45833 48.5208 0.6875 50.6875 0.6875C54.3958 0.6875 58.3125 4.1875 62.4375 11.1875C63.9375 
                          13.8958 65.4583 16.6042 67 19.3125C68.2917 16.9792 69.6042 14.6458 70.9375 12.3125C72.9375 8.8125 74.75 6.1875 76.375 4.4375C78.7083 1.9375 81.0208 0.6875 83.3125 0.6875C85.4792 0.6875 87.3333 1.45833 88.875 3C90.4167 
                          4.54167 91.1875 6.39583 91.1875 8.5625V41H81.125ZM96.1875 
                          41V0.6875H106.312V41H96.1875ZM140.812 10.75H133.438V0.6875H147.562L140.812 10.75ZM121.375 41V10.75H111.312V0.6875H131.438V41H121.375Z"
                                            className="fill-red-600"
                                        />
                                    </svg>
                                </Link>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="FirstName"
                                        className="bg-white focus-within:ring-1 bg-opacity-30 relative block overflow-hidden rounded-md  px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-red-400"
                                    >
                                        <input
                                            type="text"
                                            id="FirstName"
                                            required
                                            placeholder="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                        />
                                        <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                                            First Name
                                        </span>
                                    </label>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="LastName"
                                        className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md focus-ring px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400 ">
                                        <input
                                            type="text"
                                            id="LastName"
                                            required
                                            placeholder="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                        />
                                        <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
                                            Last Name
                                        </span>
                                    </label>
                                </div>

                                <div className="col-span-6 ">
                                    <label
                                        htmlFor="Username"
                                        className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md focus-ring px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400 ">
                                        <input
                                            type="text"
                                            id="Username"
                                            required
                                            placeholder="Username"
                                            name="username"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                        />
                                        <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
                                            Username
                                        </span>
                                    </label>
                                </div>

                                <div className="col-span-6">
                                    <label
                                        htmlFor="Email"
                                        className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md  px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400 ">
                                        <input
                                            type="email"
                                            id="Email"
                                            required
                                            placeholder="Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                        />
                                        <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
                                            Email
                                        </span>
                                    </label>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="Password"
                                        className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400 ">
                                        <input
                                            type="password"
                                            id="Password"
                                            required
                                            placeholder="Password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                        />
                                        <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
                                            Password
                                        </span>
                                    </label>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label
                                        htmlFor="PasswordConfirmation"
                                        className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400">
                                        <input
                                            type="password"
                                            id="PasswordConfirmation"
                                            required
                                            placeholder="Password Confirmation"
                                            name="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm "
                                        />
                                        <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
                                            Confirm Password
                                        </span>
                                    </label>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    {error && (
                                        <p className="text-red-600 mt-4 text-sm font-semibold ">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-6">
                                    <p className="text-sm text-gray-500 ">
                                        By creating an account, you agree to our{" "}
                                        <a href="#" className="text-gray-700 underline ">
                                            terms and conditions
                                        </a>{" "}
                                        and
                                        <a href="#" className="text-gray-700 underline">
                                            {" "}
                                            privacy policy{" "}
                                        </a>
                                        .
                                    </p>
                                </div>

                                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                    <button
                                        type="submit"
                                        className="inline-block shrink-0 rounded-md border border-red-600 bg-red-600 px-12 py-3  text-sm font-medium text-white transition hover:bg-transparent hover:border-red-600 hover:text-red-600 focus:outline-none focus:ring focus:ring-red-600 active:text-red-500 ">
                                        Create an account
                                    </button>

                                    <p className="mt-4 text-sm text-gray-500 sm:mt-0 ">
                                        Already have an account?
                                        {"   "}
                                        <Link href="/Login" type="button" className="underline">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </section>
        </>
    );
}
