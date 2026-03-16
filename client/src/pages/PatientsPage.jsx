import { useState } from 'react';
import PatientSearch from '../components/PatientSearch.jsx';
import '../styles/critical-care.css';
import { 
  Users, 
  UserPlus, 
  Search, 
  History, 
  Printer, 
  Shield, 
  Activity, 
  ChevronRight,
  Database
} from 'lucide-react';

export default function PatientsPage({
  activeUser, session, patients, activePatient, activePatientId,
  setActivePatientId, onCreatePatient, onAddClinical, onPrint
}) {
  const [activeView, setActiveView] = useState('list'); // 'list' | 'register'
  const clinicalRecords = activePatient?.medicalHistory?.clinicalRecords || [];

  return (
    <div className="page-shell-premium animate-fade-in">
      {/* 1. SURGICAL CALM HEADER */}
      <div className="page-header-premium mb-8">
        <div>
          <h1 className="flex items-center gap-3">
             Master Clinical Registry
             <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-tighter font-black">Secure Database</span>
          </h1>
          <p className="dim-label">Centralized identity governance and longitudinal record management</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 shadow-sm gap-1">
          <button 
            className={`clinical-btn !min-h-[40px] px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveView('list')}
          >
            <Database className="w-3.5 h-3.5 mr-2" /> Master Registry
          </button>
          {activeUser.role !== 'Patient' && (
            <button 
              className={`clinical-btn !min-h-[40px] px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'register' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveView('register')}
            >
              <UserPlus className="w-3.5 h-3.5 mr-2" /> Admission Protocol
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: REGISTRY & SEARCH (High Clarity) */}
        {activeView === 'list' && (
          <aside className="col-span-12 lg:col-span-4 space-y-8">
            <article className="clinical-card">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Verification</h3>
                 <Search className="w-4 h-4 text-slate-300" />
              </div>
              <PatientSearch
                tenantId={session?.tenantId}
                onSelect={(p) => setActivePatientId(p.id)}
                initialPatientId={activePatientId}
              />
            </article>

            <article className="clinical-card p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Encounters</h3>
                <Clock className="w-4 h-4 text-slate-300" />
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {Array.isArray(patients) && patients.slice(0, 10).map((p, idx) => (
                  <button
                    key={p.id}
                    className={`w-full flex items-center gap-4 p-5 transition-all text-left border-l-4 ${activePatientId === p.id ? 'bg-emerald-50/50 border-emerald-500' : 'border-transparent hover:bg-slate-50/50'}`}
                    onClick={() => setActivePatientId(p.id)}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${activePatientId === p.id ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                      {(p.firstName || 'P')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-black truncate ${activePatientId === p.id ? 'text-emerald-900' : 'text-slate-700'}`}>{p.firstName} {p.lastName}</div>
                      <div className="text-[10px] text-slate-400 font-black tracking-[0.15em] mt-0.5 tabular-nums">MRN-{p.mrn}</div>
                    </div>
                    {p.bloodGroup && (
                      <div className="text-[10px] font-black px-2 py-1 rounded bg-white border border-slate-100 text-slate-500 uppercase">
                        {p.bloodGroup}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </article>
          </aside>
        )}

        {/* MAIN COLUMN: PROFILE OR ADMISSION */}
        <main className={`${activeView === 'list' ? 'col-span-12 lg:col-span-8' : 'col-span-12'}`}>
          {activeView === 'register' ? (
            <article className="clinical-card max-w-4xl mx-auto">
              <header className="mb-10 text-center">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <UserPlus className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Patient Admission Protocol</h2>
                 <p className="dim-label uppercase tracking-widest text-[10px] mt-2 font-black">Authorized Enrollment Registry</p>
              </header>

              <form className="space-y-10" onSubmit={onCreatePatient}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Step 01 / Identity</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">First Name</label>
                        <input name="firstName" className="input-field py-4 bg-slate-50 border-none rounded-xl" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Surname</label>
                        <input name="lastName" className="input-field py-4 bg-slate-50 border-none rounded-xl" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date of Birth</label>
                        <input name="dob" type="date" className="input-field py-4 bg-slate-50 border-none rounded-xl" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Gender</label>
                        <select name="gender" className="input-field h-[56px] bg-slate-50 border-none rounded-xl font-bold" required>
                          <option value="">Select...</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Step 02 / Config</h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Blood Group</label>
                      <input name="bloodGroup" className="input-field py-4 bg-slate-50 border-none rounded-xl" placeholder="ABO / Rh" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Contact</label>
                      <input name="phone" className="input-field py-4 bg-slate-50 border-none rounded-xl" placeholder="Emergency Mobile" required />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-50">
                  <button type="submit" className="clinical-btn bg-slate-900 text-white px-12 text-xs shadow-xl hover:bg-slate-800 transition-all rounded-2xl">Finalize Enrollment</button>
                  <button type="button" className="clinical-btn bg-white border border-slate-200 text-slate-400 px-8 text-xs hover:text-slate-600 transition-all rounded-2xl" onClick={() => setActiveView('list')}>Abort Protocol</button>
                </div>
              </form>
            </article>
          ) : activePatient ? (
            <div className="space-y-10">
              {/* PROFILE HEADER (Life-Saving Clarity) */}
              <header className="rounded-[32px] flex flex-col md:flex-row items-center justify-between bg-slate-900 relative overflow-hidden p-8 group shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px] transition-all group-hover:scale-110"></div>
                <div className="flex items-center gap-8 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                    {(activePatient.firstName || 'P')[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-2xl font-black text-white tracking-tight">{activePatient.firstName} {activePatient.lastName}</h2>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-emerald-400 tabular-nums">MRN-{activePatient.mrn}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-[10px] text-white/40 font-black uppercase tracking-[0.15em]">
                      <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> DOB: {new Date(activePatient.dob).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span>Gender: {activePatient.gender || 'NS'}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span className="text-emerald-500/80">{activePatient.insurance || 'Default Registry Node'}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="mt-6 md:mt-0 clinical-btn bg-white/5 border border-white/10 text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:border-emerald-500 transition-all shadow-md relative z-10" 
                  onClick={() => onPrint('health-record')}
                >
                  <Printer className="w-4 h-4 mr-3" /> Authorize Extract
                </button>
              </header>

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-10">
                  {/* CLINICAL JOURNAL (No-Click Information) */}
                  <article className="clinical-card">
                    <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest text-lg">Clinical Journal</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Longitudinal Healthcare Ledger</p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">{clinicalRecords.length} EVENT NODES</span>
                    </div>

                    <div>
                      {activeUser.role !== 'Patient' && (
                        <div className="mb-10 bg-slate-50 border border-slate-100 rounded-2xl p-1 shadow-inner focus-within:border-emerald-200 transition-all">
                          <form className="flex flex-col md:flex-row items-stretch md:items-center gap-2" onSubmit={onAddClinical}>
                            <select name="section" className="bg-white border-none text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-xl text-slate-600 focus:outline-none focus:ring-0 w-full md:w-44 cursor-pointer shadow-sm">
                              <option value="caseHistory">Observation</option>
                              <option value="medications">Prescription</option>
                              <option value="testReports">Lab Result</option>
                            </select>
                            <input name="text" className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm flex-1 px-6 py-4 placeholder-slate-400 font-medium" placeholder="Capture clinical findings..." required />
                            <div className="p-1 flex shrink-0">
                              <button type="submit" className="clinical-btn bg-slate-900 text-white px-8 !min-h-[44px] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">Commit Node</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-50">
                        {clinicalRecords.length > 0 ? (
                          clinicalRecords.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((rec, idx) => (
                            <div key={idx} className="relative pl-10 animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                              <div className="absolute left-2.5 w-1.5 h-1.5 rounded-full bg-slate-200 border border-white top-2 transition-colors group-hover:bg-emerald-500"></div>
                              <div className="clinical-card !p-5 bg-white hover:border-emerald-100 transition-all group">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{rec.section}</span>
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest tabular-nums">{new Date(rec.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                                <div className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                  {rec.payload || rec.content}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 flex flex-col items-center">
                            <Database className="w-10 h-10 text-slate-100 mb-4" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No clinical event logs detected.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </div>

                <aside className="col-span-12 lg:col-span-4 space-y-8">
                  <article className="clinical-card border-l-4 border-emerald-500 shadow-lg group hover:scale-[1.02] transition-transform">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Serology Profile</div>
                    <div className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums group-hover:text-emerald-600 transition-colors">{activePatient.bloodGroup || 'NA'}</div>
                    <div className="text-[10px] font-black text-emerald-600 mt-4 uppercase tracking-widest flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      Authorized Identity
                    </div>
                  </article>

                  <article className="clinical-card border-l-4 border-rose-500">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Sensitivity</h4>
                      <AlertCircle className="w-4 h-4 text-rose-300" />
                    </div>
                    <div className="space-y-6">
                      <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                        <div className="text-[10px] font-black text-rose-700 uppercase tracking-[0.2em] mb-2">Allergy Node</div>
                        <div className="text-[13px] font-bold text-rose-800 leading-relaxed">
                          {activePatient.medicalHistory?.allergies || 'No high-risk contraindications.'}
                        </div>
                      </div>
                      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                        <div className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-2">Pathological History</div>
                        <div className="text-[13px] font-bold text-amber-800 leading-relaxed">
                          {activePatient.medicalHistory?.chronicConditions || 'Clear baseline inventory.'}
                        </div>
                      </div>
                    </div>
                  </article>
                </aside>
              </div>
            </div>
          ) : (
            <article className="clinical-card h-full flex flex-col items-center justify-center py-40 text-center border-dashed border-2 bg-slate-50/10">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-100 mb-10 border border-slate-50">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Registry Open</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-4 font-medium leading-relaxed">Select an identity from the registry to initiate clinical oversight and ledger management.</p>
              <div className="mt-10 flex gap-4">
                 <div className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol V3.2</div>
                 <div className="px-5 py-2 bg-emerald-50 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure session</div>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}

function AlertCircle(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
