'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/lib/auth/provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initials } from '@/lib/format'

export function UserMenu() {
  const { session, signOut } = useAuth()
  const router = useRouter()
  if (!session) return null
  const { user, role } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-8">
          <AvatarImage src={user.avatarUrl || '/placeholder-user.jpg'} alt={user.fullName} />
          <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 py-2">
            <Avatar className="size-9">
              <AvatarImage src={user.avatarUrl || '/placeholder-user.jpg'} alt={user.fullName} />
              <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <div className="px-2 pb-2">
          <span className="inline-flex rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium capitalize text-primary">
            {role}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings/profile" />}>
          <User className="size-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="size-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings/billing" />}>
          <CreditCard className="size-4" /> Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await signOut()
            router.push('/login')
          }}
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
