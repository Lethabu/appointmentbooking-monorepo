import type { Metadata } from 'next'
import './globals.css'

// ============================================================================
// STATIC EXPORT CONFIGURATION
// For Split Architecture: Static Frontend + Worker API Backend
// ============================================================================

// DISABLED: force-dynamic prevents static export
// Use client-side data fetching instead (SWR, React Query, etc.)
// export const dynamic = 'force-dynamic'

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
