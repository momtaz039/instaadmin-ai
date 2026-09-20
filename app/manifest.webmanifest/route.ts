import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lumina — AI Instagram Growth Platform',
    short_name: 'Lumina',
    description:
      'AI-powered Instagram management, automation, CRM, commerce, and analytics in one workspace.',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#141118',
    theme_color: '#141118',
    categories: ['business', 'productivity', 'social'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}

export function GET() {
  return Response.json(manifest(), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
