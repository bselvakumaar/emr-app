import MetricCard from '../components/MetricCard.jsx';
import { currency } from '../utils/format.js';

export default function DashboardPage({ metrics, activeUser }) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="view">
      <div className="welcome-banner">
        <div>
          <h3>Welcome back, {activeUser?.name || 'User'}</h3>
          <p>{today}</p>
        </div>
        <span className="welcome-badge">📊 Dashboard</span>
      </div>

      <div className="grid cards">
        <MetricCard label="Patients" value={metrics.patients} accent="accent-blue" icon="patients" />
        <MetricCard label="Appointments" value={metrics.appointments} accent="" icon="appointments" />
        <MetricCard label="Walk-ins" value={metrics.walkins} accent="accent-amber" icon="walkins" />
        <MetricCard label="Employees" value={metrics.employees} accent="accent-violet" icon="employees" />
        <MetricCard label="Revenue" value={currency(metrics.revenue)} accent="accent-rose" icon="revenue" />
      </div>
    </section>
  );
}
