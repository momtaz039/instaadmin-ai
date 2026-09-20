import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/lib/theme-provider'
import { I18nProvider } from '@/lib/i18n/provider'
import { AuthProvider } from '@/lib/auth/provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Lumina — AI Instagram Growth Platform',
    template: '%s · Lumina',
  },
  description:
    'Lumina is an AI-powered platform to manage, automate, sell, and grow across Instagram — content studio, CRM, commerce, and analytics in one workspace.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  applicationName: 'Lumina',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lumina',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#141118' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className={`dark ${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="dark">
          <I18nProvider>
            <AuthProvider>{children}</AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
