import type { Metadata } from 'next'
import './globals.css'

// ============================================================================
// CLOUDFLARE EDGE RUNTIME CONFIGURATION
// For @cloudflare/next-on-pages compatibility
// ============================================================================


// Force dynamic rendering for multi-tenant support
export const dynamic = 'force-dynamic'

// Use system fonts as fallback for CI/offline environments
const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

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
      <body style={{ fontFamily }}>
        {children}
      </body>
    </html>
  )
}
