import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard.jsx';
import ComparisonChart from '../components/ComparisonChart.jsx';
import { currency } from '../utils/format.js';
import { api } from '../api.js';

export default function DashboardPage({ metrics, activeUser }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    loadReportData();
  }, []);

  async function loadReportData() {
    try {
      const tenantId = sessionStorage.getItem('emr_session') ? JSON.parse(sessionStorage.getItem('emr_session')).tenantId : null;
      if (tenantId) {
        const data = await api.getReportSummary(tenantId);
        setReportData(data);
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="view">
      <div className="welcome-banner">
        <div>
          <h3>Welcome back, {activeUser?.name || 'User'}</h3>
          <p>{today}</p>
        </div>
        <span className="welcome-badge">📊 Dashboard</span>
      </div>

      {/* Current Metrics */}
      <div className="grid cards">
        <MetricCard label="Patients" value={metrics.patients} accent="accent-blue" icon="patients" />
        <MetricCard label="Appointments" value={metrics.appointments} accent="" icon="appointments" />
        <MetricCard label="Walk-ins" value={metrics.walkins} accent="accent-amber" icon="walkins" />
        <MetricCard label="Employees" value={metrics.employees} accent="accent-violet" icon="employees" />
        <MetricCard label="Revenue" value={currency(metrics.revenue)} accent="accent-rose" icon="revenue" />
      </div>

      {/* Comparison Charts */}
      {!loading && reportData && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
            Performance Overview
          </h3>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Appointments Comparison */}
            <ComparisonChart
              title="Appointments Trend"
              data={reportData.monthlyComparison.appointments}
              dataKey="count"
              color="#0891b2"
              todayValue={reportData.periodical.dailyAppointments}
            />

            {/* Revenue Comparison */}
            <ComparisonChart
              title="Revenue Trend"
              data={reportData.monthlyComparison.revenue}
              dataKey="amount"
              color="#7c3aed"
              todayValue={metrics.revenue}
              formatValue={(val) => currency(val)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
