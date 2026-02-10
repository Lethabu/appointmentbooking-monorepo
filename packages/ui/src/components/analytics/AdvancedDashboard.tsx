'use client';

import { useState, useEffect } from 'react';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface RevenueData {
  month: string;
  revenue: number;
  appointments: number;
}

interface AppointmentData {
  day: string;
  completed: number;
  cancelled: number;
  noShow: number;
}

interface ServiceData {
  name: string;
  bookings: number;
  revenue: number;
}

interface CustomerData {
  type: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  revenue: RevenueData[];
  appointments: AppointmentData[];
  services: ServiceData[];
  customers: CustomerData[];
}

export default function AdvancedDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: [],
    appointments: [],
    services: [],
    customers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        revenue: [
          { month: 'Jan', revenue: 12000, appointments: 45 },
          { month: 'Feb', revenue: 15000, appointments: 52 },
          { month: 'Mar', revenue: 18000, appointments: 61 },
          { month: 'Apr', revenue: 16000, appointments: 58 },
          { month: 'May', revenue: 22000, appointments: 73 },
          { month: 'Jun', revenue: 25000, appointments: 82 },
        ],
        appointments: [
          { day: 'Mon', completed: 12, cancelled: 2, noShow: 1 },
          { day: 'Tue', completed: 15, cancelled: 1, noShow: 0 },
          { day: 'Wed', completed: 18, cancelled: 3, noShow: 2 },
          { day: 'Thu', completed: 14, cancelled: 1, noShow: 1 },
          { day: 'Fri', completed: 20, cancelled: 2, noShow: 1 },
          { day: 'Sat', completed: 25, cancelled: 4, noShow: 2 },
          { day: 'Sun', completed: 8, cancelled: 1, noShow: 0 },
        ],
        services: [
          { name: 'Hair Cut', bookings: 120, revenue: 18000 },
          { name: 'Hair Color', bookings: 85, revenue: 25500 },
          { name: 'Hair Treatment', bookings: 65, revenue: 19500 },
          { name: 'Styling', bookings: 95, revenue: 14250 },
          { name: 'Extensions', bookings: 35, revenue: 28000 },
        ],
        customers: [
          { type: 'New', count: 45, percentage: 30 },
          { type: 'Returning', count: 85, percentage: 56.7 },
          { type: 'VIP', count: 20, percentage: 13.3 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const totalRevenue = analyticsData.revenue.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalAppointments = analyticsData.revenue.reduce(
    (sum, item) => sum + item.appointments,
    0,
  );
  const avgRevenuePerAppointment = totalRevenue / totalAppointments;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border rounded-md">
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>Last month</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Total Revenue</h3>
            <div className="text-blue-500">💰</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            R{totalRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-green-600">+12.5% from last period</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Total Appointments</h3>
            <div className="text-green-500">📅</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{totalAppointments}</div>
          <p className="text-sm text-green-600">+8.2% from last period</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Avg Revenue/Appointment</h3>
            <div className="text-purple-500">📈</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            R{Math.round(avgRevenuePerAppointment)}
          </div>
          <p className="text-sm text-green-600">+3.8% from last period</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Customer Retention</h3>
            <div className="text-orange-500">👥</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">73.2%</div>
          <p className="text-sm text-green-600">+5.1% from last period</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">
            Revenue Trends
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Appointments
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Service Performance
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Customer Analysis
          </button>
        </div>

        {/* Revenue Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue & Appointments Over Time</h3>
          <p className="text-gray-600 mb-6">Monthly revenue and appointment trends</p>

          <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600">Interactive chart would be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">
                Revenue: {analyticsData.revenue.map(item => `${item.month}: R${item.revenue}`).join(' | ')}
              </p>
            </div>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Appointment Status</h3>
          <p className="text-gray-600 mb-6">Completed, cancelled, and no-show appointments by day</p>

          <div className="grid grid-cols-7 gap-4">
            {analyticsData.appointments.map((day, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-500 text-white rounded-t p-2 font-semibold">{day.day}</div>
                <div className="bg-blue-100 p-2">
                  <div className="text-xs text-gray-600">Completed</div>
                  <div className="font-bold text-blue-700">{day.completed}</div>
                </div>
                <div className="bg-red-100 p-2">
                  <div className="text-xs text-gray-600">Cancelled</div>
                  <div className="font-bold text-red-700">{day.cancelled}</div>
                </div>
                <div className="bg-yellow-100 p-2 rounded-b">
                  <div className="text-xs text-gray-600">No Show</div>
                  <div className="font-bold text-yellow-700">{day.noShow}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Performance */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Service Performance</h3>
          <p className="text-gray-600 mb-6">Revenue and booking count by service type</p>

          <div className="space-y-4">
            {analyticsData.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">R{service.revenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Distribution */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Distribution</h3>
          <p className="text-gray-600 mb-6">Breakdown of customer types</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.customers.map((customer, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">
                  {customer.type === 'New' ? '🆕' : customer.type === 'Returning' ? '🔄' : '⭐'}
                </div>
                <div className="text-2xl font-bold text-gray-900">{customer.count}</div>
                <div className="text-sm text-gray-600">{customer.type} Customers</div>
                <div className="text-lg font-semibold text-blue-600">{customer.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
