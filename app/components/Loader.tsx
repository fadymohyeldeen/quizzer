import React from 'react'

function Loader() {
    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <div className="space-y-6 text-center">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse delay-75"></div>
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse delay-150"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader
