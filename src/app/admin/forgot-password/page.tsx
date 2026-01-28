'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            })

            if (error) throw error

            setSubmitted(true)
            toast.success('Password reset link sent to your email!')
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to send reset link'
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400 mb-2">Beacon Press</h1>
                    <h2 className="text-xl text-gray-300">Reset Your Password</h2>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
                        <p className="text-gray-300 text-sm mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-200">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@beaconpress.com"
                                    className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <p className="text-center text-gray-400 text-sm">
                                Remember your password?{' '}
                                <Link href="/admin/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                ) : (
                    <div className="bg-green-500/10 border border-green-500 rounded-lg shadow-xl p-8 text-center">
                        <div className="text-4xl mb-4">✉️</div>
                        <h3 className="text-xl font-bold text-green-400 mb-2">Check Your Email</h3>
                        <p className="text-gray-300 mb-6">
                            We've sent a password reset link to <strong>{email}</strong>. The link will expire in 1 hour.
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                            Check your spam folder if you don't see the email.
                        </p>
                        <Link
                            href="/admin/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
