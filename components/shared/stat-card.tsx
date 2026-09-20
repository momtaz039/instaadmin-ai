import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string
  value: string
  delta?: number
  icon?: LucideIcon
  hint?: string
}) {
  const positive = (delta ?? 0) >= 0
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        {Icon ? (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4.5" />
          </div>
        ) : null}
      </div>
      {delta !== undefined || hint ? (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta !== undefined ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular-nums',
                positive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
              )}
            >
              {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      ) : null}
    </Card>
  )
}
