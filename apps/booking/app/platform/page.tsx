import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AppointmentBooking.co.za | Service Business Operating System',
  description: 'Automate bookings, payments, and client relationships with AppointmentBooking.co.za.',
}

const pricingTiles = [
  {
    title: '💰 Revenue Automation',
    description: '$297/mo · US Service Franchises',
    accent: 'text-blue-600',
  },
  {
    title: '🏪 Community Commerce',
    description: 'R150/mo · Local Traders & Spaza Shops',
    accent: 'text-green-600',
  },
  {
    title: '🚀 Enterprise',
    description: '$497/mo · Multi-location + Impact',
    accent: 'text-purple-600',
  },
]

export default function PlatformLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans text-gray-900">
      <nav className="fixed top-0 z-50 w-full bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-2xl font-bold text-blue-600">📅 AppointmentBooking.co.za</span>
          <Link className="rounded-md px-4 py-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600" href="/api/health">
            API Status
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 pb-24 pt-28 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold md:text-6xl">
            The Operating System for Service Businesses
          </h1>
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            Automate bookings, payments, and client relationships. Built for salons, spas, consultants, and local traders.
          </p>
          <p className="mt-2 text-base text-gray-500 md:text-lg">Global scale (USD) + Local impact (ZAR)</p>
        </div>

        <section className="mt-12 grid w-full gap-6 md:grid-cols-3">
          {pricingTiles.map((tile) => (
            <article key={tile.title} className="rounded-2xl bg-white p-8 shadow">
              <h3 className={`text-2xl font-bold ${tile.accent}`}>{tile.title}</h3>
              <p className="mt-4 text-gray-600">{tile.description}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow transition hover:bg-blue-700"
            href="/api/pricing"
          >
            View Pricing
          </Link>
          <Link
            className="rounded-lg bg-gray-700 px-6 py-3 text-white shadow transition hover:bg-gray-800"
            href="/api/health"
          >
            System Status
          </Link>
        </div>

        <hr className="mt-16 w-full border-gray-200" />

        <section className="mt-12 w-full space-y-6 text-left">
          <h2 className="text-3xl font-bold text-center">Featured Businesses</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl bg-white p-8 shadow">
              <h3 className="text-2xl font-bold">InStyle Hair Boutique</h3>
              <p className="mt-3 text-gray-600">Premium hair services and products in Cape Town.</p>
              <Link
                className="mt-6 inline-flex items-center rounded-md bg-orange-600 px-5 py-2 text-white transition hover:bg-orange-700"
                href="/instylehairboutique"
              >
                📅 Book Appointment
              </Link>
            </article>
            <article className="rounded-2xl bg-white p-8 shadow">
              <h3 className="text-2xl font-bold">Add Your Business</h3>
              <p className="mt-3 text-gray-600">Join hundreds of service businesses on our platform.</p>
              <button className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
                Get Started
              </button>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
