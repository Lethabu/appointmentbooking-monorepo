import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Force dynamic rendering to avoid static generation issues
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
