import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary'

const toneClass: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground border-transparent',
  success: 'bg-success/15 text-success border-transparent',
  warning: 'bg-warning/20 text-warning-foreground border-transparent',
  danger: 'bg-destructive/15 text-destructive border-transparent',
  info: 'bg-chart-3/15 text-chart-3 border-transparent',
  primary: 'bg-primary/15 text-primary border-transparent',
}

const statusTone: Record<string, Tone> = {
  // content
  draft: 'neutral',
  in_review: 'warning',
  approved: 'info',
  scheduled: 'primary',
  published: 'success',
  failed: 'danger',
  // orders
  pending: 'warning',
  paid: 'info',
  fulfilled: 'primary',
  shipped: 'info',
  cancelled: 'neutral',
  refunded: 'danger',
  // leads
  new: 'info',
  contacted: 'primary',
  qualified: 'warning',
  proposal: 'warning',
  won: 'success',
  lost: 'danger',
  // integrations
  connected: 'success',
  disconnected: 'neutral',
  expired: 'warning',
  error: 'danger',
  active: 'success',
  invited: 'warning',
  suspended: 'danger',
  // sentiment
  positive: 'success',
  neutral: 'neutral',
  negative: 'danger',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusTone[status] ?? 'neutral'
  const label = status.replace(/_/g, ' ')
  return (
    <Badge
      variant="outline"
      className={cn('capitalize font-medium', toneClass[tone], className)}
    >
      {label}
    </Badge>
  )
}
