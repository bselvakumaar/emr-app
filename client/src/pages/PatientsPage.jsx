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
  return (
    <section className="view">
      {activeUser.role !== 'Patient' && (
        <article className="panel">
          <h3>Register Patient (Formal Health Profile)</h3>
          <form className="form-grid" onSubmit={onCreatePatient}>
            <input name="firstName" placeholder="First Name" required />
            <input name="lastName" placeholder="Last Name" required />
            <input name="dob" type="date" required />
            <select name="gender"><option>Female</option><option>Male</option><option>Other</option></select>
            <input name="phone" placeholder="Phone" required />
            <input name="email" placeholder="Email" />
            <input name="address" placeholder="Address" />
            <input name="bloodGroup" placeholder="Blood Group" />
            <input name="emergencyContact" placeholder="Emergency Contact" />
            <input name="insurance" placeholder="Insurance" />
            <input name="chronicConditions" placeholder="Chronic Conditions" />
            <input name="allergies" placeholder="Allergies" />
            <input name="surgeries" placeholder="Past Surgeries" />
            <input name="familyHistory" placeholder="Family History" />
            <button type="submit">Create Patient</button>
          </form>
        </article>
      )}

      <article className="panel">
        <h3>Patient Records</h3>
        <select value={activePatientId} onChange={(e) => setActivePatientId(e.target.value)}>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.mrn} - {p.firstName} {p.lastName}</option>)}
        </select>

        {activePatient && (
          <div style={{ marginTop: '0.7rem' }}>
            <p><strong>DOB:</strong> {activePatient.dob} | <strong>Blood:</strong> {activePatient.bloodGroup} | <strong>Insurance:</strong> {activePatient.insurance}</p>
            <p><strong>History:</strong> {activePatient.medicalHistory?.chronicConditions} | <strong>Allergies:</strong> {activePatient.medicalHistory?.allergies}</p>
            {activeUser.role !== 'Patient' && (
              <form className="form-grid" onSubmit={onAddClinical}>
                <select name="section">
                  <option value="caseHistory">Case history</option>
                  <option value="medications">Medication</option>
                  <option value="prescriptions">Prescription</option>
                  <option value="recommendations">Recommendations</option>
                  <option value="feedbacks">Patient feedbacks</option>
                  <option value="testReports">Test reports</option>
                </select>
                <input name="text" placeholder="Entry details" required />
                <button type="submit">Add Clinical Entry</button>
              </form>
            )}
            <div style={{ marginTop: '0.6rem' }}>
              <button className="action-btn" onClick={() => onPrint('invoice')}>Print Invoice</button>
              <button className="action-btn" onClick={() => onPrint('health-record')}>Print Health Record</button>
              <button className="action-btn" onClick={() => onPrint('test-reports')}>Print Test Reports</button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
