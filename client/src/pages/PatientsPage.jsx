import { useState } from 'react';
import PatientSearch from '../components/PatientSearch.jsx';

export default function PatientsPage({
  activeUser,
  session,
  patients,
  activePatient,
  activePatientId,
  setActivePatientId,
  onCreatePatient,
  onAddClinical,
  onPrint
}) {
  const [activeView, setActiveView] = useState('list'); // 'list' | 'register'

  const clinicalRecords = activePatient?.medicalHistory?.clinicalRecords || [];

  return (
    <section className="view patients-workspace">
      <div className="workspace-header">
        <div className="tab-group premium-glass">
          <button
            className={`tab-link ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
          >
            <span className="icon">🗂️</span> Master Patient index
          </button>
          {activeUser.role !== 'Patient' && (
            <button
              className={`tab-link ${activeView === 'register' ? 'active' : ''}`}
              onClick={() => setActiveView('register')}
            >
              <span className="icon">➕</span> Registration
            </button>
          )}
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          </button>
        </div>
      </div>

      <div className="mpi-layout" style={{ display: 'grid', gridTemplateColumns: activeView === 'list' ? '320px 1fr' : '1fr', gap: '1.5rem' }}>

        {activeView === 'list' && (
          <aside className="panel search-card premium-glass">
            <div className="panel-inner">
              <h4 className="sidebar-subtitle">Directory Search</h4>
              <PatientSearch
                tenantId={session?.tenantId}
                onSelect={(p) => setActivePatientId(p.id)}
                initialPatientId={activePatientId}
              />

              <div className="sidebar-section">
                <h5 className="sidebar-subtitle">Frequent Visitors</h5>
                <div className="mini-patient-list">
                  {Array.isArray(patients) && patients.slice(0, 10).map(p => (
                    <div
                      key={p.id}
                      className={`mini-card ${activePatientId === p.id ? 'active' : ''}`}
                      onClick={() => setActivePatientId(p.id)}
                    >
                      <div className="mini-avatar">{(p.firstName || 'P')[0]}</div>
                      <div className="mini-info">
                        <strong>{p.firstName} {p.lastName}</strong>
                        <span>{p.mrn}</span>
                      </div>
                      {p.bloodGroup && <div className="mini-badge-bg">{p.bloodGroup}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        <main className="record-content">
          {activeView === 'register' && (
            <article className="panel registration-panel premium-glass">
              <div className="panel-header-rich">
                <div className="header-icon-box">📋</div>
                <div className="header-text">
                  <h3>New Patient Admission</h3>
                  <p>Ensure all demographic data is validated against legal ID</p>
                </div>
              </div>

              <form className="medical-form" onSubmit={onCreatePatient}>
                <div className="form-grid-premium">
                  <div className="form-section">
                    <h4 className="form-section-title">Identity & Demographics</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Given Name</label>
                        <input name="firstName" placeholder="John" required />
                      </div>
                      <div className="form-group">
                        <label>Surname</label>
                        <input name="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Birth Date</label>
                        <input name="dob" type="date" required />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" required>
                          <option value="">Select Gender</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Non-binary</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Blood Group</label>
                        <input name="bloodGroup" placeholder="e.g. AB+" />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="form-section-title">Communication & Emergency</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Mobile Number</label>
                        <input name="phone" placeholder="+91 00000 00000" required />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input name="email" type="email" placeholder="patient@example.com" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Residential Address</label>
                      <textarea name="address" placeholder="Full street address..." rows="2"></textarea>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="form-section-title">Clinical History Background</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Insurance Provider / Policy</label>
                        <input name="insurance" placeholder="Provider name & Policy #" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Chronic Conditions</label>
                        <input name="chronicConditions" placeholder="Hypertension, Asthma, etc." />
                      </div>
                      <div className="form-group">
                        <label>Critical Allergies</label>
                        <input name="allergies" placeholder="Penicillin, Peanuts, etc." className="danger-focus" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions-premium">
                  <button type="submit" className="save-btn-premium">Confirm Registration</button>
                  <button type="button" className="cancel-btn-premium" onClick={() => setActiveView('list')}>Cancel</button>
                </div>
              </form>
            </article>
          )}

          {activeView === 'list' && activePatient && (
            <article className="patient-full-record">
              <header className="patient-profile-card premium-glass">
                <div className="profile-left">
                  <div className="profile-avatar-large">
                    {(activePatient.firstName || 'P')[0]}
                    <div className="online-indicator"></div>
                  </div>
                  <div className="profile-details">
                    <div className="name-row">
                      <h2>{activePatient.firstName} {activePatient.lastName}</h2>
                      <span className="premium-mrn-badge">MRN-{activePatient.mrn}</span>
                    </div>
                    <div className="meta-info-row">
                      <div className="meta-item"><span>DOB:</span> <strong>{new Date(activePatient.dob).toLocaleDateString()}</strong></div>
                      <div className="meta-item"><span>Gender:</span> <strong>{activePatient.gender}</strong></div>
                      <div className="meta-item"><span>Age:</span> <strong>{activePatient.dob ? (new Date().getFullYear() - new Date(activePatient.dob).getFullYear()) : 'N/A'} Yrs</strong></div>
                    </div>
                  </div>
                </div>
                <div className="profile-right">
                  <button className="print-btn-premium" onClick={() => onPrint('health-record')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
                    Print Summary
                  </button>
                </div>
              </header>

              <div className="medical-dashboard-grid">
                <div className="vitals-column">
                  <div className="card-vitals blood-group">
                    <div className="v-header">
                      <span className="v-icon color-rose">🩸</span>
                      <span className="v-label">Serological Group</span>
                    </div>
                    <span className="v-value">{activePatient.bloodGroup || 'O+'}</span>
                    <div className="v-meta">Hematological compatibility verified</div>
                  </div>
                  <div className="card-vitals health-index">
                    <div className="v-header">
                      <span className="v-icon color-emerald">📈</span>
                      <span className="v-label">Clinical Stability</span>
                    </div>
                    <div className="v-value">Optimal</div>
                    <div className="mini-trend-graph">
                      <div className="trend-bar active" style={{ height: '40%' }}></div>
                      <div className="trend-bar active" style={{ height: '70%' }}></div>
                      <div className="trend-bar active" style={{ height: '90%' }}></div>
                      <div className="trend-bar active pulse" style={{ height: '85%' }}></div>
                    </div>
                  </div>
                  <div className="card-vitals insurance">
                    <div className="v-header">
                      <span className="v-icon color-blue">🛡️</span>
                      <span className="v-label">Institutional Cover</span>
                    </div>
                    <span className="v-value">{activePatient.insurance || 'Private'}</span>
                    <div className="v-meta">Verified Policy: ACT-5529</div>
                  </div>
                </div>

                <div className="clinical-summary-column">
                  <div className="alerts-grid">
                    <div className="alert-card allergy-alert">
                      <div className="alert-head">⚠️ KNOWN ALLERGIES</div>
                      <div className="alert-content">{activePatient.medicalHistory?.allergies || 'No Known Drug Allergies'}</div>
                    </div>
                    <div className="alert-card chronic-alert">
                      <div className="alert-head">📋 CHRONIC ILLNESS</div>
                      <div className="alert-content">{activePatient.medicalHistory?.chronicConditions || 'None Disclosed'}</div>
                    </div>
                  </div>

                  <div className="journal-container premium-glass">
                    <div className="journal-header">
                      <h3>Clinical Events Journal</h3>
                      {activeUser.role !== 'Patient' && (
                        <span className="clinical-count">{clinicalRecords.length} Entries</span>
                      )}
                    </div>

                    {activeUser.role !== 'Patient' && (
                      <form className="clinical-input-box" onSubmit={onAddClinical}>
                        <div className="input-row">
                          <select name="section" className="section-select">
                            <option value="caseHistory">General Observation</option>
                            <option value="medications">Prescription</option>
                            <option value="testReports">Lab/X-Ray Result</option>
                          </select>
                          <input name="text" placeholder="Start typing clinical note..." required />
                          <button type="submit" className="add-note-btn">POST NOTE</button>
                        </div>
                      </form>
                    )}

                    <div className="journal-feed">
                      {clinicalRecords.length > 0 ? (
                        clinicalRecords.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((rec, idx) => (
                          <div key={idx} className={`journal-entry ${rec.section}`}>
                            <div className="entry-head">
                              <span className="entry-tag">{rec.section}</span>
                              <span className="entry-date">{new Date(rec.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                            <div className="entry-body">
                              {rec.payload || rec.content || 'Medical entry content'}
                            </div>
                            <div className="entry-footer">
                              Logged by Facility System Unit
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-feed">
                          <div className="empty-icon">📂</div>
                          <p>Record is clean. Initial baseline check completed.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeView === 'list' && !activePatient && (
            <div className="record-empty-state">
              <div className="pulse-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <h3>Master Patient Index</h3>
              <p>Select a patient record from the sidebar to view detailed clinical history and manage admission details.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .patients-workspace { animation: fade-in 0.5s ease-out; }
        
        .workspace-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .tab-group { display: flex; padding: 4px; border-radius: 12px; background: rgba(255,255,255,0.5); }
        .tab-link { 
          padding: 10px 18px; border: none; background: transparent; color: #64748b; 
          font-size: 0.85rem; font-weight: 700; cursor: pointer; border-radius: 9px; 
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .tab-link.active { background: white; color: var(--tenant-primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .tab-link .icon { font-size: 1.1rem; }

        .refresh-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e2e8f0; background: white; color: #64748b; display: grid; place-items: center; cursor: pointer; transition: 0.2s; }
        .refresh-btn:hover { background: #f8fafc; color: var(--tenant-primary); border-color: var(--tenant-primary); }

        .sidebar-subtitle { font-size: 10px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.08em; font-weight: 800; margin-bottom: 1rem; }
        .sidebar-section { margin-top: 2rem; }
        
        .mini-patient-list { display: flex; flex-direction: column; gap: 4px; }
        .mini-card { 
          display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 12px; 
          cursor: pointer; transition: 0.2s; position: relative; border: 1px solid transparent;
        }
        .mini-card:hover { background: rgba(255,255,255,0.6); }
        .mini-card.active { background: white; border-color: #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.03); }
        .mini-avatar { width: 34px; height: 34px; border-radius: 10px; background: #f1f5f9; display: grid; place-items: center; font-weight: 800; color: #64748b; font-size: 13px; }
        .active .mini-avatar { background: var(--tenant-primary); color: white; }
        .mini-info { flex: 1; display: flex; flex-direction: column; }
        .mini-info strong { font-size: 13px; color: #1e293b; }
        .mini-info span { font-size: 11px; color: #94a3b8; }
        .mini-badge-bg { font-size: 10px; font-weight: 900; color: #94a3b8; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }

        .premium-glass { background: white; border-radius: 1.25rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        
        .panel-header-rich { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
        .header-icon-box { font-size: 2rem; background: #eff6ff; width: 60px; height: 60px; display: grid; place-items: center; border-radius: 16px; border: 1px solid #dbeafe; }
        .header-text h3 { margin: 0; font-size: 1.5rem; font-weight: 900; color: #0f172a; }
        .header-text p { margin: 4px 0 0; color: #64748b; font-size: 0.9rem; }

        .medical-form { display: flex; flex-direction: column; gap: 2rem; }
        .form-section-title { font-size: 12px; text-transform: uppercase; color: var(--tenant-primary); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
        .form-section-title::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem; }
        .form-group label { display: block; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px; text-transform: uppercase; }
        .form-group input, .form-group select, .form-group textarea { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
        .danger-focus:focus { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important; }
        
        .form-actions-premium { display: flex; gap: 1rem; margin-top: 1rem; }
        .save-btn-premium { background: var(--tenant-primary); color: white; padding: 12px 30px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
        .save-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3); }
        .cancel-btn-premium { background: #f1f5f9; color: #475569; padding: 12px 24px; border-radius: 12px; font-weight: 700; }

        .patient-profile-card { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .profile-left { display: flex; align-items: center; gap: 1.5rem; }
        .profile-avatar-large { 
          width: 80px; height: 80px; border-radius: 20px; background: var(--tenant-primary); 
          color: white; display: grid; place-items: center; font-size: 2rem; font-weight: 900; 
          position: relative; box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .online-indicator { position: absolute; bottom: -4px; right: -4px; width: 14px; height: 14px; background: #10b981; border: 3px solid white; border-radius: 50%; }
        .name-row { display: flex; align-items: center; gap: 1rem; }
        .name-row h2 { font-size: 1.75rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.02em; }
        .premium-mrn-badge { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.75rem; border: 1px solid #e2e8f0; }
        .meta-info-row { display: flex; gap: 1.5rem; margin-top: 8px; }
        .meta-item { font-size: 0.85rem; color: #64748b; }
        .meta-item span { margin-right: 4px; }
        .meta-item strong { color: #1e293b; }

        .print-btn-premium { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 12px; font-weight: 700; color: #475569; transition: 0.2s; }
        .print-btn-premium:hover { background: #f8fafc; color: var(--tenant-primary); border-color: var(--tenant-primary); }

        .vitals-column { display: flex; flex-direction: column; gap: 1rem; }
        .card-vitals { background: white; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 1.25rem; transition: 0.2s; position: relative; overflow: hidden; }
        .v-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .v-label { font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.05em; }
        .v-value { font-size: 1.15rem; font-weight: 900; color: #1e293b; line-height: 1; }
        .v-meta { font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin-top: 6px; }
        .color-rose { color: #f43f5e; }
        .color-emerald { color: #10b981; }
        .color-blue { color: #3b82f6; }
        
        .mini-trend-graph { position: absolute; bottom: 0; right: 8px; height: 40px; display: flex; align-items: flex-end; gap: 3px; opacity: 0.2; }
        .trend-bar { width: 4px; background: #10b981; border-radius: 2px 2px 0 0; }
        .trend-bar.pulse { animation: v-pulse 1.5s infinite; }
        @keyframes v-pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        .alerts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .alert-card { padding: 1.25rem; border-radius: 1.25rem; border: 1px solid transparent; }
        .allergy-alert { background: #fee2e2; border-color: #fecaca; }
        .chronic-alert { background: #fef3c7; border-color: #fef08a; }
        .alert-head { font-size: 10px; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 8px; }
        .allergy-alert .alert-head { color: #dc2626; }
        .chronic-alert .alert-head { color: #b45309; }
        .alert-content { font-size: 0.95rem; font-weight: 700; color: #334155; }

        .journal-header { padding: 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .journal-header h3 { margin: 0; font-size: 1rem; font-weight: 800; }
        .clinical-count { font-size: 0.75rem; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; color: #64748b; font-weight: 700; }

        .clinical-input-box { padding: 1rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .input-row { display: grid; grid-template-columns: 160px 1fr 120px; gap: 10px; }
        .section-select { border-radius: 10px; border: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; }
        .add-note-btn { background: var(--tenant-primary); color: white; border-radius: 10px; font-weight: 800; font-size: 0.8rem; }

        .journal-feed { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .journal-entry { padding: 1rem; border-radius: 1rem; background: #f9fafb; border: 1px solid #f1f5f9; position: relative; transition: 0.2s; }
        .journal-entry:hover { border-color: var(--tenant-primary); background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .entry-head { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
        .entry-tag { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; }
        .entry-date { font-size: 11px; color: #94a3b8; font-weight: 600; }
        .entry-body { font-size: 0.9rem; color: #1e293b; line-height: 1.6; font-weight: 500; }
        .entry-footer { margin-top: 1rem; font-size: 10px; color: #cbd5e1; font-weight: 700; text-transform: uppercase; }

        .journal-entry.medications { border-left: 4px solid #3b82f6; }
        .journal-entry.testReports { border-left: 4px solid #f59e0b; }
        .journal-entry.caseHistory { border-left: 4px solid var(--tenant-primary); }

        .record-empty-state { text-align: center; padding: 8rem 2rem; }
        .pulse-circle { width: 100px; height: 100px; border-radius: 50%; background: #f1f5f9; display: grid; place-items: center; margin: 0 auto 1.5rem; color: #94a3b8; }
        .record-empty-state h3 { font-size: 1.5rem; font-weight: 800; color: #475569; }
        .record-empty-state p { color: #94a3b8; max-width: 420px; margin: 8px auto 0; line-height: 1.6; }
      `}</style>
    </section>
  );
}
