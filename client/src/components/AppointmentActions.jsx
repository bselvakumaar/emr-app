export default function AppointmentActions({ appointment, user, onStatus, onReschedule }) {
  if (user.role === 'Patient') {
    if (user.patientId !== appointment.patientId) {
      return null;
    }
    return (
      <>
        {['requested', 'scheduled'].includes(appointment.status) && <button className="action-btn warn" onClick={() => onStatus('cancelled')}>Cancel</button>}
        {['requested', 'scheduled'].includes(appointment.status) && <button className="action-btn" onClick={onReschedule}>Reschedule</button>}
      </>
    );
  }

  return (
    <>
      {appointment.status === 'requested' && <button className="action-btn" onClick={() => onStatus('scheduled')}>Confirm</button>}
      {appointment.status === 'scheduled' && <button className="action-btn" onClick={() => onStatus('checked_in')}>Check-in</button>}
      {['scheduled', 'checked_in'].includes(appointment.status) && <button className="action-btn" onClick={() => onStatus('completed')}>Complete</button>}
      {['requested', 'scheduled', 'checked_in'].includes(appointment.status) && <button className="action-btn warn" onClick={() => onStatus('no_show')}>No-show</button>}
      {['requested', 'scheduled', 'checked_in'].includes(appointment.status) && <button className="action-btn warn" onClick={() => onStatus('cancelled')}>Cancel</button>}
      {['requested', 'scheduled'].includes(appointment.status) && <button className="action-btn" onClick={onReschedule}>Reschedule</button>}
    </>
  );
}
