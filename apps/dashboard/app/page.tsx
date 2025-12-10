'use client'

import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import AppointmentTable from '../components/AppointmentTable'
import SimpleChart from '../components/SimpleChart'

interface DashboardData {
  tenant: {
    id: string
    name: string
    slug: string
  }
  statistics: {
    totalAppointments: number
    confirmedAppointments: number
    pendingAppointments: number
    totalRevenue: number
    activeServices: number
  }
  recentAppointments: any[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
        const response = await fetch(`https://www.instylehairboutique.co.za/api/dashboard?tenantId=${tenantId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { tenant, statistics, recentAppointments } = data
  const { totalAppointments, confirmedAppointments, pendingAppointments, totalRevenue, activeServices } = statistics

  // Calculate revenue in Rands
  const revenueInRands = totalRevenue / 100

  // Data for appointment status chart
  const appointmentStatusData = [
    { label: 'Confirmed', value: confirmedAppointments, color: 'bg-green-500' },
    { label: 'Pending', value: pendingAppointments, color: 'bg-yellow-500' },
    { label: 'Total', value: totalAppointments, color: 'bg-primary' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{tenant.name}</h1>
              <p className="text-white/80 text-lg">Dashboard & Analytics</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Last Updated</p>
              <p className="text-white font-semibold">{new Date().toLocaleTimeString('en-ZA')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={totalAppointments}
            icon="📅"
            color="primary"
          />
          <StatCard
            title="Confirmed"
            value={confirmedAppointments}
            icon="✅"
            color="success"
          />
          <StatCard
            title="Pending"
            value={pendingAppointments}
            icon="⏳"
            color="warning"
          />
          <StatCard
            title="Active Services"
            value={activeServices}
            icon="💇"
            color="primary"
          />
        </div>

        {/* Revenue Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-xl p-8 text-white card-hover animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-lg mb-2">Total Revenue</p>
                <p className="text-5xl font-bold">R {revenueInRands.toFixed(2)}</p>
                <p className="text-white/70 text-sm mt-2">From confirmed bookings</p>
              </div>
              <div className="text-7xl">💰</div>
            </div>
          </div>
        </div>

        {/* Charts and Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart
            title="Appointment Status Overview"
            data={appointmentStatusData}
          />

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Confirmation Rate</p>
                  <p className="text-2xl font-bold text-green-700">
                    {totalAppointments > 0 ? Math.round((confirmedAppointments / totalAppointments) * 100) : 0}%
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Avg Revenue/Booking</p>
                  <p className="text-2xl font-bold text-blue-700">
                    R {confirmedAppointments > 0 ? (revenueInRands / confirmedAppointments).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="text-4xl">💵</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Service Utilization</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {((activeServices / 5) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <AppointmentTable appointments={recentAppointments} />

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Dashboard automatically refreshes every 30 seconds</p>
          <p className="mt-2">🔒 Secure Connection • 🌐 Powered by Cloudflare Edge Network</p>
        </div>
      </main>
    </div>
  )
}
