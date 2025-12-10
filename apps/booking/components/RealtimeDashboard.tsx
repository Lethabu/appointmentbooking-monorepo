'use client';

import { useEffect } from 'react';

// Mock analytics function
const trackEvent = (event: string, data: any) => {
  console.log('Analytics:', event, data);
};

export default function RealtimeDashboard() {
  useEffect(() => {
    // Track dashboard view event
    trackEvent('DashboardViewed', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Today&apos;s Bookings</h3>
          <div className="text-3xl font-bold text-blue-600">0</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Revenue</h3>
          <div className="text-3xl font-bold text-green-600">R0.00</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Active Clients</h3>
          <div className="text-3xl font-bold text-purple-600">0</div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display.</p>
      </div>
    </div>
  );
}