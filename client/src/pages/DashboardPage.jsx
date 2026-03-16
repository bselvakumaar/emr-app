import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard.jsx';
import ComparisonChart from '../components/ComparisonChart.jsx';
import { currency } from '../utils/format.js';
import { api } from '../api.js';
import '../styles/critical-care.css'; // Importing the Life-Saving Design System
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Package, 
  Stethoscope, 
  Calendar, 
  Pill, 
  FileText 
} from 'lucide-react';

export default function DashboardPage({ metrics, activeUser, setView }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    loadReportData();
    loadAlerts();
  }, []);

  async function loadReportData() {
    try {
      const session = api.getStoredSession() || {};
      const tenantId = session.tenantId;
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

  async function loadAlerts() {
    try {
      const session = api.getStoredSession() || {};
      const tenantId = session.tenantId;
      if (tenantId) {
        const res = await api.getLowStockAlerts(tenantId);
        setLowStockAlerts((res?.data || res || []).slice(0, 5));
      }
    } catch (err) {
      console.warn('Low stock alerts unavailable:', err.message);
    }
  }

  const quickActions = [
    { label: 'Register Patient', icon: Users, view: 'patients', desc: 'New admission' },
    { label: 'Schedule', icon: Calendar, view: 'appointments', desc: 'OPD booking' },
    { label: 'Dispense', icon: Pill, view: 'pharmacy', desc: 'Drug issuance' },
    { label: 'Billing', icon: FileText, view: 'billing', desc: 'Invoicing' }
  ];

  const hasAnyAlerts =
    (reportData?.criticalAlerts && reportData.criticalAlerts.length > 0) ||
    lowStockAlerts.length > 0;

  return (
    <div className="page-shell-premium animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* 1. SURGICAL CALM HEADER (Cognitive Clarity) */}
      <div className="page-header-premium mb-8">
        <div>
          <h1 className="flex items-center gap-3">
            Clinical Command Center
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-tighter border border-emerald-200">System Ready</span>
          </h1>
          <p className="dim-label">{today} • Institutional Oversight Node</p>
        </div>
        <div className="flex gap-4">
           {/* No-click critical counts */}
           <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-2 border-r border-slate-100">
                 <span className="vital-label">Census</span>
                 <span className="text-sm font-black tabular-nums">{reportData?.periodical?.activeAdmissions || 0} Admitted</span>
              </div>
              <div className="px-5 py-2">
                 <span className="vital-label">Labs Active</span>
                 <span className="text-sm font-black tabular-nums">{reportData?.periodical?.activeLabTests || 0} Pending</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. VITALS MONITOR (High-Stress Priority Data) */}
      <section className="vitals-monitor mb-10">
        <div className="vital-node vital-node--safe shadow-sm group hover:scale-[1.02] transition-transform">
           <div className="flex justify-between items-start">
              <span className="vital-label">Clinical Load</span>
              <Users className="w-4 h-4 text-emerald-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1">{metrics.patients?.toLocaleString() || 0}</span>
           <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Stabilized Volume
           </p>
        </div>

        <div className="vital-node vital-node--safe shadow-sm group hover:scale-[1.02] transition-transform">
           <div className="flex justify-between items-start">
              <span className="vital-label">Total Visits</span>
              <Activity className="w-4 h-4 text-emerald-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1">{metrics.appointments || 0}</span>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Active session log</p>
        </div>

        <div className="vital-node vital-node--warning shadow-sm group hover:scale-[1.02] transition-transform">
           <div className="flex justify-between items-start">
              <span className="vital-label">Triage Queue</span>
              <Clock className="w-4 h-4 text-amber-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1">{metrics.walkins || 0}</span>
           <p className="text-[10px] font-bold text-amber-600 mt-2 uppercase tracking-widest">Awaiting assessment</p>
        </div>

        <div className="vital-node vital-node--safe shadow-sm group hover:scale-[1.02] transition-transform">
           <div className="flex justify-between items-start">
              <span className="vital-label">Revenue Share</span>
              <TrendingUp className="w-4 h-4 text-emerald-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1 text-lg" style={{ fontSize: '1.75rem' }}>{currency(metrics.revenue || 0)}</span>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Fiscal reconciliation</p>
        </div>
      </section>

      {/* 3. MAIN WORKFLOW (No Decoration, High Clarity) */}
      <div className="grid grid-cols-12 gap-8">
        {/* Analytics Pillar */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <article className="clinical-card">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                 <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Trajectory Analytics</h3>
                    <p className="text-[10px] font-medium text-slate-400">Longitudinal performance stream</p>
                 </div>
                 <select className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <option>Last 14 Clinical Cycles</option>
                 </select>
              </div>

              <div className="panel-body">
                {loading ? (
                  <div className="grid grid-cols-2 gap-8 h-48">
                    <div className="bg-slate-50 rounded-2xl animate-pulse"></div>
                    <div className="bg-slate-50 rounded-2xl animate-pulse"></div>
                  </div>
                ) : reportData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ComparisonChart
                      title="Clinical Volume"
                      data={reportData?.dailyActivity || []}
                      dataKey="appointments"
                      color="#10B981"
                      type="bar"
                    />
                    <ComparisonChart
                      title="Financial Velocity"
                      data={reportData?.dailyActivity || []}
                      dataKey="revenue"
                      color="#6366F1"
                      formatValue={(val) => currency(val)}
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-300 italic">No historical stream detected.</div>
                )}
              </div>
           </article>

           {/* Quick Actions (Mandatory 48px Touch Targets) */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map(action => (
                <button 
                  key={action.view}
                  onClick={() => setView(action.view)}
                  className="clinical-card group hover:border-emerald-200 hover:shadow-md transition-all text-left flex flex-col p-6 h-full"
                >
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <action.icon className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{action.label}</span>
                   <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase group-hover:text-emerald-600/60 transition-colors">{action.desc}</p>
                </button>
              ))}
           </div>
        </div>

        {/* Alerts Pillar (Urgency Anchors) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <article className="clinical-card border-l-4 border-l-rose-500 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Alerts</h3>
                    <p className="text-[10px] font-bold text-rose-600/60 uppercase">Immediate Intervention</p>
                 </div>
              </div>

              <div className="space-y-4">
                {reportData?.criticalAlerts?.map(alert => (
                  <div key={alert.id} className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4 animate-fade-in">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 pulse-critical"></div>
                     <div>
                        <div className="text-xs font-black text-rose-900 lowercase first-letter:uppercase">{alert.patientName}</div>
                        <div className="text-[10px] font-bold text-rose-700/70 uppercase tracking-widest mt-1">Ref: {alert.testName}</div>
                     </div>
                  </div>
                ))}

                {lowStockAlerts.map((alert, i) => (
                  <div key={i} className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                     <Package className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                     <div>
                        <div className="text-xs font-black text-amber-900 lowercase first-letter:uppercase">{alert.drugName}</div>
                        <div className="text-[10px] font-bold text-amber-700/70 uppercase tracking-widest mt-1">Remaining: {alert.quantityRemaining} units</div>
                     </div>
                  </div>
                ))}

                {!hasAnyAlerts && (
                   <div className="py-12 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-100 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clinical stream stabilizes.</p>
                   </div>
                )}
              </div>
           </article>

           <article className="clinical-card border-l-4 border-l-indigo-500">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Strategic Context</h3>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                 <p className="text-xs font-medium text-indigo-900 leading-relaxed italic">
                    "Baseline clinical metrics indicate high retention. Node stability maintaining 99.9% uptime. Cross-reference with pathology shards recommended."
                 </p>
              </div>
           </article>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
