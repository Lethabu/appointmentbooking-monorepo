import { useState, useEffect } from 'react';

interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  service_name: string;
  scheduled_time: number;
  status: string;
  payment_status: string;
  created_at: number;
}

interface DashboardStats {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  upcomingBookings: Booking[];
  totalRevenue: number;
  activeServices: number;
  recentAppointments: Booking[];
}

export default function ModernSalonDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard?tenantId=${TENANT_ID}`);
        if (!response.ok) throw new Error('Failed to load dashboard');
        const data = await response.json();
        setStats(data.statistics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
    const interval = setInterval(loadDashboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `R${(amount / 100).toLocaleString('en-ZA')}`;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          emoji: '✅',
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          emoji: '⏳',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          emoji: '⏰',
        };
    }
  };

  const StatCard = ({
    title,
    value,
    emoji,
    color,
    trend,
  }: {
    title: string;
    value: string | number;
    emoji: string;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className="text-green-500 mr-1">📈</span>
              <span className="text-sm text-green-600 font-medium">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} text-2xl`}>
          {emoji}
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({
    appointment,
  }: {
    appointment: Booking;
  }) => {
    const statusConfig = getStatusConfig(appointment.status);

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {appointment.user_name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}
              >
                <span>{statusConfig.emoji}</span>
                {appointment.status}
              </span>
            </div>
            <p className="text-purple-600 font-medium mb-1">
              {appointment.service_name}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>📞</span>
                <a href={`tel:${appointment.user_phone}`} className="hover:underline">
                  {appointment.user_phone}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <span>⏰</span>
                {formatDate(appointment.scheduled_time)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <span>✏️</span>
            Edit
          </button>
          <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <span>✅</span>
            Confirm
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium flex items-center justify-center">
            <span>💬</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-purple-600">Salon</span> Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here&apos;s your salon overview
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              S
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Appointments"
              value={stats.totalAppointments}
              emoji="📅"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              trend="All time"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              emoji="💰"
              color="bg-gradient-to-r from-green-500 to-green-600"
              trend="From bookings"
            />
            <StatCard
              title="Active Services"
              value={stats.activeServices}
              emoji="✂️"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              trend="Available"
            />
            <StatCard
              title="Confirmed Today"
              value={stats.confirmedAppointments}
              emoji="✅"
              color="bg-gradient-to-r from-amber-500 to-amber-600"
              trend="Scheduled"
            />
          </div>
        )}

        {stats && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Today&apos;s Appointments
                    </h2>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {stats.recentAppointments.length} active
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.recentAppointments.slice(0, 5).map((appointment: Booking) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                    <span>💬</span>
                    Send WhatsApp Reminders
                  </button>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                    <span>📊</span>
                    View Analytics
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-lg font-bold">AI-Powered Features</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-white bg-opacity-20 rounded-lg">
                    <span className="text-xl">⚡</span>
                    <div>
                      <p className="font-medium">Smart Scheduling</p>
                      <p className="opacity-90">Optimal appointment placement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white bg-opacity-20 rounded-lg">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="font-medium">Auto Marketing</p>
                      <p className="opacity-90">WhatsApp campaigns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
