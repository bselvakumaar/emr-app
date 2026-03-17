import React from 'react';

export default function DashboardMetrics({ tenants, users, issues, tickets }) {
  return (
    <section className="vitals-monitor mb-10">
      <div className="vital-node vital-node--safe shadow-sm">
        <div className="flex justify-between items-start">
          <span className="vital-label">Active Tenants</span>
        </div>
        <span className="vital-value tabular-nums mt-1">{tenants}</span>
        <p className="text-[10px] font-black text-emerald-600 mt-2 uppercase tracking-tight">Facilities online</p>
      </div>
      <div className="vital-node shadow-sm" style={{ borderLeft: '4px solid #3b82f6' }}>
        <div className="flex justify-between items-start">
          <span className="vital-label">Global Users</span>
        </div>
        <span className="vital-value tabular-nums mt-1">{users}</span>
        <p className="text-[10px] font-black text-blue-600 mt-2 uppercase tracking-tight">Active accounts</p>
      </div>
      <div className="vital-node vital-node--critical shadow-sm">
        <div className="flex justify-between items-start">
          <span className="vital-label">Open Issues</span>
        </div>
        <span className="vital-value tabular-nums mt-1">{issues}</span>
        <p className="text-[10px] font-black text-rose-600 mt-2 uppercase tracking-tight">Requires attention</p>
      </div>
      <div className="vital-node vital-node--warning shadow-sm">
        <div className="flex justify-between items-start">
          <span className="vital-label">Pending Tickets</span>
        </div>
        <span className="vital-value tabular-nums mt-1">{tickets}</span>
        <p className="text-[10px] font-black text-amber-600 mt-2 uppercase tracking-tight">Awaiting support</p>
      </div>
    </section>
  );
}
