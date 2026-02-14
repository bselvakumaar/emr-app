export default function LoginPage({ tenants, onLogin, loading, error }) {
  return (
    <div className="main-panel" style={{ maxWidth: 620, margin: '2rem auto' }}>
      <article className="panel">
        <h2>EMR Login</h2>
        <p>First workflow: select tenant and login.</p>
        <form className="form-grid" onSubmit={onLogin}>
          <select name="tenantId" defaultValue="" required>
            <option value="" disabled>Select Tenant</option>
            <option value="superadmin">Platform Superadmin</option>
            {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input name="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <ul className="list" style={{ marginTop: '1rem' }}>
          <li>Superadmin: superadmin@emr.local / Admin@123</li>
          <li>Tenant Admin: anita@sch.local / Anita@123</li>
          <li>Patient: meena@sch.local / Meena@123</li>
        </ul>
        {loading && <p>Authenticating...</p>}
        {error && <div className="error-box">{error}</div>}
      </article>
    </div>
  );
}
