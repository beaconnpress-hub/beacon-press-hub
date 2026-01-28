'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if user has recovery session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error('Invalid or expired reset link. Please try again.')
                router.push('/admin/forgot-password')
            }
        }
        checkSession()
    }, [supabase, router])

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 8) {
            return 'Password must be at least 8 characters'
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain an uppercase letter'
        }
        if (!/[a-z]/.test(pwd)) {
            return 'Password must contain a lowercase letter'
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain a number'
        }
        if (!/[!@#$%^&*]/.test(pwd)) {
            return 'Password must contain a special character (!@#$%^&*)'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            setLoading(false)
            return
        }

        const validation = validatePassword(password)
        if (validation) {
            toast.error(validation)
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({ password })

            if (error) throw error

            toast.success('Password reset successful! Redirecting to login...')
            setTimeout(() => {
                router.push('/admin/login')
                router.refresh()
            }, 1500)
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to reset password'
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = (pwd: string) => {
        let strength = 0
        if (pwd.length >= 8) strength++
        if (/[A-Z]/.test(pwd)) strength++
        if (/[a-z]/.test(pwd)) strength++
        if (/[0-9]/.test(pwd)) strength++
        if (/[!@#$%^&*]/.test(pwd)) strength++
        return strength
    }

    const strength = passwordStrength(password)
    const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
    const strengthText = strength <= 2 ? 'Weak' : strength <= 3 ? 'Fair' : 'Strong'

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400 mb-2">Beacon Press</h1>
                    <h2 className="text-xl text-gray-300">Create New Password</h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8 space-y-4">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-200">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>

                        {/* Password Strength */}
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                                        <div
                                            className={`h-full ${strengthColor} transition-all`}
                                            style={{ width: `${(strength / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">{strengthText}</span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    ✓ At least 8 characters<br />
                                    ✓ Uppercase & lowercase<br />
                                    ✓ Number & special character (!@#$%^&*)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-200">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                            >
                                {showConfirm ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-400 mt-1">❌ Passwords do not match</p>
                        )}
                        {confirmPassword && password === confirmPassword && (
                            <p className="text-xs text-green-400 mt-1">✓ Passwords match</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating Password...' : 'Reset Password'}
                    </button>
                </form>

                {/* Help Text */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    Password reset link expires in 1 hour
                </p>
            </div>
        </div>
    )
}
