import React from 'react';

export default function TicketStatus({ tickets }) {
  const statusList = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Ticket Status & Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusList.map(status => (
          <div key={status} className="bg-white rounded-xl shadow p-4">
            <div className="font-bold text-sm mb-2">{status}</div>
            <div className="text-2xl font-black text-blue-700 mb-2">{tickets.filter(t => t.status === status).length}</div>
            <ul className="text-xs text-gray-600">
              {tickets.filter(t => t.status === status).map(t => <li key={t.id}>{t.title}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs font-bold mb-1">Overall Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(resolved / total) * 100}%` }}></div>
        </div>
      </div>
    </section>
  );
}
