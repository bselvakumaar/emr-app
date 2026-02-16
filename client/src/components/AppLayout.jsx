import { useState } from 'react';
import { moduleMeta } from '../config/modules.js';
import { helpContent } from '../config/helpContent.js';

const navIcons = {
  superadmin: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  dashboard: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  patients: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  appointments: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  emr: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  inpatient: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 13h20" /><path d="M22 13v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7" /><path d="M12 2a5 5 0 0 1 5 5v6H7V7a5 5 0 0 1 5-5z" /></svg>,
  pharmacy: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 9.5V21H19.5V9.5" /><path d="M2 9.5L12 2l10 7.5" /><path d="M9 13H15V21H9z" /></svg>,
  billing: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  inventory: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
  employees: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  accounts: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>,
  reports: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  admin: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
};

export default function AppLayout({ tenant, activeUser, allowedViews, view, setView, onLogout, children, error }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div id="app">
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Help Modal */}
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <div className="help-header">
              <h3>Role Guide: {activeUser.role}</h3>
              <button onClick={() => setShowHelp(false)}>×</button>
            </div>
            <div
              className="help-content"
              dangerouslySetInnerHTML={{ __html: helpContent[activeUser.role] || helpContent.default }}
            />
          </div>
        </div>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <div className="brand-block">
          <img
            src={tenant?.name === 'Kidz Clinic' ? '/kidz_logo.svg' : '/logo.svg'}
            alt="Logo"
            className="tenant-logo-img"
          />
          <div className="brand-text">
            <h1>{tenant?.name || 'Superadmin'}</h1>
            <p>{activeUser.role}</p>
          </div>
        </div>

        <nav className="module-nav">
          {allowedViews.map((item) => {
            if (!moduleMeta[item]) return null;
            return (
              <button
                key={item}
                className={view === item ? 'active' : ''}
                onClick={() => {
                  setView(item);
                  setIsMobileMenuOpen(false);
                }}
              >
                {navIcons[item]}
                <span>{moduleMeta[item].title}</span>
              </button>
            );
          })}
        </nav>

        <button className="logout-btn" onClick={onLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Account Logout
        </button>
      </aside>

      <main className="main-panel">
        <header className="main-header">
          <div className="header-context">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <h2>{moduleMeta[view]?.title}</h2>
              <span className="live-indicator">LIVE</span>
            </div>
            <p>{moduleMeta[view]?.subtitle}</p>
          </div>
          <div className="header-user">
            <button className="help-btn" onClick={() => setShowHelp(true)} title="Role Guide">?</button>
            <div className="user-profile">
              <div className="user-avatar">{(activeUser.name || 'U')[0]}</div>
              <div className="user-info">
                <strong>{activeUser.name}</strong>
                <span>{activeUser.email}</span>
              </div>
            </div>
          </div>
        </header>

        {error && <div className="error-box premium-error">{error}</div>}
        <div className="view-content" style={{ animation: 'fade-up 0.4s ease-out' }}>
          {children}
        </div>
      </main>

      <style>{`
        .header-context h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
        .header-context p { font-size: 0.8rem; color: #64748b; margin: 0; }
        .live-indicator { font-size: 9px; font-weight: 800; color: #10b981; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #d1fae5; }
        
        .main-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 0; margin-bottom: 0.5rem; }
        .header-user { display: flex; align-items: center; gap: 12px; }
        .user-profile { display: flex; align-items: center; gap: 10px; background: white; padding: 6px 12px; border-radius: 40px; border: 1px solid #e2e8f0; }
        .user-avatar { width: 28px; height: 28px; background: #10b981; color: white; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
        .user-info { display: flex; flex-direction: column; line-height: 1.2; }
        .user-info strong { font-size: 13px; color: #1e293b; }
        .user-info span { font-size: 11px; color: #94a3b8; }
        
        .help-btn { width: 32px; height: 32px; borderRadius: 50%; background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; font-weight: 700; cursor: pointer; display: grid; place-items: center; font-size: 16px; transition: 0.2s; }
        .help-btn:hover { background: #e2e8f0; color: #0f172a; border-color: #94a3b8; }
        
        .help-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
        .help-modal { background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: fade-in 0.2s ease-out; }
        .help-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
        .help-header h3 { margin: 0; font-size: 1.25rem; color: #0f172a; }
        .help-header button { background: none; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; }
        .help-content h3 { font-size: 1rem; color: #3b82f6; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
        .help-content ul { padding-left: 1.25rem; color: #475569; line-height: 1.6; }
        .help-content li { margin-bottom: 0.5rem; font-size: 0.95rem; }
        .help-content p { color: #64748b; margin-bottom: 1rem; }
        
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
