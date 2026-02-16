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
      {!isPatient && (
        <div className="workspace-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Advance Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'walkins' ? 'active' : ''}`}
            onClick={() => setActiveTab('walkins')}
          >
            🚶 Walk-in Registration
          </button>
        </div>
      )}

      {activeTab === 'appointments' && !isPatient && (
        <article className="panel booking-engine">
          <div className="panel-header">
            <h3>Schedule Patient Appointment</h3>
            <p>Select a patient and assign a clinical provider</p>
          </div>
          <form className="structured-form" onSubmit={onCreateAppointment}>
            <div className="form-sections">
              <div className="section">
                <PatientSearch tenantId={session?.tenantId} />
              </div>
              <div className="section grid-inputs">
                <div className="field">
                  <label>Service Provider</label>
                  <select name="providerId" required>
                    <option value="">Select Doctor/Clinician</option>
                    {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Arrival Window (Start)</label>
                  <input name="start" type="datetime-local" required />
                </div>
                <div className="field">
                  <label>End Window</label>
                  <input name="end" type="datetime-local" required />
                </div>
              </div>
              <div className="section">
                <div className="field">
                  <label>Clinical Reason / Note</label>
                  <input name="reason" placeholder="e.g. Regular Checkup, Persistent Cough..." required />
                </div>
              </div>
            </div>
            <button type="submit" className="primary-submit-btn">
              Confirm & Book Appointment
            </button>
          </form>
        </article>
      )}

      {activeTab === 'walkins' && !isPatient && (
        <article className="panel booking-engine">
          <div className="panel-header">
            <h3>Quick Walk-in Entry</h3>
            <p>For patients without an immediate MRN or prior booking</p>
          </div>
          <form className="structured-form" onSubmit={onCreateWalkin}>
            <div className="form-sections">
              <div className="section grid-inputs">
                <div className="field">
                  <label>Full Name</label>
                  <input name="name" placeholder="Patient Name" required />
                </div>
                <div className="field">
                  <label>Phone Contact</label>
                  <input name="phone" placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="field">
                  <label>Primary Reason</label>
                  <input name="reason" placeholder="Brief reason for visit" required />
                </div>
              </div>
            </div>
            <button type="submit" className="secondary-submit-btn">
              Add to Active Queue
            </button>
          </form>
        </article>
      )}

      {isPatient && (
        <article className="panel booking-engine">
          <div className="panel-header">
            <h3>Self-Service Appointment</h3>
            <p>Request a time slot with your preferred provider</p>
          </div>
          <form className="structured-form" onSubmit={onSelfAppointment}>
            <div className="form-sections">
              <div className="section grid-inputs">
                <div className="field">
                  <label>Preferred Provider</label>
                  <select name="providerId" required>
                    <option value="">Choose your Doctor</option>
                    {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Requested Start</label>
                  <input name="start" type="datetime-local" required />
                </div>
                <div className="field">
                  <label>Requested End</label>
                  <input name="end" type="datetime-local" required />
                </div>
              </div>
              <div className="section">
                <div className="field">
                  <label>Reason for Visit</label>
                  <input name="reason" placeholder="Briefly describe your concern" required />
                </div>
              </div>
            </div>
            <button type="submit" className="primary-submit-btn">Submit Request</button>
          </form>
        </article>
      )}

      <div className="data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
        <article className="panel queue-card">
          <div className="panel-header-mini">
            <h4>Live Walk-in Queue</h4>
            <span className="badge">{walkins.length} Waiting</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="clinical-table">
              <thead><tr><th>Patient</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {walkins.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No active walk-ins</td></tr>
                )}
                {walkins.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{w.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{w.phone}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{w.reason}</td>
                    <td><span className={`badge-status ${w.status}`}>{w.status}</span></td>
                    <td>
                      {w.status !== 'converted' && !isPatient && (
                        <button className="mini-action-btn" onClick={() => onConvertWalkin(w.id)}>Convert</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel queue-card">
          <div className="panel-header-mini">
            <h4>Scheduled List</h4>
            <span className="badge">{appointments.length} Booked</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="clinical-table">
              <thead><tr><th>Time</th><th>Patient</th><th>Provider</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No appointments found</td></tr>
                )}
                {Array.isArray(appointments) && appointments.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontSize: '11px' }}>
                      {new Date(a.start).toLocaleDateString([], { month: 'short', day: 'numeric' })}<br />
                      <strong>{new Date(a.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                    </td>
                    <td><div
                      style={{ fontWeight: 600, fontSize: '13px', color: '#10b981', cursor: 'pointer' }}
                      onClick={() => { setActivePatientId(a.patientId); setView('patients'); }}
                    >
                      {patientName(a.patientId, patients)}
                    </div></td>
                    <td><div style={{ fontSize: '12px' }}>{userName(a.providerId, users)}</div></td>
                    <td><span className={`badge-status ${a.status}`}>{a.status}</span></td>
                    <td>
                      <AppointmentActions
                        appointment={a}
                        user={activeUser}
                        onStatus={(status) => onSetAppointmentStatus(a.id, status)}
                        onReschedule={() => onReschedule(a)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <style>{`
        .appointments-workspace .workspace-tabs .tab-btn {
          padding: 8px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; 
          color: #64748b; font-weight: 600; cursor: pointer; transition: 0.2s;
        }
        .appointments-workspace .workspace-tabs .tab-btn.active {
          background: #10b981; color: white; border-color: #059669; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }
        .panel-header { margin-bottom: 1.5rem; }
        .panel-header h3 { font-size: 1.25rem; color: #1e293b; margin-bottom: 0.25rem; }
        .panel-header p { font-size: 0.875rem; color: #64748b; }
        .structured-form .form-sections { display: flex; flex-direction: column; gap: 1rem; }
        .structured-form .grid-inputs { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .structured-form .field label { display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
        .primary-submit-btn { width: 100%; margin-top: 1.5rem; padding: 12px; background: #10b981; color: white; border-radius: 8px; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(16,185,129,0.3); }
        .secondary-submit-btn { width: 100%; margin-top: 1.5rem; padding: 12px; background: #3b82f6; color: white; border-radius: 8px; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(59,130,246,0.3); }
        .panel-header-mini { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
        .panel-header-mini h4 { margin: 0; font-size: 0.9rem; color: #475569; }
        .clinical-table { width: 100%; border-collapse: collapse; }
        .clinical-table th { text-align: left; padding: 8px 12px; font-size: 11px; color: #94a3b8; text-transform: uppercase; border-bottom: 2px solid #f8fafc; }
        .clinical-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .badge-status { padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; background: #f1f5f9; color: #64748b; }
        .badge-status.scheduled { background: #dbeafe; color: #2563eb; }
        .badge-status.waiting { background: #fef3c7; color: #d97706; }
        .badge-status.completed { background: #d1fae5; color: #059669; }
        .mini-action-btn { padding: 2px 8px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; font-size: 11px; cursor: pointer; }
      `}</style>
    </section>
  );
}
