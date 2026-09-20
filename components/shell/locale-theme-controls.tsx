'use client'

import { Languages, Moon, Sun } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import { useTheme } from '@/lib/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function LocaleToggle() {
  const { locale, setLocale } = useI18n()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}
            aria-label="Toggle language"
          />
        }
      >
        <Languages className="size-4.5" />
        <span className="sr-only">Toggle language</span>
      </TooltipTrigger>
      <TooltipContent>{locale === 'en' ? 'Switch to Farsi (RTL)' : 'Switch to English'}</TooltipContent>
    </Tooltip>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          />
        }
      >
        <Sun className="size-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </TooltipTrigger>
      <TooltipContent>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</TooltipContent>
    </Tooltip>
  )
}
