"use client";

import React from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { LuTriangleAlert } from "react-icons/lu";
import { PiBarbell } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa";

interface QuizCardProps {}

const QuizCard: React.FC<QuizCardProps> = () => {
  return (
    <div>
      {/* Card */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">
              JavaScript Basics
            </h3>
            <p className="text-sm text-gray-500">Programming</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center text-gray-700">
                <span className="mr-2">
                  <FaRegClock />
                </span>
                <span>35 mins</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-2">
                  <MdOutlineLibraryBooks />
                </span>
                <span>10 questions</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">
                  <PiBarbell />
                </span>
                <span className="px-2 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700">
                  Eazy
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-2">
                  <LuTriangleAlert />
                </span>
                <span>Due: 2025-02-01</span>
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-between border-t border-gray-200 bg-gray-50">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
              View Details
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-700">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
