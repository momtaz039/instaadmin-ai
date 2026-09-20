'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage('خطا در ثبت‌نام: ' + error.message)
    else setMessage('ثبت‌نام موفق! لطفاً ایمیل خود را چک کنید.')
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage('خطا در ورود: ' + error.message)
    else window.location.href = '/dashboard'
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-slate-800 p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold">ورود / ثبت‌نام</h2>
        <p className="text-center text-sm text-slate-400">
          برای استفاده از داشبورد Lumina وارد شوید
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 focus:border-purple-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 focus:border-purple-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <p className="text-center text-sm text-yellow-400">{message}</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1 rounded-lg bg-purple-600 py-2 font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? '...' : 'ورود'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 rounded-lg border border-purple-600 py-2 font-semibold text-purple-400 hover:bg-purple-600 hover:text-white disabled:opacity-50"
            >
              ثبت‌نام
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}