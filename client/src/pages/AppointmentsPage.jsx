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
  onCreateAppointment,
  onCreateWalkin,
  onSelfAppointment,
  onConvertWalkin,
  onSetAppointmentStatus,
  onReschedule
}) {
  return (
    <section className="view">
      {activeUser.role !== 'Patient' && (
        <article className="panel">
          <h3>Staff Appointment + Walk-in Workflow</h3>
          <form className="form-grid" onSubmit={onCreateAppointment}>
            <select name="patientId" required>{patients.map((p) => <option key={p.id} value={p.id}>{p.mrn} - {p.firstName}</option>)}</select>
            <select name="providerId" required>{providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input name="start" type="datetime-local" required />
            <input name="end" type="datetime-local" required />
            <input name="reason" placeholder="Reason" required />
            <button type="submit">Create Appointment</button>
          </form>
          <form className="form-grid" style={{ marginTop: '0.6rem' }} onSubmit={onCreateWalkin}>
            <input name="name" placeholder="Walk-in Name" required />
            <input name="phone" placeholder="Phone" required />
            <input name="reason" placeholder="Visit Reason" required />
            <button type="submit">Add Walk-in</button>
          </form>
        </article>
      )}

      {activeUser.role === 'Patient' && (
        <article className="panel">
          <h3>Patient Self Appointment</h3>
          <form className="form-grid" onSubmit={onSelfAppointment}>
            <select name="providerId" required>{providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input name="start" type="datetime-local" required />
            <input name="end" type="datetime-local" required />
            <input name="reason" placeholder="Reason" required />
            <button type="submit">Request Appointment</button>
          </form>
        </article>
      )}

      <article className="panel">
        <h3>Walk-in Queue</h3>
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {walkins.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td><td>{w.phone}</td><td>{w.reason}</td><td>{w.status}</td>
                <td>{w.status !== 'converted' && activeUser.role !== 'Patient' && <button className="action-btn" onClick={() => onConvertWalkin(w.id)}>Convert to Patient</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="panel">
        <h3>Appointment Workflow</h3>
        <table>
          <thead><tr><th>Patient</th><th>Provider</th><th>Start</th><th>Source</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{patientName(a.patientId, patients)}</td>
                <td>{userName(a.providerId, users)}</td>
                <td>{new Date(a.start).toLocaleString()}</td>
                <td>{a.source || 'staff'}</td>
                <td>{a.status}</td>
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
      </article>
    </section>
  );
}
