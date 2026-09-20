'use client'

import { Bell } from 'lucide-react'
import { useNotifications } from '@/lib/data/hooks'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { relativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'

const dot: Record<string, string> = {
  info: 'bg-chart-3',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
}

export function NotificationsMenu() {
  const { data } = useNotifications()
  const unread = data?.filter((n) => !n.read).length ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="relative" aria-label="Notifications" />}
      >
          <Bell className="size-4.5" />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[20rem] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              {unread} new
            </span>
          ) : null}
        </div>
        <ScrollArea className="h-[20rem]">
          <div className="divide-y">
            {(data ?? []).map((n) => (
              <div
                key={n.id}
                className={cn('flex gap-3 px-4 py-3', !n.read && 'bg-accent/40')}
              >
                <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', dot[n.kind])} />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[0.7rem] text-muted-foreground/70">
                    {relativeTime(n.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
