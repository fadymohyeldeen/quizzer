"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { MdOutlineDashboard, MdOutlineHome } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";

function SideBar({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } pt-20 fixed left-0 top-0 h-full bg-white flex flex-col justify-between transition-all duration-300 ease-in-out overflow-y-auto border-r border-gray-200 shadow-sm`}>
          <div>
            <div
              className={`mb-8 flex ${
                isSidebarOpen ? "justify-end" : "justify-center"
              }`}>
              <button
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
                title="Toggle Sidebar"
                className={`hover:bg-red-500 text-gray-600 hover:text-white p-2 rounded-lg transition-colors duration-200 ${
                  isSidebarOpen ? "mr-4" : ""
                }`}>
                {isSidebarOpen ? (
                  <TbLayoutSidebarLeftCollapse size={22} />
                ) : (
                  <TbLayoutSidebarRightCollapse size={22} />
                )}
              </button>
            </div>
            <nav>
              <ul className="space-y-4 flex-col pb-3 px-3">
                <li
                  className={`group flex items-center ${
                    isSidebarOpen ? "px-4" : "px-3"
                  } py-3 text-sm text-gray-600 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-colors duration-200 ${
                    isActive("/users/admin/Dashboard") ? "bg-red-600 text-white" : ""
                  }`}>
                  <Link href="/users/admin/Dashboard">
                    <div
                      className={`flex items-center pl-1 ${
                        isSidebarOpen ? "gap-3" : ""
                      }`}>
                      <MdOutlineDashboard size={22} />
                      {isSidebarOpen && <span className="font-medium">Overview</span>}
                    </div>
                  </Link>
                </li>
                <li
                  className={`group flex items-center ${
                    isSidebarOpen ? "px-4" : "px-3"
                  } py-3 text-sm text-gray-600 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-colors duration-200 ${
                    isActive("/users/admin/Quizzes") ? "bg-red-600 text-white" : ""
                  }`}>
                  <Link href="/users/admin/Quizzes">
                    <div
                      className={`flex items-center pl-1 ${
                        isSidebarOpen ? "gap-3" : ""
                      }`}>
                      <FaRegQuestionCircle size={22} />
                      {isSidebarOpen && <span className="font-medium">Quizzes</span>}
                    </div>
                  </Link>
                </li>
                <li
                  className={`group flex items-center ${
                    isSidebarOpen ? "px-4" : "px-3"
                  } py-3 text-sm text-gray-600 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-colors duration-200 ${
                    isActive("/users/admin/Profile") ? "bg-red-600 text-white" : ""
                  }`}>
                  <Link href="/users/admin/Profile">
                    <div
                      className={`flex items-center pl-1 ${
                        isSidebarOpen ? "gap-3" : ""
                      }`}>
                      <CgProfile size={22} />
                      {isSidebarOpen && <span className="font-medium">Profile</span>}
                    </div>
                  </Link>
                </li>
                <li
                  className={`group flex items-center ${
                    isSidebarOpen ? "px-4" : "px-3"
                  } py-3 text-sm text-gray-600 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-colors duration-200 ${
                    isActive("/users/admin/Settings") ? "bg-red-600 text-white" : ""
                  }`}>
                  <Link href="/users/admin/Settings">
                    <div
                      className={`flex items-center pl-1 ${
                        isSidebarOpen ? "gap-3" : ""
                      }`}>
                      <IoSettingsOutline size={22} />
                      {isSidebarOpen && <span className="font-medium">Settings</span>}
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main
          className={`flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}>
          <div className=" text-gray-800">{children}</div>
        </main>
      </div>
    </>
  );
}

export default SideBar;
