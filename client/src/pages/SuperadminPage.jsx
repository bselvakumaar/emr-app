import MetricCard from '../components/MetricCard.jsx';
import { currency } from '../utils/format.js';

export default function SuperadminPage({ superOverview, tenants, onCreateTenant, onCreateUser }) {
  return (
    <section className="view super-view">
      {/* Analytics Section */}
      <div className="section-header">
        <div className="header-info">
          <h3>Platform Analytics</h3>
          <p>Real-time system-wide monitoring across all healthcare facilities.</p>
        </div>
      </div>

      <div className="grid-4 cards">
        <MetricCard label="Total Tenants" value={superOverview?.totals?.tenants || 0} variant="blue" />
        <MetricCard label="Active Users" value={superOverview?.totals?.users || 0} variant="amber" />
        <MetricCard label="Registered Patients" value={superOverview?.totals?.patients || 0} variant="rose" />
        <MetricCard label="Overall Appointments" value={superOverview?.totals?.appointments || 0} variant="violet" />
      </div>

      <div className="grid-2-1">
        {/* Tenant Management */}
        <div className="card-column">
          <article className="panel premium-glass">
            <div className="panel-header">
              <div className="icon-badge primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <h4>Tenant Registry</h4>
            </div>
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Facility Identity</th>
                    <th>Staff</th>
                    <th>Patients</th>
                    <th>Activity</th>
                    <th>Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {(superOverview?.tenants || []).map((t) => (
                    <tr key={t.tenantId}>
                      <td>
                        <div className="tenant-cell">
                          <span className="tenant-name">{t.tenantName}</span>
                          <span className="tenant-subdomain">{t.subdomain}.medflow.io</span>
                        </div>
                      </td>
                      <td><span className="count-pill">{t.users}</span></td>
                      <td><span className="count-pill">{t.patients}</span></td>
                      <td><span className="count-pill">{t.appointments}</span></td>
                      <td><span className="yield-text">{currency(t.revenue)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        {/* Administration Actions */}
        <div className="action-column">
          <article className="panel premium-glass accent-panel">
            <div className="panel-header">
              <h4>Onboard New Facility</h4>
            </div>
            <form className="admin-form" onSubmit={onCreateTenant}>
              <div className="form-group">
                <label>Facility Name</label>
                <input name="name" placeholder="E.g. City General Hospital" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Code</label>
                  <input name="code" placeholder="SCH" required />
                </div>
                <div className="form-group">
                  <label>Subdomain</label>
                  <input name="subdomain" placeholder="citygen" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Brand</label>
                  <input name="primaryColor" type="color" defaultValue="#10b981" />
                </div>
                <div className="form-group">
                  <label>Accent</label>
                  <input name="accentColor" type="color" defaultValue="#3b82f6" />
                </div>
              </div>
              <button type="submit" className="primary-btn full-width">Provision Tenant</button>
            </form>
          </article>

          <article className="panel premium-glass secondary-panel">
            <div className="panel-header">
              <h4>System Administrative Access</h4>
            </div>
            <form className="admin-form" onSubmit={onCreateUser}>
              <div className="form-group">
                <label>Assigned Organization</label>
                <select name="tenantId" required>
                  <option value="" disabled selected>Select facility...</option>
                  {Array.isArray(tenants) && tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="john@hospital.com" required />
              </div>
              <div className="form-group">
                <label>System Role</label>
                <select name="role">
                  <option>Admin</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Front Office</option>
                  <option>Billing</option>
                  <option>Inventory</option>
                  <option>Patient</option>
                </select>
              </div>
              <button type="submit" className="secondary-btn full-width">Generate Access</button>
            </form>
          </article>
        </div>
      </div>

      <style>{`
        .super-view { max-width: 1400px; margin: 0 auto; width: 100%; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
        .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; align-items: start; }
        
        .panel { padding: 1.5rem; border-radius: 1.5rem; margin-bottom: 1.5rem; }
        .panel-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .panel-header h4 { font-size: 1rem; font-weight: 800; color: #1e293b; margin: 0; }
        
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800; padding: 1rem; border-bottom: 2px solid #f1f5f9; }
        .premium-table td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        
        .tenant-cell { display: flex; flex-direction: column; }
        .tenant-name { font-weight: 800; color: #0f172a; font-size: 0.95rem; }
        .tenant-subdomain { font-size: 0.75rem; color: #64748b; font-family: monospace; }
        
        .count-pill { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
        .yield-text { font-weight: 800; color: #10b981; }

        .admin-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em; }
        
        .admin-form input, .admin-form select {
          padding: 12px 14px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-family: inherit; font-size: 0.9rem; font-weight: 500; transition: all 0.2s;
        }
        .admin-form input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); outline: none; }
        
        .primary-btn { background: #1e293b; color: white; padding: 14px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .primary-btn:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .secondary-btn { background: #f1f5f9; color: #1e293b; padding: 14px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .secondary-btn:hover { background: #e2e8f0; }
        
        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns: 1fr 1fr; }
          .grid-2-1 { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
