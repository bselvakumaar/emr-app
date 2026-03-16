import { useState, useMemo } from 'react';
import { api } from '../api';
import '../styles/critical-care.css';
import { 
  Bed, 
  Activity, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

export default function InpatientPage({ tenant, providers, onDischarge }) {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load active admissions on mount
  useMemo(() => {
    async function load() {
      if (!tenant?.id) return;
      setLoading(true);
      try {
        const data = await api.getEncounters(tenant.id);
        // Only active/open inpatient encounters
        setEncounters(data.filter(e => e.status === 'open' && (e.encounter_type === 'In-patient' || e.type === 'In-patient')));
      } catch (err) {
        console.error('Failed to load admissions', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tenant?.id]);

  const handleDischarge = async (encounterId) => {
    const confirm = window.confirm('AUTHORIZATION REQUIRED: Confirm medical and financial clearance for discharge?');
    if (!confirm) return;
    
    try {
      await api.dischargePatient(encounterId, { tenantId: tenant.id });
      setEncounters(prev => prev.filter(e => e.id !== encounterId));
      if (onDischarge) onDischarge();
    } catch (err) {
      alert('DISCHARGE LOCK: ' + err.message);
    }
  };

  const metrics = {
    active: encounters.length,
    pending: encounters.filter(e => !e.diagnosis).length,
    critical: encounters.filter(e => e.type === 'Emergency' || e.encounter_type === 'Emergency').length
  };

  return (
    <div className="page-shell-premium animate-fade-in">
      <div className="page-header-premium mb-8">
        <div>
          <h1 className="flex items-center gap-3">
             Ward Occupancy Registry
             <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-tighter font-black">Clinical Live Feed</span>
          </h1>
          <p className="dim-label">Active inpatient management and discharge clearance stabilization</p>
        </div>
        <div className="flex gap-4">
           {/* No-click critical counts */}
           <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-2 border-r border-slate-100">
                 <span className="vital-label">Active Census</span>
                 <span className="text-sm font-black tabular-nums">{metrics.active} Beds</span>
              </div>
              <div className="px-5 py-2">
                 <span className="vital-label">Discharge Pending</span>
                 <span className="text-sm font-black tabular-nums">{metrics.pending} Nodes</span>
              </div>
           </div>
        </div>
      </div>

      {/* VITALS RIBBON */}
      <section className="vitals-monitor mb-10">
        <div className="vital-node vital-node--safe shadow-sm">
           <div className="flex justify-between items-start">
              <span className="vital-label">Occupancy Velocity</span>
              <Bed className="w-4 h-4 text-emerald-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1">{((metrics.active / 20) * 100).toFixed(0)}%</span>
           <p className="text-[10px] font-black text-emerald-600 mt-2 uppercase">Institutional Load Target</p>
        </div>

        <div className="vital-node vital-node--warning shadow-sm">
           <div className="flex justify-between items-start">
              <span className="vital-label">Clinical Backlog</span>
              <Clock className="w-4 h-4 text-amber-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1">{metrics.pending}</span>
           <p className="text-[10px] font-black text-amber-600 mt-2 uppercase">Await assessment</p>
        </div>

        <div className="vital-node vital-node--critical shadow-sm">
           <div className="flex justify-between items-start">
              <span className="vital-label">Billing Blockers</span>
              <AlertTriangle className="w-4 h-4 text-rose-500 opacity-50" />
           </div>
           <span className="vital-value tabular-nums mt-1">02</span>
           <p className="text-[10px] font-black text-rose-600 mt-2 uppercase">Requires sync</p>
        </div>
      </section>

      <main className="clinical-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
           <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Admission Ledger</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Institutional Node Monitoring</p>
           </div>
           <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
              <Activity className="w-4 h-4" />
           </div>
        </div>

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th className="tracking-widest">Clinical Identity</th>
                <th className="tracking-widest">Temporal Node</th>
                <th className="tracking-widest">Vitals Shard</th>
                <th className="tracking-widest">Medical Clearance</th>
                <th style={{ textAlign: 'right' }} className="tracking-widest">Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-24 text-slate-300 italic font-medium">Syncing clinical feed...</td></tr>
              ) : encounters.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-24">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                      <Bed className="w-8 h-8 text-slate-300" />
                   </div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No active admissions detected.</p>
                </td></tr>
              ) : encounters.map((e, idx) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                  <td>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                          {(e.patient_name || 'P')[0]}
                       </div>
                       <div>
                          <div className="text-sm font-black text-slate-900">{e.patient_name || 'Clinical Subject'}</div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 tabular-nums">MRN-${(e.patient_id || 'X').slice(0, 8)}</div>
                       </div>
                    </div>
                  </td>
                  <td>
                     <div className="text-xs font-black text-slate-700 tabular-nums">{new Date(e.created_at || e.createdAt).toLocaleDateString()}</div>
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{(e.encounter_type || e.type)} node</div>
                  </td>
                  <td>
                     <div className="flex gap-3">
                        <div className="px-3 py-1 bg-slate-100 rounded-lg">
                           <span className="block text-[8px] font-black text-slate-400 uppercase">BP</span>
                           <span className="text-xs font-black text-slate-700 tabular-nums">{e.bp || '--'}</span>
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-lg">
                           <span className="block text-[8px] font-black text-slate-400 uppercase">HR</span>
                           <span className="text-xs font-black text-slate-700 tabular-nums">{e.hr || '--'}</span>
                        </div>
                     </div>
                  </td>
                  <td>
                     <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${e.diagnosis ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}></span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{e.diagnosis ? 'Verified Outcome' : 'Assessment Lag'}</span>
                     </div>
                  </td>
                  <td className="text-right">
                    <button 
                      className="clinical-btn !min-h-[40px] px-6 bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                      onClick={() => handleDischarge(e.id)}
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" /> Discharge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <div className="mt-10 p-8 clinical-card border-l-4 border-l-amber-500 flex items-start gap-6 bg-amber-50/20">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
           <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">Institutional Discharge Guideline</h4>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-4xl">
            Discharge authorization requires cross-verification of medical stability and financial clearance. Ensure all clinical trajectories are finalized and recorded in the health ledger before initiating the egress protocol. Post-discharge follow-ups should be scheduled within the Appointments Shard.
          </p>
        </div>
      </div>
    </div>
  );
}
