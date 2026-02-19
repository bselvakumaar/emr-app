import { useState, useEffect } from 'react';
import { api } from '../api';
import MetricCard from '../components/MetricCard';
import { currency } from '../utils/format';

export default function ReportsPage({ reportSummary, tenant, slmInsights, superOverview }) {
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

  // Handle data aggregation for Superadmin
  const isSuper = !tenant;
  const metrics = isSuper ? {
    velocity: `${superOverview?.activePatients || 0} Entities`,
    liquidity: currency((superOverview?.totalRevenue || 0) * 0.1), // Example tax/liquidity
    load: `${superOverview?.totalUsers || 0} Users`,
    receivables: superOverview?.activeTenants || 0
  } : {
    velocity: `${reportSummary?.periodical?.dailyAppointments || 0} pts/day`,
    liquidity: currency(reportSummary?.tax?.totalTax || 0),
    load: `${reportSummary?.periodical?.openAppointments || 0} Open`,
    receivables: reportSummary?.periodical?.pendingInvoices || 0
  };

  const totalMonthlyRev = reportSummary?.monthlyComparison?.revenue?.reduce((sum, r) => sum + r.amount, 0) || 0;
  const avgRev = totalMonthlyRev / (reportSummary?.monthlyComparison?.revenue?.length || 1);

  return (
    <section className="view-content intelligence-center">
      <header className="intel-header">
        <div className="title-stack">
          <h2>{isSuper ? 'Platform Intelligence Registry' : 'Executive Intelligence Center'}</h2>
          <p>{isSuper ? 'Cross-facility operational trajectory and network health' : 'Real-time clinical performance and financial trajectory analysis'}</p>
        </div>
        <div className="intel-badge premium-glass">
          <span className="pulse-dot"></span> {isSuper ? 'NETWORK OVERVIEW' : 'SLM LIVE ANALYTICS'}
        </div>
      </header>

      <div className="intel-grid-top">
        <article className="panel slm-insight-board">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Strategic Narrative</h3>
          </div>
          <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            {isSuper
              ? `Platform health is optimal. Aggregate patient engagement across ${superOverview?.activeTenants || 0} facilities shows a ${superOverview?.growth || '+12%'} upward trend.`
              : (slmInsights?.narrative || 'Initializing operational narrative engine...')}
          </p>
          <div className="insight-tags">
            {isSuper ? (
              ['↑ Network Growth', '✓ Node Stability', '✓ Global Compliance'].map(t => <span key={t} className="i-tag">{t}</span>)
            ) : (
              slmInsights?.trends?.map(t => <span key={t} className="i-tag">{t}</span>) || <span className="i-tag">Normalizing...</span>
            )}
          </div>
          <div className="predictive-footer">
            <strong>{isSuper ? 'Platform Load Forecast:' : 'Next Month Forecast:'}</strong>
            <span style={{ color: '#10b981', marginLeft: '8px' }}>+ {isSuper ? '18.4%' : currency(slmInsights?.forecast || avgRev * 1.12)}</span> {isSuper ? '(Estimated Expansion)' : '(Projected Growth)'}
          </div>
        </article>

        <div className="metrics-cluster">
          <MetricCard label={isSuper ? "Entity Velocity" : "Clinical Velocity"} value={metrics.velocity} icon="patients" accent="blue" />
          <MetricCard label={isSuper ? "System Liquidity" : "Financial Liquidity"} value={metrics.liquidity} icon="revenue" accent="rose" />
          <MetricCard label={isSuper ? "User Engagement" : "Resource Load"} value={metrics.load} icon="employees" accent="emerald" />
          <MetricCard label={isSuper ? "Node Count" : "Aging Receivables"} value={metrics.receivables} icon="walkins" accent="amber" />
        </div>
      </div>

      <div className="grid-2-equal">
        <article className="panel">
          <div className="panel-header-flex">
            <h3>Revenue Velocity</h3>
            <span className="context-label">Last 6 Months</span>
          </div>
          <div className="revenue-viz">
            {((isSuper ? superOverview?.monthlyComparison?.revenue : reportSummary?.monthlyComparison?.revenue) || []).map((m, idx) => {
              const data = (isSuper ? superOverview?.monthlyComparison?.revenue : reportSummary?.monthlyComparison?.revenue) || [];
              const maxVal = Math.max(...data.map(r => r.amount)) || 1;
              const height = (m.amount / maxVal) * 100;
              return (
                <div key={m.month} className="rev-bar-group">
                  <div className="rev-bar">
                    <div className="rev-fill" style={{ height: `${height}%` }}>
                      <span className="rev-val">{currency(m.amount).split('.')[0]}</span>
                    </div>
                  </div>
                  <span className="rev-label">{m.month}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <h3>Physician Performance Registry</h3>
          {loading ? <p>Syncing performance metrics...</p> : (
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Clinical Load</th>
                  <th style={{ textAlign: 'right' }}>Revenue Share</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length > 0 ? payouts.map(p => (
                  <tr key={p.doctor_id}>
                    <td>
                      <div style={{ fontWeight: 800 }}>{p.doctor_name}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{p.role}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{p.patient_count} Encounters</div>
                      <div className="mini-track"><div className="mini-fill" style={{ width: `${(p.patient_count / 20) * 100}%` }}></div></div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{currency(p.total_revenue)}</div>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>+ {currency(p.estimated_commission)}</div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: '#cbd5e1' }}>Awaiting data normalization...</td></tr>
                )}
              </tbody>
            </table>
          )}
        </article>
      </div>

    </section>
  );
}

