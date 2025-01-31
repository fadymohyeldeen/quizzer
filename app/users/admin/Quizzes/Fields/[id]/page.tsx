"use client"
import React from 'react'
import { useParams } from 'next/navigation'

export default function page() {
    const params = useParams();

    return (
        <div className="min-h-screen bg-zinc-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-zinc-800 mb-4">Topics for Field ID: {params.id}</h1>
            </div>
        </div>
    )
}
