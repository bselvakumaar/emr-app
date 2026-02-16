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
    <section className="view appointments-workspace">
      <div className="workspace-header">
        <div className="tab-group premium-glass">
          <button
            className={`tab-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="icon">📅</span> Calendar Schedule
          </button>
          {!isPatient && (
            <button
              className={`tab-link ${activeTab === 'walkins' ? 'active' : ''}`}
              onClick={() => setActiveTab('walkins')}
            >
              <span className="icon">🚶</span> Reception Queue
            </button>
          )}
        </div>
      </div>

      <div className="appointment-main-grid">
        <div className="booking-column">
          {activeTab === 'appointments' && (
            <article className="panel booking-premium premium-glass">
              <div className="panel-header-rich">
                <div className="header-icon-box">🗓️</div>
                <div className="header-text">
                  <h3>{isPatient ? 'Request Clinical Slot' : 'Advance Booking'}</h3>
                  <p>{isPatient ? 'Choose your preferred physician and time' : 'Register a scheduled patient arrival'}</p>
                </div>
              </div>

              <form className="medical-form" onSubmit={isPatient ? onSelfAppointment : onCreateAppointment}>
                <div className="form-grid-premium">
                  {!isPatient && (
                    <div className="form-section">
                      <h4 className="form-section-title">Patient Selection</h4>
                      <PatientSearch tenantId={session?.tenantId} />
                    </div>
                  )}

                  <div className="form-section">
                    <h4 className="form-section-title">Schedule Information</h4>
                    <div className="form-group">
                      <label>Clinical Provider</label>
                      <select name="providerId" required>
                        <option value="">Select Practitioner</option>
                        {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Reserved From</label>
                        <input name="start" type="datetime-local" required />
                      </div>
                      <div className="form-group">
                        <label>Reserved To</label>
                        <input name="end" type="datetime-local" required />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="form-section-title">Interaction Context</h4>
                    <div className="form-group">
                      <label>Purpose of Visit</label>
                      <input name="reason" placeholder="Brief visit summary..." required />
                    </div>
                  </div>
                </div>

                <div className="form-actions-premium">
                  <button type="submit" className="save-btn-premium">
                    {isPatient ? 'Submit Case Request' : 'Confirm & Log Booking'}
                  </button>
                </div>
              </form>
            </article>
          )}

          {activeTab === 'walkins' && !isPatient && (
            <article className="panel booking-premium premium-glass">
              <div className="panel-header-rich">
                <div className="header-icon-box">⚡</div>
                <div className="header-text">
                  <h3>Direct Queue Entry</h3>
                  <p>Fast-track registration for non-appointment arrivals</p>
                </div>
              </div>

              <form className="medical-form" onSubmit={onCreateWalkin}>
                <div className="form-grid-premium">
                  <div className="form-section">
                    <h4 className="form-section-title">Demographics</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Patient Name</label>
                        <input name="name" placeholder="Legal Name" required />
                      </div>
                      <div className="form-group">
                        <label>Contact Contact</label>
                        <input name="phone" placeholder="+91 00000 00000" required />
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <h4 className="form-section-title">Reason</h4>
                    <div className="form-group">
                      <label>Primary Symptom / Activity</label>
                      <input name="reason" placeholder="e.g. Injury, Pharmacy Query..." required />
                    </div>
                  </div>
                </div>
                <div className="form-actions-premium">
                  <button type="submit" className="save-btn-premium walkin-purple">Add to Active Queue</button>
                </div>
              </form>
            </article>
          )}
        </div>

        <div className="visual-column">
          <article className="panel schedule-ledger premium-glass">
            <div className="ledger-header-rich">
              <div className="title-stack">
                <h4>Clinical Schedule</h4>
                <p>{appointments.length} Active Records</p>
              </div>
              <div className="pulse-indicator">LIVE</div>
            </div>

            <div className="premium-scroll-box">
              {appointments.length === 0 ? (
                <div className="empty-ledger">No clinical events booked for today.</div>
              ) : (
                appointments.sort((a, b) => new Date(a.start) - new Date(b.start)).map(a => (
                  <div key={a.id} className={`appointment-strip ${a.status}`}>
                    <div className="strip-time">
                      <strong>{new Date(a.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                      <span>{new Date(a.start).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="strip-main">
                      <div className="strip-patient" onClick={() => { setActivePatientId(a.patientId); setView('patients'); }}>
                        {patientName(a.patientId, patients)}
                      </div>
                      <div className="strip-provider">with {userName(a.providerId, users)}</div>
                    </div>
                    <div className="strip-actions">
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
          </article>

          {!isPatient && (
            <article className="panel walkin-ledger premium-glass" style={{ marginTop: '1.5rem' }}>
              <div className="ledger-header-rich">
                <div className="title-stack">
                  <h4>Walk-in Queue</h4>
                  <p>{walkins.length} Awaiting Care</p>
                </div>
              </div>
              <div className="premium-scroll-box mini">
                {walkins.length === 0 ? (
                  <div className="empty-ledger">Reception area is currently empty.</div>
                ) : (
                  walkins.map(w => (
                    <div key={w.id} className={`walkin-strip ${w.status}`}>
                      <div className="w-avatar">{(w.name || 'P')[0]}</div>
                      <div className="w-info">
                        <strong>{w.name}</strong>
                        <span>{w.reason}</span>
                      </div>
                      <div className="w-meta">
                        {w.status !== 'converted' ? (
                          <button onClick={() => onConvertWalkin(w.id)} className="convert-btn-micro">Admit</button>
                        ) : (
                          <span className="converted-tag">Admitted</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          )}
        </div>
      </div>

      <style>{`
        .appointments-workspace { animation: fade-in 0.5s ease-out; }
        .workspace-header { margin-bottom: 2rem; }
        .tab-group { display: flex; padding: 4px; border-radius: 12px; background: rgba(255,255,255,0.5); }
        .tab-link { 
          padding: 10px 18px; border: none; background: transparent; color: #64748b; 
          font-size: 0.85rem; font-weight: 700; cursor: pointer; border-radius: 9px; 
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .tab-link.active { background: white; color: var(--tenant-primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        .appointment-main-grid { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; align-items: start; }
        .premium-glass { background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        
        .panel-header-rich { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .header-icon-box { font-size: 1.75rem; background: #f0fdf4; width: 54px; height: 54px; display: grid; place-items: center; border-radius: 14px; border: 1px solid #dcfce7; }
        .header-text h3 { margin: 0; font-size: 1.35rem; font-weight: 900; color: #0f172a; }
        .header-text p { margin: 4px 0 0; color: #64748b; font-size: 0.85rem; }

        .booking-premium { padding: 2rem; }
        .medical-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-section-title { font-size: 11px; text-transform: uppercase; color: var(--tenant-primary); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 10px; }
        .form-section-title::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
        .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; }
        .form-group label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 6px; text-transform: uppercase; }
        .form-group input, .form-group select { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; width: 100%; border: 1px solid #e2e8f0; }

        .save-btn-premium { background: var(--tenant-primary); color: white; padding: 12px 30px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; width: 100%; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); transition: 0.2s; }
        .save-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3); }
        .walkin-purple { background: #7c3aed; box-shadow: 0 10px 20px rgba(124, 58, 237, 0.2); }

        .ledger-header-rich { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .ledger-header-rich h4 { margin: 0; font-size: 1rem; font-weight: 900; }
        .ledger-header-rich p { margin: 2px 0 0; font-size: 0.75rem; color: #94a3b8; font-weight: 700; }
        .pulse-indicator { font-size: 9px; font-weight: 900; color: #ef4444; background: #fee2e2; padding: 2px 8px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
        .pulse-indicator::before { content: ''; width: 6px; height: 6px; background: #ef4444; border-radius: 50%; animation: pulse 1s infinite; }

        .premium-scroll-box { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; max-height: 600px; overflow-y: auto; }
        .premium-scroll-box.mini { max-height: 300px; }
        .empty-ledger { text-align: center; padding: 3rem; color: #cbd5e1; font-size: 0.85rem; font-weight: 600; font-style: italic; }

        .appointment-strip { 
          display: flex; align-items: center; padding: 12px; border-radius: 14px; 
          background: #f9fafb; border: 1px solid #f1f5f9; transition: 0.2s;
        }
        .appointment-strip:hover { background: white; border-color: var(--tenant-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .strip-time { display: flex; flex-direction: column; width: 70px; flex-shrink: 0; line-height: 1.2; border-right: 1px solid #e2e8f0; margin-right: 12px; }
        .strip-time strong { font-size: 13px; color: #0f172a; }
        .strip-time span { font-size: 10px; color: #94a3b8; font-weight: 700; }
        .strip-main { flex: 1; }
        .strip-patient { font-weight: 800; font-size: 14px; color: var(--tenant-primary); cursor: pointer; }
        .strip-provider { font-size: 11px; color: #64748b; font-weight: 600; }

        .walkin-strip { display: flex; align-items: center; gap: 12px; padding: 10px; border-bottom: 1px solid #f8fafc; }
        .w-avatar { width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; display: grid; place-items: center; font-weight: 800; color: #64748b; font-size: 12px; flex-shrink: 0; }
        .active .w-avatar { background: #7c3aed; color: white; }
        .w-info { flex: 1; display: flex; flex-direction: column; }
        .w-info strong { font-size: 13px; color: #1e293b; }
        .w-info span { font-size: 11px; color: #94a3b8; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 180px; }
        .convert-btn-micro { padding: 4px 10px; border-radius: 6px; background: white; border: 1px solid #e2e8f0; color: #3b82f6; font-size: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .convert-btn-micro:hover { background: #3b82f6; color: white; border-color: #3b82f6; }
        .converted-tag { font-size: 10px; font-weight: 800; color: #10b981; text-transform: uppercase; }

        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
      `}</style>
    </section>
  );
}
