'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navGroups } from '@/lib/navigation'
import { useAuth } from '@/lib/auth/provider'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { WorkspaceSwitcher } from './workspace-switcher'
import { PlanCard } from './plan-card'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { hasPermission } = useAuth()
  const { locale } = useI18n()
  const isFa = locale === 'fa'

  return (
    <div className="flex h-full flex-col gap-1">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/dashboard" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <div className="px-3 pb-2">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2 scrollbar-thin">
        {navGroups.map((group) => {
          const items = group.items.filter((item) => hasPermission(item.permission))
          if (items.length === 0) return null
          return (
            <div key={group.title}>
              <p className="px-3 pb-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {isFa ? group.titleFa : group.title}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-4.5 shrink-0 transition-colors',
                            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                        <span className="truncate">{isFa ? item.labelFa : item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <PlanCard />
      </div>
    </div>
  )
}
