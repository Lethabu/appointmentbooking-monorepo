import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// ============================================================================
// CLOUDFLARE EDGE RUNTIME CONFIGURATION
// For @cloudflare/next-on-pages compatibility
// ============================================================================


// Force dynamic rendering for multi-tenant support
export const dynamic = 'force-dynamic'

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
