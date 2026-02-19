export default function AppointmentActions({ appointment, user, onStatus, onReschedule }) {
  if (user.role === 'Patient') {
    if (user.patientId !== appointment.patientId) {
      return null;
    }
    return (
      <div className="action-btn-row">
        {['requested', 'scheduled'].includes(appointment.status) && (
          <button type="button" className="action-btn action-btn--danger" onClick={() => onStatus('cancelled')}>
            Cancel
          </button>
        )}
        {['requested', 'scheduled'].includes(appointment.status) && (
          <button type="button" className="action-btn action-btn--neutral" onClick={onReschedule}>
            Reschedule
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="action-btn-row">
      {appointment.status === 'requested' && (
        <button type="button" className="action-btn action-btn--primary" onClick={() => onStatus('scheduled')}>
          Confirm
        </button>
      )}
      {appointment.status === 'scheduled' && (
        <button type="button" className="action-btn action-btn--primary" onClick={() => onStatus('checked_in')}>
          Check-in
        </button>
      )}
      {['scheduled', 'checked_in'].includes(appointment.status) && (
        <button type="button" className="action-btn action-btn--success" onClick={() => onStatus('completed')}>
          Complete
        </button>
      )}
      {['requested', 'scheduled', 'checked_in'].includes(appointment.status) && (
        <button type="button" className="action-btn action-btn--danger" onClick={() => onStatus('no_show')}>
          No-show
        </button>
      )}
      {['requested', 'scheduled', 'checked_in'].includes(appointment.status) && (
        <button type="button" className="action-btn action-btn--danger" onClick={() => onStatus('cancelled')}>
          Cancel
        </button>
      )}
      {['requested', 'scheduled'].includes(appointment.status) && (
        <button type="button" className="action-btn action-btn--neutral" onClick={onReschedule}>
          Reschedule
        </button>
      )}
    </div>
  );
}
