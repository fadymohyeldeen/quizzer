"use client";

import { useAuth } from "../../../../context/AuthContext";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBars,
  FaHome,
  FaUserCircle,
  FaBullhorn,
  FaCog,
  FaAddressCard,
} from "react-icons/fa";

// Type definitions for the navigation items
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  if (user?.role !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    document.cookie = "yourAuthCookie=; Max-Age=0; path=/";
    router.push("/");
  };

  const navItems: NavItem[] = [
    { href: "/users/admin/Dashboard", label: "Dashboard", icon: FaHome },
    { href: "/users/admin/Profile", label: "Profile", icon: FaAddressCard },
    {
      href: "/users/admin/UserManagement",
      label: "User Management",
      icon: FaUserCircle,
    },
    {
      href: "/users/admin/Announcements",
      label: "Announcements",
      icon: FaBullhorn,
    },
    { href: "/users/admin/Settings", label: "Settings", icon: FaCog },
  ];

  return (
    <div className="relative">
      <button
        className="fixed lg:hidden p-2 text-red-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="mt-5" size={26} />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white text-zinc-800 shadow-xl z-20
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    transition-all duration-300 ease-in-out lg:translate-x-0 lg:block`}
      >
        <div className="mt-10 place-self-center">
          <a href="/">
            <svg
              className="drop-shadow-md"
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
          </a>
        </div>

        <nav className="flex-1 mt-10">
          <ul>
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`flex items-center font-medium p-3 transition-all duration-500 ease-in-out rounded-2xl m-2 ${
                    pathname === href
                      ? "bg-gradient-to-r from-red-600 to-transparent text-white hover:bg-red-600"
                      : "hover:bg-red-600 hover:text-white hover:scale-90"
                  }`}
                >
                  <Icon className="mr-3 transition-transform duration-300 ease-in-out transform" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-[45vh]">
          <button
            className="w-full font-medium flex items-center justify-center p-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-red-600 to-transparent rounded hover:bg-red-800 text-white hover:scale-95"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
