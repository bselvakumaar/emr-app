import React from 'react';

export default function InfraUsage({ cpu, memory, disk, network }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Infra Resource Usage</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">CPU</div>
          <div className="text-xl font-bold">{cpu}%</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Memory</div>
          <div className="text-xl font-bold">{memory}%</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Disk</div>
          <div className="text-xl font-bold">{disk}%</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Network</div>
          <div className="text-xl font-bold">{network}%</div>
        </div>
      </div>
    </section>
  );
}
