import './globals.css'

export const metadata = {
  title: 'InStyle Hair Boutique - Dashboard',
  description: 'Admin dashboard for InStyle Hair Boutique booking management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
