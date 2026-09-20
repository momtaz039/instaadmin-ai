'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export function PlanCard() {
  const used = 3200
  const limit = 5000
  const pct = Math.round((used / limit) * 100)

  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-card p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <p className="text-sm font-semibold">AI credits</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {used.toLocaleString()} / {limit.toLocaleString()} used this month
      </p>
      <Progress value={pct} className="mt-2.5 h-1.5" />
      <Button render={<Link href="/settings/billing" />} nativeButton={false} size="sm" className="mt-3 w-full">
        Upgrade plan
      </Button>
    </div>
  )
}
