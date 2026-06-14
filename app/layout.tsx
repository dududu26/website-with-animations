import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Forum Anti Penyimpangan - Komunitas Transparansi dan Integritas',
  description: 'Platform forum komunitas untuk berbagi, melaporkan, dan mendiskusikan isu-isu anti penyimpangan, korupsi, dan upaya peningkatan transparansi',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'),
  openGraph: {
    title: 'Forum Anti Penyimpangan',
    description: 'Komunitas diskusi anti penyimpangan dan korupsi',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003',
    siteName: 'Forum Anti Penyimpangan',
    locale: 'id_ID',
    type: 'website',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
