"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import bcrypt from "bcryptjs";

interface User {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    if (!emailPattern.test(user.email)) {
      toast.error("Please enter a valid email (Name@email.com)");
      return;
    }
    if (user.password !== user.confirmPassword) {
      toast.error("Password and Confirm Password should be same");
      return;
    }
    if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const response = await axios.post("http://localhost:5000/user", {
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });
      if (response.data.message === "Email already exists") {
        toast.error("Email is already exists, Please use a different one.");
        return;
      }
      toast.success("Register Successful");
      router.push("/Login");
    } catch (error: any) {
      toast.error("Signup failed, " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.userName.length > 0 &&
      user.confirmPassword.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

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
          <div className="mx-auto w-full h-screen py-16 md:py-16 ">
            <div className="mx-auto max-w-xl rounded-md bg-gray-100 py-12 text-center px-4">
              <h2 className="text-3xl mx-auto text-center font-bold max-w-sm md:text-5xl">
                Join <span className="text-red-600">Quizzeer</span> today.
              </h2>
              <p className="mx-auto my-5 max-w-md text-sm text-gray-500 sm:text-base">
                Create an account to start learning and sharing knowledge with
                the Quizzer community.
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
                  <p className="text-sm text-gray-500">or sign up with email</p>
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
                        type="text"
                        className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-6 text-sm text-black placeholder:text-black"
                        placeholder="Username"
                        required
                        value={user.userName}
                        onChange={(e) =>
                          setUser({ ...user, userName: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-6 text-sm text-black placeholder:text-black"
                        placeholder="Email Address"
                        required
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative mb-4">
                      <input
                        type="password"
                        className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-6 text-sm text-black placeholder:text-black"
                        placeholder="Password (min 8 characters)"
                        required
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative mb-4">
                      <input
                        type="password"
                        className="mb-4 block h-9 w-full rounded-md border border-solid border-black px-3 py-6 pl-6 text-sm text-black placeholder:text-black"
                        placeholder="Confirm Password"
                        required
                        value={user.confirmPassword}
                        onChange={(e) =>
                          setUser({ ...user, confirmPassword: e.target.value })
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className={`mt-4 inline-block w-full  items-center rounded-md bg-red-600 px-6 py-3 text-center font-semibold text-white ${buttonDisabled || loading
                        ? "opacity-50  cursor-not-allowed"
                        : "cursor-pointer hover:bg-red-700 hover:scale-[101%] transition-all ease-in-out duration-300"
                        }`}
                      onClick={onRegister}
                      disabled={buttonDisabled || loading}>
                      {loading ? "Processing..." : "Sign Up"}
                    </button>
                  </form>
                </div>
                <p className="text-sm text-gray-500">
                  Already have an account?
                  <Link href="/Login" className=" font-bold hover:text-black">
                    <span> </span> Login now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Register;
