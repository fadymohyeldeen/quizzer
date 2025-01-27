"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import background from "../../public/bg.jpg";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Simulated login behavior
    if (email === "test@example.com" && password === "password123") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="flex flex-col lg:flex-row h-screen">
      <section className="relative flex h-32 items-end w-full lg:w-1/2 sm:h-96 lg:h-full">
        <Image
          alt="Background"
          src={background}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 opacity-80"
          priority
        />
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-end p-8 text-white bg-black bg-opacity-50">
          <h2 className="hidden lg:block mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
            Welcome to AMIT
          </h2>
          <p className="hidden lg:block mt-4 text-white text-lg sm:text-xl">
            Start your learning journey today
          </p>
        </div>
      </section>

      <main
        className="flex items-center justify-center w-full lg:w-1/2 bg-gradient-to-b from-gray-50 to-white"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, white), url(/assets/coursesBG.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-xl w-2/3 lg:w-1/2  lg:max-w-3xl">
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="text-center mt-10">
              <h1 className="text-2xl font-bold text-red-600 sm:text-3xl">
                Welcome back!
              </h1>
            </div>
            <div>
              <label
                htmlFor="Email"
                className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md  px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400"
              >
                <input
                  type="email"
                  id="Email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
                <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                  Email
                </span>
              </label>
            </div>

            <div>
              <label
                htmlFor="Password"
                className="bg-white bg-opacity-30 relative block overflow-hidden rounded-md px-3 pt-3 shadow-sm focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-400"
              >
                <input
                  type="password"
                  id="Password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
                <span className="absolute start-3 top-3 font-semibold -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                  Password
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="RememberMe" className="flex items-center">
                <input
                  type="checkbox"
                  id="RememberMe"
                  name="RememberMe"
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/Signup"
                className="text-sm text-red-600 hover:underline"
              >
                Sign up
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </main>
    </section>
  );
}
