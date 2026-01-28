'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Admin Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
                <div className="p-8 border-2 border-dashed border-red-500 rounded-lg bg-red-950/30">
                    <h2 className="text-2xl font-bold text-red-400 mb-3">⚠️ Something Went Wrong</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        We encountered an error loading the admin dashboard. This might be a network issue or a database problem.
                    </p>

                    <details className="mb-6 text-xs">
                        <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">Error Details</summary>
                        <pre className="bg-gray-950 p-2 rounded text-gray-400 overflow-auto max-h-32 text-xs">
                            {error.message || 'Unknown error'}
                        </pre>
                    </details>

                    <div className="flex gap-3">
                        <button
                            onClick={() => reset()}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/dashboard'}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-md transition"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
