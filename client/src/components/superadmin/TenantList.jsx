import React from 'react';

export default function TenantList({ tenants, onSelect }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Active Tenants</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="text-xs text-gray-500 uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Domain</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant, i) => (
              <tr key={i} className="text-sm text-gray-700 text-center border-t">
                <td className="p-3">{tenant.name}</td>
                <td className="p-3">{tenant.domain}</td>
                <td className="p-3">{tenant.status}</td>
                <td className="p-3">{tenant.created}</td>
                <td className="p-3">
                  <button className="text-blue-600 hover:underline" onClick={() => onSelect(tenant)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
