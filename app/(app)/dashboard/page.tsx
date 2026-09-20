'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Bot, CalendarClock, DollarSign, Eye, Heart, ShoppingBag, Users, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { CardGridSkeleton, EmptyState, ErrorState, ListSkeleton } from '@/components/shared/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAgentActivity, useAnalytics, useContent, useMetrics, useOrders } from '@/lib/data/hooks'
import { useI18n } from '@/lib/i18n/provider'
import { formatCurrency, formatDate, formatFull, formatNumber, formatRelative } from '@/lib/format'

const metricIcon: Record<string, LucideIcon> = {
  followers: Users,
  engagement: Heart,
  reach: Eye,
  revenue: DollarSign,
}

const text = {
  en: {
    title: 'Dashboard',
    desc: 'Performance across your Instagram accounts, sales and AI agents.',
    growth: 'Follower growth',
    growthDesc: 'Last 30 days',
    channels: 'Revenue by channel',
    orders: 'Recent orders',
    ordersEmpty: 'No orders yet',
    scheduled: 'Upcoming posts',
    scheduledEmpty: 'Nothing scheduled',
    agents: 'AI agent activity',
    agentsEmpty: 'No agent activity yet',
    error: 'Could not load the dashboard.',
  },
  fa: {
    title: 'داشبورد',
    desc: 'عملکرد اکانت‌های اینستاگرام، فروش و عامل‌های هوش مصنوعی.',
    growth: 'رشد فالوور',
    growthDesc: '۳۰ روز گذشته',
    channels: 'درآمد به تفکیک کانال',
    orders: 'سفارش‌های اخیر',
    ordersEmpty: 'هنوز سفارشی ثبت نشده',
    scheduled: 'پست‌های زمان‌بندی‌شده',
    scheduledEmpty: 'چیزی زمان‌بندی نشده',
    agents: 'فعالیت عامل‌های هوش مصنوعی',
    agentsEmpty: 'هنوز فعالیتی ثبت نشده',
    error: 'بارگذاری داشبورد ممکن نشد.',
  },
} as const

function formatMetric(key: string, value: number, unit?: string) {
  if (key === 'revenue') return formatCurrency(value)
  if (unit === '%') return `${value}%`
  return formatNumber(value)
}

export default function DashboardPage() {
  const { locale } = useI18n()
  const t = text[locale]
  const metrics = useMetrics()
  const analytics = useAnalytics()
  const orders = useOrders()
  const activity = useAgentActivity()
  const content = useContent()

  if (metrics.error) return <ErrorState message={t.error} onRetry={() => metrics.mutate()} />

  const growth = (analytics.data?.followerGrowth ?? []).map((value, i) => ({ day: i + 1, value }))
  const channels = analytics.data?.revenueByChannel ?? []
  const channelMax = Math.max(1, ...channels.map((c) => c.value))
  const recentOrders = (orders.data ?? []).slice(0, 5)
  const upcoming = (content.data ?? [])
    .filter((c) => c.status === 'scheduled' && c.scheduledAt)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 4)
  const recentActivity = (activity.data ?? []).slice(0, 5)

  return (
    <>
      <PageHeader title={t.title} description={t.desc} />

      {metrics.isLoading || !metrics.data ? (
        <CardGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.data.map((m) => (
            <StatCard
              key={m.key}
              label={m.label}
              value={formatMetric(m.key, m.value, m.unit)}
              delta={m.changePct}
              icon={metricIcon[m.key]}
            />
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t.growth}</CardTitle>
            <CardDescription>{t.growthDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growth} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--popover-foreground)',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#growthFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.channels}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.isLoading ? (
              <ListSkeleton rows={3} />
            ) : (
              channels.map((c) => (
                <div key={c.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>{c.label}</span>
                    <span className="font-medium tabular-nums">{formatCurrency(c.value)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(c.value / channelMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t.orders}</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.isLoading ? (
              <ListSkeleton rows={4} />
            ) : recentOrders.length === 0 ? (
              <EmptyState icon={ShoppingBag} title={t.ordersEmpty} className="py-8" />
            ) : (
              <ul className="divide-y">
                {recentOrders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.number} · {formatFull(o.lines.length)} {locale === 'fa' ? 'قلم' : o.lines.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium tabular-nums">
                        {formatCurrency(o.total, o.currency)}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.scheduled}</CardTitle>
          </CardHeader>
          <CardContent>
            {content.isLoading ? (
              <ListSkeleton rows={4} />
            ) : upcoming.length === 0 ? (
              <EmptyState icon={CalendarClock} title={t.scheduledEmpty} className="py-8" />
            ) : (
              <ul className="divide-y">
                {upcoming.map((c) => (
                  <li key={c.id} className="space-y-1 py-2.5">
                    <p className="line-clamp-2 text-sm">{c.caption}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="capitalize">{c.type}</span> · {formatDate(c.scheduledAt!)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.agents}</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.isLoading ? (
              <ListSkeleton rows={4} />
            ) : recentActivity.length === 0 ? (
              <EmptyState icon={Bot} title={t.agentsEmpty} className="py-8" />
            ) : (
              <ul className="divide-y">
                {recentActivity.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm">{a.summary}</p>
                      <p className="text-xs text-muted-foreground">{formatRelative(a.createdAt)}</p>
                    </div>
                    <StatusBadge status={a.outcome === 'success' ? 'active' : a.outcome === 'failed' ? 'failed' : 'pending'} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
