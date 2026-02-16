import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard.jsx';
import api from '../api.js';
import { currency } from '../utils/format.js';

export default function ReportsPage({ reportSummary, tenant }) {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPayouts() {
      if (!tenant?.id) return;
      setLoading(true);
      try {
        const data = await api.getDoctorPayouts(tenant.id);
        setPayouts(data);
      } catch (err) {
        console.error("Failed to load payouts", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayouts();
  }, [tenant?.id]);

  return (
    <section className="view">
      <article className="panel">
        <h3>Periodical</h3>
        <div className="grid cards">
          <MetricCard label="Daily Appointments" value={reportSummary?.periodical?.dailyAppointments || 0} />
          <MetricCard label="Open Appointments" value={reportSummary?.periodical?.openAppointments || 0} />
          <MetricCard label="Pending Invoices" value={reportSummary?.periodical?.pendingInvoices || 0} />
          <MetricCard label="Tax Collected" value={currency(reportSummary?.tax?.totalTax || 0)} />
        </div>
      </article>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <article className="panel">
          <h3>Monthly Revenue Trend</h3>
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

        <article className="panel">
          <h3>Physician Performance & Payouts (30 Days)</h3>
          {loading ? <p>Loading...</p> : (
            <table className="payout-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Patients</th>
                  <th>Revenue</th>
                  <th>Commission (30%)</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length > 0 ? payouts.map(p => (
                  <tr key={p.doctor_id}>
                    <td>
                      <strong>{p.doctor_name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{p.role}</div>
                    </td>
                    <td>{p.patient_count}</td>
                    <td>{currency(p.total_revenue)}</td>
                    <td style={{ color: '#16a34a', fontWeight: 'bold' }}>{currency(p.estimated_commission)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>No revenue data found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </article>
      </div>

      <style>{`
        .payout-table td { vertical-align: middle; }
      `}</style>
    </section>
  );
}

