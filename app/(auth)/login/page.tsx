'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/provider'
import { useI18n } from '@/lib/i18n/provider'
import { Logo } from '@/components/shell/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * DEMO login. It signs in a sample session and performs NO real authentication.
 * Replace `signIn` in lib/auth/provider.tsx with Supabase Auth before storing
 * any real data.
 */
export default function LoginPage() {
  const { signIn } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()
  const isFa = locale === 'fa'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit() {
    setBusy(true)
    await signIn(email, password)
    router.push('/dashboard')
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{isFa ? 'ورود' : 'Sign in'}</CardTitle>
            <CardDescription>
              {isFa
                ? 'حالت نمایشی: هنوز احراز هویت واقعی وصل نشده است.'
                : 'Demo mode: real authentication is not connected yet.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{isFa ? 'ایمیل' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{isFa ? 'رمز عبور' : 'Password'}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" size="lg" disabled={busy} onClick={onSubmit}>
              {isFa ? 'ادامه' : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
