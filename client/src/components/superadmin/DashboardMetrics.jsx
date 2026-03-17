import React from 'react';

export default function DashboardMetrics({ tenants, users, issues, tickets }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Superadmin Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Active Tenants</div>
          <div className="text-2xl font-black text-blue-700">{tenants}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Total Users</div>
          <div className="text-2xl font-black text-blue-700">{users}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Open Issues</div>
          <div className="text-2xl font-black text-red-600">{issues}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Open Tickets</div>
          <div className="text-2xl font-black text-yellow-600">{tickets}</div>
        </div>
      </div>
    </section>
  );
}
