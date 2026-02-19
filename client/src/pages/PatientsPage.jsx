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
    <div className="patients-intelligence-workspace">
      <div className="view-header-premium">
        <div className="header-labels">
          <div className="tab-switcher-premium">
            <button
              className={`tab-item-premium ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
            >
              Master Registry
            </button>
            {activeUser.role !== 'Patient' && (
              <button
                className={`tab-item-premium ${activeView === 'register' ? 'active' : ''}`}
                onClick={() => setActiveView('register')}
              >
                Inpatient Admission
              </button>
            )}
          </div>
          <h1>Clinical <span>Registry</span> Management</h1>
          <p>Real-time synchronization with Central Medical Database</p>
        </div>
      </div>

      <div className={`mpi-oversight-layout ${activeView === 'list' ? 'with-sidebar' : 'full'}`}>

        {activeView === 'list' && (
          <aside className="side-search-stack">
            <section className="oversight-section search-context">
              <div className="section-head-premium">
                <div className="head-text">
                  <h3>Directory Search</h3>
                  <p>Global patient lookup</p>
                </div>
              </div>
              <div className="search-context-body">
                <PatientSearch
                  tenantId={session?.tenantId}
                  onSelect={(p) => setActivePatientId(p.id)}
                  initialPatientId={activePatientId}
                />
              </div>
            </section>

            <section className="oversight-section">
              <div className="section-head-premium">
                <div className="head-text">
                  <h3>Recent Encounters</h3>
                  <p>Fast-track record access</p>
                </div>
              </div>
              <div className="mini-patient-feed">
                {Array.isArray(patients) && patients.slice(0, 10).map(p => (
                  <div
                    key={p.id}
                    className={`mini-clinical-card ${activePatientId === p.id ? 'active' : ''}`}
                    onClick={() => setActivePatientId(p.id)}
                  >
                    <div className="card-avatar">{(p.firstName || 'P')[0]}</div>
                    <div className="card-intel">
                      <strong>{p.firstName} {p.lastName}</strong>
                      <span className="mrn-label">MRN-{p.mrn}</span>
                    </div>
                    {p.bloodGroup && <div className="card-badge">{p.bloodGroup}</div>}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        )}

        <main className="clinical-record-viewport">
          {activeView === 'register' && (
            <article className="oversight-section admission-form-container">
              <div className="section-head-premium large">
                <div className="head-text">
                  <h3>Patient Admission Protocol</h3>
                  <p>Standardized clinical intake form for facility registry</p>
                </div>
              </div>

              <form className="medical-intake-form" onSubmit={onCreatePatient}>
                <div className="intake-grid">
                  <div className="intake-section">
                    <h4>Legal Identity & Demographics</h4>
                    <div className="form-row-grid">
                      <div className="input-field-premium">
                        <label>Legal First Name</label>
                        <input name="firstName" placeholder="Admission record name" required />
                      </div>
                      <div className="input-field-premium">
                        <label>Legal Surname</label>
                        <input name="lastName" placeholder="Family identifier" required />
                      </div>
                    </div>
                    <div className="form-row-grid tri">
                      <div className="input-field-premium">
                        <label>Date of Birth</label>
                        <input name="dob" type="date" required />
                      </div>
                      <div className="input-field-premium">
                        <label>Clinical Gender</label>
                        <select name="gender" required>
                          <option value="">Identity</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="input-field-premium">
                        <label>Blood Type</label>
                        <input name="bloodGroup" placeholder="ABO / Rh" />
                      </div>
                    </div>
                  </div>

                  <div className="intake-section">
                    <h4>Contact & Clinical Cover</h4>
                    <div className="form-row-grid">
                      <div className="input-field-premium">
                        <label>Primary Contact</label>
                        <input name="phone" placeholder="Emergency mobile" required />
                      </div>
                      <div className="input-field-premium">
                        <label>Email Communication</label>
                        <input name="email" type="email" placeholder="Portal access email" />
                      </div>
                    </div>
                    <div className="input-field-premium full">
                      <label>Verification of Coverage</label>
                      <input name="insurance" placeholder="Insurance carrier & policy number" />
                    </div>
                  </div>
                </div>

                <div className="form-actions-premium">
                  <button type="submit" className="btn-primary-premium">Finalize Admission</button>
                  <button type="button" className="btn-ghost-premium" onClick={() => setActiveView('list')}>Abort</button>
                </div>
              </form>
            </article>
          )}

          {activeView === 'list' && activePatient && (
            <div className="clinical-profile-stack">
              <header className="oversight-section profile-header-premium">
                <div className="profile-identity">
                  <div className="profile-glyph">
                    {(activePatient.firstName || 'P')[0]}
                  </div>
                  <div className="profile-labels">
                    <div className="name-cluster">
                      <h2>{activePatient.firstName} {activePatient.lastName}</h2>
                      <span className="clinical-id-badge">MRN-{activePatient.mrn}</span>
                    </div>
                    <p className="meta-stats">
                      <span>Born: <strong>{new Date(activePatient.dob).toLocaleDateString()}</strong></span>
                      <span className="divider">/</span>
                      <span>Gender: <strong>{activePatient.gender}</strong></span>
                      <span className="divider">/</span>
                      <span>Age: <strong>{activePatient.dob ? (new Date().getFullYear() - new Date(activePatient.dob).getFullYear()) : 'N/A'}</strong></span>
                    </p>
                  </div>
                </div>
                <div className="profile-controls">
                  <button className="btn-action-premium" onClick={() => onPrint('health-record')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
                    Abstract Generation
                  </button>
                </div>
              </header>

              <div className="clinical-dashboard-content">
                <div className="vital-oversight-column">
                  <div className="vital-intel-card pulse">
                    <span className="v-label">Serology</span>
                    <span className="v-value">{activePatient.bloodGroup || 'N/A'}</span>
                    <p>Verified Compatibility</p>
                  </div>
                  <div className="vital-intel-card">
                    <span className="v-label">Condition Coverage</span>
                    <span className="v-value smaller">{activePatient.insurance || 'Private'}</span>
                    <p>Institutional Protocol Active</p>
                  </div>
                </div>

                <main className="clinical-journal-stack">
                  <div className="medical-alert-zone">
                    <div className="zone-card danger">
                      <h6>Allergy Constraints</h6>
                      <p>{activePatient.medicalHistory?.allergies || 'No high-risk allergies detected'}</p>
                    </div>
                    <div className="zone-card warning">
                      <h6>Pathological History</h6>
                      <p>{activePatient.medicalHistory?.chronicConditions || 'Baseline physiological status'}</p>
                    </div>
                  </div>

                  <section className="oversight-section journal-view">
                    <div className="section-head-premium">
                      <div className="head-text">
                        <h3>Clinical Journal</h3>
                        <p>Longitudinal medical encounters</p>
                      </div>
                      <span className="entry-ticker">{clinicalRecords.length} Events</span>
                    </div>

                    {activeUser.role !== 'Patient' && (
                      <div className="journal-input-premium">
                        <form className="note-capture-form" onSubmit={onAddClinical}>
                          <select name="section">
                            <option value="caseHistory">Observation</option>
                            <option value="medications">Prescription</option>
                            <option value="testReports">Diagnostic Report</option>
                          </select>
                          <input name="text" placeholder="Capture clinical encounter details..." required />
                          <button type="submit">COMMIT</button>
                        </form>
                      </div>
                    )}

                    <div className="journal-timeline-feed">
                      {clinicalRecords.length > 0 ? (
                        clinicalRecords.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((rec, idx) => (
                          <div key={idx} className={`timeline-entry ${rec.section}`}>
                            <div className="entry-marker"></div>
                            <div className="entry-header">
                              <span className="tag">{rec.section}</span>
                              <span className="timestamp">{new Date(rec.created_at).toLocaleString()}</span>
                            </div>
                            <div className="entry-payload">
                              {rec.payload || rec.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-observation">
                          <p>Record is clean. Sequential tracking initialized.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </main>
              </div>
            </div>
          )}

          {activeView === 'list' && !activePatient && (
            <div className="registry-empty-state">
              <div className="glyph-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <h3>Master Registry Idle</h3>
              <p>Select a clinical identity from the master patient index to initiate record oversight or medical abstract generation.</p>
            </div>
          )}
        </main>
      </div>
</div>
  );
}


