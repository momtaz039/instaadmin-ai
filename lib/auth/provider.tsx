'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { currentUser, organization } from '@/lib/data/mock'
import { can, type Permission } from '@/lib/rbac'
import type { Organization, Role, UserProfile } from '@/lib/types'

/**
 * Authentication context. Currently backed by a sample session so the whole
 * app is navigable. It is intentionally shaped like a real auth client:
 * replace the internals with Supabase Auth (`lib/supabase/client.ts`) —
 * `onAuthStateChange`, `getUser`, `signInWithPassword`, `signOut` — without
 * changing any consumer.
 */
type Session = {
  user: UserProfile
  organization: Organization
  role: Role
}

type AuthContextValue = {
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const sampleSession: Session = {
  user: currentUser,
  organization,
  role: 'owner',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(sampleSession)
  const [isLoading] = useState(false)

  const signIn = useCallback(async (_email: string, _password: string) => {
    // TODO: supabase.auth.signInWithPassword({ email, password })
    setSession(sampleSession)
  }, [])

  const signOut = useCallback(async () => {
    // TODO: supabase.auth.signOut()
    setSession(null)
  }, [])

  const hasPermission = useCallback(
    (permission: Permission) => (session ? can(session.role, permission) : false),
    [session],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ session, isLoading, signIn, signOut, hasPermission }),
    [session, isLoading, signIn, signOut, hasPermission],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
