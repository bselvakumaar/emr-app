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
    <section className="view mpi-workspace">
      <div className="workspace-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          className={`tab-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          🗂️ Master Patient Index
        </button>
        {activeUser.role !== 'Patient' && (
          <button
            className={`tab-btn ${activeView === 'register' ? 'active' : ''}`}
            onClick={() => setActiveView('register')}
          >
            ➕ Register New Patient
          </button>
        )}
      </div>

      <div className="mpi-layout" style={{ display: 'grid', gridTemplateColumns: activeView === 'list' ? '320px 1fr' : '1fr', gap: '1.5rem' }}>

        {activeView === 'list' && (
          <aside className="panel search-panel" style={{ height: 'fit-content' }}>
            <h4 className="section-title">Refine Search</h4>
            <PatientSearch
              tenantId={session?.tenantId}
              onSelect={(p) => setActivePatientId(p.id)}
              initialPatientId={activePatientId}
            />

            <div className="sidebar-list" style={{ marginTop: '1.5rem' }}>
              <h5 className="list-title">Recent Records</h5>
              {Array.isArray(patients) && patients.slice(0, 8).map(p => (
                <div
                  key={p.id}
                  className={`patient-card-mini ${activePatientId === p.id ? 'active' : ''}`}
                  onClick={() => setActivePatientId(p.id)}
                >
                  <div className="avatar">{(p.firstName || 'P')[0]}</div>
                  <div className="info">
                    <strong>{p.firstName} {p.lastName}</strong>
                    <span>MRN: {p.mrn}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        <main className="record-view">
          {activeView === 'register' && (
            <article className="panel registration-card">
              <div className="card-header">
                <h3>Patient Enrollment</h3>
                <p>Register a new digital patient record for the facility</p>
              </div>
              <form className="structured-form" onSubmit={onCreatePatient}>
                <div className="form-sections">
                  <div className="section-group">
                    <label>Personal Identity</label>
                    <div className="grid-3">
                      <div className="field"><input name="firstName" placeholder="First Name" required /></div>
                      <div className="field"><input name="lastName" placeholder="Last Name" required /></div>
                      <div className="field"><input name="dob" type="date" required /></div>
                      <div className="field">
                        <select name="gender" required>
                          <option value="">Gender</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="field"><input name="bloodGroup" placeholder="Blood Group (e.g. O+)" /></div>
                    </div>
                  </div>

                  <div className="section-group">
                    <label>Contact & Location</label>
                    <div className="grid-2">
                      <div className="field"><input name="phone" placeholder="Contact Number" required /></div>
                      <div className="field"><input name="email" placeholder="Email Address" /></div>
                      <div className="field" style={{ gridColumn: 'span 2' }}><input name="address" placeholder="Full Residential Address" /></div>
                    </div>
                  </div>

                  <div className="section-group">
                    <label>Clinical Baseline</label>
                    <div className="grid-2">
                      <div className="field"><input name="insurance" placeholder="Insurance Policy Number" /></div>
                      <div className="field"><input name="chronicConditions" placeholder="Chronic Conditions" /></div>
                      <div className="field" style={{ gridColumn: 'span 2' }}><input name="allergies" placeholder="Known Allergies (NKDA if none)" /></div>
                    </div>
                  </div>
                </div>
                <div className="form-footer" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="primary-btn">Finalize & Open Record</button>
                  <button type="button" className="secondary-btn" onClick={() => setActiveView('list')}>Discard</button>
                </div>
              </form>
            </article>
          )}

          {activeView === 'list' && activePatient && (
            <article className="panel active-record-panel">
              <div className="record-header">
                <div className="patient-identity">
                  <div className="record-avatar">{(activePatient.firstName || 'P')[0]}</div>
                  <div className="id-stack">
                    <h2>{activePatient.firstName} {activePatient.lastName}</h2>
                    <div className="meta-row">
                      <span className="mrn-badge">MRN: {activePatient.mrn}</span>
                      <span className="dot">•</span>
                      <span>{activePatient.gender}</span>
                      <span className="dot">•</span>
                      <span>{activePatient.dob ? (new Date().getFullYear() - new Date(activePatient.dob).getFullYear()) : 'N/A'} Years</span>
                    </div>
                  </div>
                </div>
                <div className="record-actions">
                  <button className="action-btn outline" onClick={() => onPrint('health-record')}>Export Healthcare Folder</button>
                </div>
              </div>

              <div className="record-dashboard">
                <div className="sidebar-stats">
                  <div className="stat-card">
                    <span className="label">Blood Group</span>
                    <strong className="val">{activePatient.bloodGroup || 'Not Checked'}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="label">Primary Contact</span>
                    <strong className="val">{activePatient.phone || 'N/A'}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="label">Insurance</span>
                    <strong className="val">{activePatient.insurance || 'Uninsured'}</strong>
                  </div>
                </div>

                <div className="clinical-alerts">
                  <div className="alert-box allergy">
                    <div className="alert-header">⚠️ Known Allergies</div>
                    <div className="alert-body">{activePatient.medicalHistory?.allergies || 'No Known Drug Allergies (NKDA)'}</div>
                  </div>
                  <div className="alert-box chronic">
                    <div className="alert-header">📋 Chronic Conditions</div>
                    <div className="alert-body">{activePatient.medicalHistory?.chronicConditions || 'None Recorded'}</div>
                  </div>
                </div>

                <div className="clinical-timeline">
                  <h4 className="timeline-title">Clinical Record Journal</h4>
                  {activeUser.role !== 'Patient' && (
                    <form className="quick-entry-form" onSubmit={onAddClinical}>
                      <select name="section">
                        <option value="caseHistory">Clinical Finding</option>
                        <option value="medications">Medications</option>
                        <option value="testReports">Diagnostics</option>
                      </select>
                      <input name="text" placeholder="Detail new clinical event or observation..." required />
                      <button type="submit">Log Entry</button>
                    </form>
                  )}

                  <div className="history-entries" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {clinicalRecords.length > 0 ? (
                      clinicalRecords.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((rec, idx) => (
                        <div key={idx} className="timeline-entry" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span className={`badge-section ${rec.section}`} style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', background: '#e2e8f0', color: '#475569' }}>
                              {rec.section === 'caseHistory' ? 'finding' : rec.section === 'testReports' ? 'diagnostic' : rec.section}
                            </span>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              {new Date(rec.created_at).toLocaleDateString()} {new Date(rec.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div style={{ fontSize: '13.5px', color: '#1e293b', lineHeight: '1.5' }}>
                            {rec.payload || rec.content || 'No details provided'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-journal-spot" style={{ textAlign: 'center', padding: '3rem 2rem', color: '#94a3b8', fontSize: '13px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
                        No facilities entries found for this record.<br />
                        Use the form above to log clinical observations.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeView === 'list' && !activePatient && (
            <div className="empty-state-placeholder">
              <div className="icon">🏥</div>
              <h3>Master Patient Index</h3>
              <p>Select a digital folder from the directory to review clinical summaries and diagnostic history.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .mpi-workspace .tab-btn { padding: 8px 16px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; border-radius: 8px; transition: 0.2s; }
        .mpi-workspace .tab-btn.active { color: #3b82f6; background: #eff6ff; }
        
        .section-title { font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 1rem; }
        .list-title { font-size: 11px; color: #64748b; margin-bottom: 0.75rem; font-weight: 700; color: #1e293b; }
        
        .patient-card-mini { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .patient-card-mini:hover { background: #f1f5f9; }
        .patient-card-mini.active { background: #eff6ff; border-color: #bfdbfe; }
        .patient-card-mini .avatar { width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; display: grid; place-items: center; font-weight: 700; color: #475569; font-size: 12px; }
        .patient-card-mini.active .avatar { background: #10b981; color: white; }
        .patient-card-mini .info { display: flex; flex-direction: column; line-height: 1.2; }
        .patient-card-mini .info strong { font-size: 13px; color: #0f172a; }
        .patient-card-mini .info span { font-size: 11px; color: #94a3b8; }

        .card-header { margin-bottom: 2rem; }
        .card-header h3 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
        .card-header p { font-size: 0.875rem; color: #64748b; margin-top: 4px; }
        
        .section-group { border-bottom: 1px solid #f1f5f9; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .section-group:last-child { border: none; }
        .section-group label { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .primary-btn { padding: 10px 24px; background: #10b981; color: white; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; }
        .secondary-btn { padding: 10px 24px; background: #f1f5f9; color: #475569; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; }

        .record-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 2rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 2rem; }
        .patient-identity { display: flex; align-items: center; gap: 1.5rem; }
        .record-avatar { width: 64px; height: 64px; background: #10b981; color: white; border-radius: 16px; display: grid; place-items: center; font-size: 24px; font-weight: 800; }
        .id-stack h2 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0; }
        .meta-row { display: flex; align-items: center; gap: 10px; color: #64748b; font-size: 14px; margin-top: 4px; }
        .mrn-badge { background: #ecfdf5; color: #059669; padding: 2px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; border: 1px solid #d1fae5; }
        .dot { color: #cbd5e1; }
        
        .record-dashboard { display: grid; grid-template-columns: 240px 1fr; gap: 2rem; }
        .sidebar-stats { display: flex; flex-direction: column; gap: 1rem; }
        .stat-card { background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .stat-card .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 4px; }
        .stat-card .val { font-size: 15px; color: #1e293b; }
        
        .clinical-alerts { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; grid-column: 2; margin-bottom: 2rem; }
        .alert-box { padding: 1rem; border-radius: 12px; border: 1px solid transparent; }
        .alert-box.allergy { background: #fff1f2; border-color: #fecaca; }
        .alert-box.chronic { background: #fffbeb; border-color: #fef3c7; }
        .alert-header { font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; }
        .allergy .alert-header { color: #e11d48; }
        .chronic .alert-header { color: #d97706; }
        .alert-body { font-size: 14px; font-weight: 600; color: #334155; }

        .badge-section.medications { background: #dbeafe !important; color: #1d4ed8 !important; }
        .badge-section.testReports { background: #fef3c7 !important; color: #d97706 !important; }

        .clinical-timeline { grid-column: 2; }
        .timeline-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
        .quick-entry-form { display: grid; grid-template-columns: 160px 1fr 100px; gap: 8px; margin-bottom: 1.5rem; background: #f1f5f9; padding: 10px; border-radius: 12px; }
        .quick-entry-form select, .quick-entry-form input { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; font-size: 13px; }
        .quick-entry-form button { background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }

        .empty-state-placeholder { text-align: center; padding: 6rem 2rem; background: #f8fafc; border-radius: 20px; border: 2px dashed #e2e8f0; }
        .empty-state-placeholder .icon { font-size: 4rem; margin-bottom: 1rem; }
        .empty-state-placeholder h3 { font-size: 1.25rem; color: #475569; margin-bottom: 0.5rem; }
        .empty-state-placeholder p { color: #94a3b8; max-width: 400px; margin: 0 auto; line-height: 1.6; }
      `}</style>
    </section>
  );
}
