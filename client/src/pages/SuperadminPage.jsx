import MetricCard from '../components/MetricCard.jsx';
import { currency } from '../utils/format.js';

export default function SuperadminPage({ superOverview, tenants, onCreateTenant, onCreateUser }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Platform Overview</h3>
        <div className="grid cards">
          <MetricCard label="Tenants" value={superOverview?.totals?.tenants || 0} />
          <MetricCard label="Users" value={superOverview?.totals?.users || 0} />
          <MetricCard label="Patients" value={superOverview?.totals?.patients || 0} />
          <MetricCard label="Appointments" value={superOverview?.totals?.appointments || 0} />
        </div>
      </article>

      <article className="panel">
        <h3>Create Tenant</h3>
        <form className="form-grid" onSubmit={onCreateTenant}>
          <input name="name" placeholder="Tenant Name" required />
          <input name="code" placeholder="Code" required />
          <input name="subdomain" placeholder="Subdomain" required />
          <input name="primaryColor" type="color" defaultValue="#0f5a6e" />
          <input name="accentColor" type="color" defaultValue="#f57f17" />
          <button type="submit">Create Tenant</button>
        </form>
      </article>

      <article className="panel">
        <h3>All Tenants</h3>
        <table>
          <thead><tr><th>Tenant</th><th>Users</th><th>Patients</th><th>Appointments</th><th>Revenue</th></tr></thead>
          <tbody>{(superOverview?.tenants || []).map((t) => <tr key={t.tenantId}><td>{t.tenantName}</td><td>{t.users}</td><td>{t.patients}</td><td>{t.appointments}</td><td>{currency(t.revenue)}</td></tr>)}</tbody>
        </table>
      </article>

      <article className="panel">
        <h3>Create Tenant User</h3>
        <form className="form-grid" onSubmit={onCreateUser}>
          <select name="tenantId" required>{tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" required />
          <select name="role"><option>Admin</option><option>Doctor</option><option>Nurse</option><option>Front Office</option><option>Billing</option><option>Inventory</option><option>Patient</option></select>
          <button type="submit">Create User</button>
        </form>
      </article>
    </section>
  );
}
