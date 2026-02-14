import MetricCard from '../components/MetricCard.jsx';
import { currency } from '../utils/format.js';

export default function ReportsPage({ reportSummary }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Periodical</h3>
        <div className="grid cards">
          <MetricCard label="Daily Appointments" value={reportSummary?.periodical?.dailyAppointments || 0} />
          <MetricCard label="Open Appointments" value={reportSummary?.periodical?.openAppointments || 0} />
          <MetricCard label="Pending Invoices" value={reportSummary?.periodical?.pendingInvoices || 0} />
          <MetricCard label="Tax" value={currency(reportSummary?.tax?.totalTax || 0)} />
        </div>
      </article>
      <article className="panel">
        <h3>Monthly Comparison</h3>
        <table>
          <thead><tr><th>Month</th><th>Appointments</th><th>Revenue</th></tr></thead>
          <tbody>
            {(reportSummary?.monthlyComparison?.appointments || []).map((m) => {
              const rev = (reportSummary?.monthlyComparison?.revenue || []).find((r) => r.month === m.month);
              return <tr key={m.month}><td>{m.month}</td><td>{m.count}</td><td>{currency(rev?.amount || 0)}</td></tr>;
            })}
          </tbody>
        </table>
      </article>
    </section>
  );
}
