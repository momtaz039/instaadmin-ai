'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useAuth } from '@/lib/auth/provider'
import { useI18n } from '@/lib/i18n/provider'
import { mobilePrimary } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarNav } from './sidebar-nav'
import { LocaleToggle, ThemeToggle } from './locale-theme-controls'
import { NotificationsMenu } from './notifications-menu'
import { UserMenu } from './user-menu'

function MobileTabBar() {
  const pathname = usePathname()
  const { hasPermission } = useAuth()
  const { locale } = useI18n()
  const items = mobilePrimary.filter((item) => hasPermission(item.permission))
  if (items.length === 0) return null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul
        className="grid"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 text-[0.68rem] font-medium',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-5" />
                <span className="truncate">{locale === 'fa' ? item.labelFa : item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !session) router.replace('/login')
  }, [isLoading, session, router])

  if (!session) return null

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-e bg-sidebar lg:block">
          <SidebarNav />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b bg-background/80 px-3 backdrop-blur sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side={locale === 'fa' ? 'right' : 'left'}
                showCloseButton={false}
                className="w-72 gap-0 bg-sidebar p-0"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarNav onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex-1" />
            <LocaleToggle />
            <ThemeToggle />
            <NotificationsMenu />
            <div className="ps-1">
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <MobileTabBar />
    </TooltipProvider>
  )
}
