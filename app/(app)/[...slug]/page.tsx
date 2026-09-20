'use client'

import { usePathname } from 'next/navigation'
import { Construction } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/states'
import { useI18n } from '@/lib/i18n/provider'
import { allNavItems } from '@/lib/navigation'

/**
 * Temporary catch-all for sections that are not built yet, so no sidebar link
 * ends in a 404. Each section gets its own page.tsx as it is implemented; a
 * specific route always wins over this catch-all.
 */
export default function ComingSoonPage() {
  const pathname = usePathname()
  const { locale } = useI18n()
  const isFa = locale === 'fa'
  const item = allNavItems.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))
  const title = item ? (isFa ? item.labelFa : item.label) : isFa ? 'بخش در دست ساخت' : 'Coming soon'

  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        icon={Construction}
        title={isFa ? 'این بخش در فاز بعدی ساخته می‌شود' : 'This section is being built'}
        description={
          isFa
            ? 'ساختار و دسترسی‌ها آماده است؛ صفحهٔ اصلی این بخش به‌زودی اضافه می‌شود.'
            : 'The structure and permissions are ready; the full page lands in an upcoming phase.'
        }
      />
    </>
  )
}
