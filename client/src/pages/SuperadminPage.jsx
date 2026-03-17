import { useState, useEffect } from 'react';
import { api } from '../api.js';
import DashboardMetrics from '../components/superadmin/DashboardMetrics.jsx';
import TenantList from '../components/superadmin/TenantList.jsx';
import TenantCreationForm from '../components/superadmin/TenantCreationForm.jsx';
import IssuesTable from '../components/superadmin/IssuesTable.jsx';
import TicketStatus from '../components/superadmin/TicketStatus.jsx';
import InfraUsage from '../components/superadmin/InfraUsage.jsx';


function SuperadminPage({ superOverview: propOverview, tenants = [], onCreateTenant, onCreateUser, issues = [], tickets = [], onResolveTicket, infra = {} }) {
  const superOverview = propOverview || {};
  // Example: issues, tickets, infra would be fetched or passed as props in a real app

  // Dashboard metrics
  const metrics = {
    tenants: superOverview?.totals?.tenants ?? 0,
    users: superOverview?.totals?.users ?? 0,
    issues: issues.length,
    tickets: tickets.length,
  };

  return (
    <div className="page-shell-premium animate-fade-in">
      <div className="page-header-premium mb-8">
        <div>
          <h1 className="flex items-center gap-3">
             Platform Services Dashboard
             <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-tighter font-black">Global Node</span>
          </h1>
          <p className="dim-label">Monitor global infrastructure and tenant operations across the platform.</p>
        </div>
      </div>

      <DashboardMetrics {...metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <TenantList tenants={tenants} onSelect={() => {}} />
          <IssuesTable issues={issues} />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <InfraUsage {...infra} />
          <TicketStatus tickets={tickets} onResolveTicket={onResolveTicket} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TenantCreationForm onCreate={onCreateTenant} />
        {/* User provisioning form can be modularized similarly if needed */}
      </div>
    </div>
  );
}

export default SuperadminPage;
