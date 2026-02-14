import { moduleMeta } from '../config/modules.js';

export default function AppLayout({ tenant, activeUser, allowedViews, view, setView, onLogout, children, error }) {
  return (
    <div id="app">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="tenant-logo">{tenant?.code || 'SYS'}</div>
          <div>
            <h1>{tenant?.name || 'Superadmin'}</h1>
            <p>{activeUser.name} ({activeUser.role})</p>
          </div>
        </div>
        <button className="action-btn" onClick={onLogout}>Logout</button>
        <nav className="module-nav">
          {allowedViews.map((item) => (
            <button key={item} className={view === item ? 'active' : ''} onClick={() => setView(item)}>
              {moduleMeta[item].title}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-panel">
        <header className="main-header">
          <div>
            <h2>{moduleMeta[view]?.title || 'Dashboard'}</h2>
            <p>{moduleMeta[view]?.subtitle || 'Operational overview'}</p>
          </div>
          <div className="header-right">
            <span className="badge">{activeUser.role}</span>
            <span className="badge live">Live</span>
          </div>
        </header>
        {error && <div className="error-box">{error}</div>}
        {children}
      </main>
    </div>
  );
}
