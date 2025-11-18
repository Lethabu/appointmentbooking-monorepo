import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

// Polyfill browser globals for SSR compatibility (must be first)
if (typeof globalThis !== 'undefined') {
  if (typeof (globalThis as any).self === 'undefined') {
    (globalThis as any).self = globalThis;
  }
  if (typeof (globalThis as any).window === 'undefined') {
    (globalThis as any).window = globalThis;
  }
  if (typeof (globalThis as any).document === 'undefined') {
    (globalThis as any).document = {};
  }
  if (typeof (globalThis as any).navigator === 'undefined') {
    (globalThis as any).navigator = {};
  }
}


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Appointment Booking',
  description: 'Professional appointment booking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
