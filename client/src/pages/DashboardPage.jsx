import MetricCard from '../components/MetricCard.jsx';
import { currency } from '../utils/format.js';

export default function DashboardPage({ metrics }) {
  return (
    <section className="view">
      <div className="grid cards">
        <MetricCard label="Patients" value={metrics.patients} />
        <MetricCard label="Appointments" value={metrics.appointments} />
        <MetricCard label="Walk-ins" value={metrics.walkins} />
        <MetricCard label="Employees" value={metrics.employees} />
        <MetricCard label="Revenue" value={currency(metrics.revenue)} />
      </div>
    </section>
  );
}
