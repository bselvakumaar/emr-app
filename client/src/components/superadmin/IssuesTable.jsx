import React from 'react';

export default function IssuesTable({ issues }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Issues Reported</h2>
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="text-xs text-gray-500 uppercase">
            <th className="p-3">Tenant</th>
            <th className="p-3">Title</th>
            <th className="p-3">Severity</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((iss, i) => (
            <tr key={i} className="text-sm text-gray-700 text-center border-t">
              <td className="p-3">{iss.tenant}</td>
              <td className="p-3">{iss.title}</td>
              <td className="p-3">{iss.severity}</td>
              <td className="p-3">{iss.status}</td>
              <td className="p-3">{iss.created}</td>
              <td className="p-3">{iss.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
