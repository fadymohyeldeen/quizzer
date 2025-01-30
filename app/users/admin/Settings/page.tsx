'use client'
import React, { useState } from 'react'
import { FiMonitor } from 'react-icons/fi'

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('en')
  const [timeLimit, setTimeLimit] = useState('30')
  const [maxQuestions, setMaxQuestions] = useState('10')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ darkMode, notifications, language, timeLimit, maxQuestions })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 space-y-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center">Dashboard Settings</h1>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="bg-white p-2.5 rounded-xl shadow-sm">
                    <FiMonitor className="text-xl text-slate-600" />
                  </span>
                  Interface
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                    <div>
                      <span className="font-medium text-slate-700">Dark Mode</span>
                      <p className="text-sm text-slate-500">Switch to dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <label className="block font-medium text-slate-700 mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="bg-white p-2.5 rounded-xl shadow-sm">⚙️</span>
                  Quiz Preferences
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <label className="block font-medium text-slate-700 mb-2">Time Limit</label>
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        min="10"
                        max="300"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      />
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <label className="block font-medium text-slate-700 mb-2">Max Questions</label>
                      <input
                        type="number"
                        value={maxQuestions}
                        onChange={(e) => setMaxQuestions(e.target.value)}
                        min="5"
                        max="50"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                    <div>
                      <span className="font-medium text-slate-700">Notifications</span>
                      <p className="text-sm text-slate-500">Email updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
