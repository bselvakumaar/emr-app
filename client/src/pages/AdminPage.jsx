export default function AdminPage({ tenant, patients, onSaveSettings, onCreateUser }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Tenant Settings</h3>
        <form className="form-grid" onSubmit={onSaveSettings}>
          <input name="displayName" defaultValue={tenant?.name} required />
          <input name="primaryColor" type="color" defaultValue={tenant?.theme?.primary || '#0f5a6e'} />
          <input name="accentColor" type="color" defaultValue={tenant?.theme?.accent || '#f57f17'} />
          <label className="toggle"><input name="featureInventory" type="checkbox" defaultChecked={tenant?.features?.inventory} /> Inventory</label>
          <label className="toggle"><input name="featureTelehealth" type="checkbox" defaultChecked={tenant?.features?.telehealth} /> Telehealth</label>
          <button type="submit">Save Settings</button>
        </form>
      </article>
      <article className="panel">
        <h3>Create Tenant User</h3>
        <form className="form-grid" onSubmit={onCreateUser}>
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" required />
          <select name="role"><option>Admin</option><option>Doctor</option><option>Nurse</option><option>Front Office</option><option>Billing</option><option>Inventory</option><option>Patient</option></select>
          <select name="patientId"><option value="">Link Patient (optional)</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.mrn}</option>)}</select>
          <button type="submit">Create User</button>
        </form>
      </article>
    </section>
  );
}
