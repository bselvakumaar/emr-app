import { useState } from 'react';
import PatientSearch from '../components/PatientSearch.jsx';
import AppointmentActions from '../components/AppointmentActions.jsx';
import { patientName, userName } from '../utils/format.js';

export default function AppointmentsPage({
  activeUser,
  session,
  patients,
  providers,
  walkins,
  appointments,
  users,
  setView,
  setActivePatientId,
  onCreateAppointment,
  onCreateWalkin,
  onSelfAppointment,
  onConvertWalkin,
  onSetAppointmentStatus,
  onReschedule
}) {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'walkins'
  const isPatient = activeUser.role === 'Patient';

  return (
    <div className="appointments-intelligence-workspace">
      <div className="view-header-premium">
        <div className="header-labels">
          <div className="tab-switcher-premium">
            <button
              className={`tab-item-premium ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              Clinical Schedule
            </button>
            {!isPatient && (
              <button
                className={`tab-item-premium ${activeTab === 'walkins' ? 'active' : ''}`}
                onClick={() => setActiveTab('walkins')}
              >
                Reception Queue
              </button>
            )}
          </div>
          <h1>Scheduling <span>Intelligence</span> Hub</h1>
          <p>Coordinated resource planning and patient flow management</p>
        </div>
      </div>

      <div className="appointment-lattice-layout">
        <main className="booking-instrument-panel">
          {activeTab === 'appointments' && (
            <article className="oversight-section booking-card-premium">
              <div className="section-head-premium large">
                <div className="head-text">
                  <h3>{isPatient ? 'Secure Slot Reservation' : 'Coordinated Clinical Booking'}</h3>
                  <p>{isPatient ? 'Request a preferred encounter time with your physician' : 'Log a scheduled medical interaction in the central registry'}</p>
                </div>
              </div>

              <form className="medical-intake-form" onSubmit={isPatient ? onSelfAppointment : onCreateAppointment}>
                <div className="intake-grid">
                  {!isPatient && (
                    <div className="intake-section">
                      <h4>Patient Registry Context</h4>
                      <PatientSearch tenantId={session?.tenantId} />
                    </div>
                  )}

                  <div className="intake-section">
                    <h4>Logistics & Resource Allocation</h4>
                    <div className="input-field-premium">
                      <label>Assigned Clinical Provider</label>
                      <select name="providerId" required>
                        <option value="">Select Lead Physician</option>
                        {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="form-row-grid">
                      <div className="input-field-premium">
                        <label>Reserved Start Time</label>
                        <input name="start" type="datetime-local" required />
                      </div>
                      <div className="input-field-premium">
                        <label>Estimated Conclusion</label>
                        <input name="end" type="datetime-local" required />
                      </div>
                    </div>
                  </div>

                  <div className="intake-section">
                    <h4>Clinical Rationale</h4>
                    <div className="input-field-premium full">
                      <label>Encounter Objective</label>
                      <input name="reason" placeholder="Primary complaint or review objective..." required />
                    </div>
                  </div>
                </div>

                <div className="form-actions-premium">
                  <button type="submit" className="btn-primary-premium">
                    {isPatient ? 'Commit Reservation Request' : 'Authorize Schedule Entry'}
                  </button>
                </div>
              </form>
            </article>
          )}

          {activeTab === 'walkins' && !isPatient && (
            <article className="oversight-section admission-form-container">
              <div className="section-head-premium large">
                <div className="head-text">
                  <h3>Direct Reception Entry</h3>
                  <p>Immediate queue placement for unscheduled patient arrivals</p>
                </div>
              </div>

              <form className="medical-intake-form" onSubmit={onCreateWalkin}>
                <div className="intake-grid">
                  <div className="intake-section">
                    <h4>Temporary Identity</h4>
                    <div className="form-row-grid">
                      <div className="input-field-premium">
                        <label>Full Patient Name</label>
                        <input name="name" placeholder="Legal Identity" required />
                      </div>
                      <div className="input-field-premium">
                        <label>Verification Contact</label>
                        <input name="phone" placeholder="Emergency mobile" required />
                      </div>
                    </div>
                  </div>
                  <div className="intake-section">
                    <h4>Arrival Context</h4>
                    <div className="input-field-premium full">
                      <label>Immediate Clinical Objective</label>
                      <input name="reason" placeholder="Symptoms or service requested..." required />
                    </div>
                  </div>
                </div>
                <div className="form-actions-premium">
                  <button type="submit" className="btn-secondary-premium">Initialize Queue Status</button>
                </div>
              </form>
            </article>
          )}
        </main>

        <aside className="schedule-ledger-stack">
          <section className="oversight-section">
            <div className="section-head-premium">
              <div className="head-text">
                <h3>Daily Roster</h3>
                <p>{appointments.length} Confirmed Slots</p>
              </div>
              <div className="live-tag">REALTIME</div>
            </div>

            <div className="ledger-scroll-zone">
              {appointments.length === 0 ? (
                <div className="empty-observation">No clinical slots active for the current period.</div>
              ) : (
                appointments.sort((a, b) => new Date(a.start) - new Date(b.start)).map(a => (
                  <div key={a.id} className={`clinical-strip-card ${a.status}`}>
                    <div className="strip-time-block">
                      <strong>{new Date(a.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                      <span>{new Date(a.start).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="strip-body">
                      <div className="patient-link" onClick={() => { setActivePatientId(a.patientId); setView('patients'); }}>
                        {patientName(a.patientId, patients)}
                      </div>
                      <div className="provider-meta">with {userName(a.providerId, users)}</div>
                    </div>
                    <div className="strip-controls">
                      <AppointmentActions
                        appointment={a}
                        user={activeUser}
                        onStatus={(status) => onSetAppointmentStatus(a.id, status)}
                        onReschedule={() => onReschedule(a)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {!isPatient && (
            <section className="oversight-section queue-stack">
              <div className="section-head-premium">
                <div className="head-text">
                  <h3>Reception Queue</h3>
                  <p>{walkins.length} Unscheduled Arrivals</p>
                </div>
              </div>
              <div className="ledger-scroll-zone mini">
                {walkins.length === 0 ? (
                  <div className="empty-observation">Reception area cleared.</div>
                ) : (
                  walkins.map(w => (
                    <div key={w.id} className={`walkin-entry-card ${w.status}`}>
                      <div className="entry-glyph">{(w.name || 'P')[0]}</div>
                      <div className="entry-intel">
                        <strong>{w.name}</strong>
                        <span>{w.reason}</span>
                      </div>
                      <div className="entry-action">
                        {w.status !== 'converted' ? (
                          <button onClick={() => onConvertWalkin(w.id)} className="btn-mini-action">ADMIT</button>
                        ) : (
                          <span className="status-badge-mini">LOGGED</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
</div>
  );
}


