import { cn } from '@/lib/utils'

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="size-4.5" aria-hidden="true">
          <path
            d="M12 2.5c1.6 3.6 3.4 5.4 7 7-3.6 1.6-5.4 3.4-7 7-1.6-3.6-3.4-5.4-7-7 3.6-1.6 5.4-3.4 7-7Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {showWordmark ? (
        <span className="font-display text-lg font-semibold tracking-tight">Lumina</span>
      ) : null}
    </div>
  )
}
