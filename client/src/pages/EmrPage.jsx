export default function EmrPage({ patients, providers, onCreateEncounter }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Create Encounter</h3>
        <form className="form-grid" onSubmit={onCreateEncounter}>
          <select name="patientId" required>{patients.map((p) => <option key={p.id} value={p.id}>{p.mrn} - {p.firstName}</option>)}</select>
          <select name="providerId" required>{providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select name="type"><option>OPD</option><option>IPD</option><option>Emergency</option></select>
          <input name="complaint" placeholder="Complaint" required />
          <input name="diagnosis" placeholder="Diagnosis" required />
          <input name="notes" placeholder="Notes" />
          <button type="submit">Save Encounter</button>
        </form>
      </article>
    </section>
  );
}
