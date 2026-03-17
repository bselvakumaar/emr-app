import React, { useState } from 'react';

export default function TenantCreationForm({ onCreate }) {
  const [form, setForm] = useState({ name: '', domain: '', adminEmail: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onCreate(form);
    setForm({ name: '', domain: '', adminEmail: '' });
    setLoading(false);
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-2">Create New Tenant</h2>
      <form className="bg-white rounded-xl shadow p-6 grid gap-4 max-w-xl" onSubmit={handleSubmit}>
        <input
          className="border rounded p-2"
          name="name"
          placeholder="Tenant Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded p-2"
          name="domain"
          placeholder="Tenant Domain"
          value={form.domain}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded p-2"
          name="adminEmail"
          placeholder="Admin Email"
          type="email"
          value={form.adminEmail}
          onChange={handleChange}
          required
        />
        <button
          className="bg-blue-600 text-white rounded p-2 font-bold hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Tenant'}
        </button>
      </form>
    </section>
  );
}
