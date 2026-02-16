export default function LoginPage({ tenants, onLogin, loading, error }) {
  return (
    <div className="login-portal premium-theme">
      {/* Abstract Medical Background */}
      <div className="bg-visual-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="glass-grid"></div>
      </div>

      <div className="login-wrapperContainer">
        <div className="login-primary-card premium-glass">
          <div className="login-header-block">
            <div className="logo-container">
              <img src="/logo.svg" alt="MedFlow EMR" className="corp-logo" />
            </div>
            <h1 className="h1-brand">MedFlow Enterprise</h1>
            <p className="p-sub">Unified Multi-Tenant Healthcare Platform</p>
          </div>

          <form className="auth-form" onSubmit={onLogin}>
            <div className="field-group">
              <label className="field-label">Healthcare Organization</label>
              <div className="selector-custom">
                <select name="tenantId" required className="auth-select">
                  <option value="" disabled selected>Identify your facility...</option>
                  <option value="superadmin" className="opt-admin">Platform Administration Control</option>
                  {Array.isArray(tenants) && tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <div className="arrow-down"></div>
              </div>
            </div>

            <div className="field-split">
              <div className="field-group">
                <label className="field-label">Professional Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@facility.com"
                  required
                  autoComplete="email"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Security Credential</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="auth-input"
              />
            </div>

            <button type="submit" className="btn-access-portal" disabled={loading}>
              {loading ? (
                <div className="btn-spinner">
                  <span></span><span></span><span></span>
                </div>
              ) : (
                <>
                  <span>Initialize Secure Session</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="auth-error-panel">
              <div className="err-indicator">!</div>
              <div className="err-text">{error}</div>
            </div>
          )}

          <div className="login-legal-footer">
            <p>Protected by Enterprise-Grade Encryption</p>
            <div className="legal-links">
              <span>Security Policy</span>
              <span>•</span>
              <span>Compliance Center</span>
            </div>
          </div>
        </div>

        <div className="platform-meta">
          <p>© 2026 MedFlow Solutions Group. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .login-portal {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* Animated Background Elements */
        .bg-visual-elements { position: absolute; inset: 0; z-index: 0; }
        .blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.15; animation: orbit 20s infinite linear; }
        .blob-1 { top: -10%; right: -5%; width: 500px; height: 500px; background: #10b981; }
        .blob-2 { bottom: -10%; left: -5%; width: 600px; height: 600px; background: #3b82f6; }
        .glass-grid { position: absolute; inset: 0; background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px); background-size: 30px 30px; opacity: 0.2; }
        
        @keyframes orbit {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
          100% { transform: translate(0,0) scale(1); }
        }

        .login-wrapperContainer {
          width: 100%;
          max-width: 480px;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .premium-glass {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 2rem;
          padding: 3.5rem 3rem;
          box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .login-header-block { text-align: center; }
        .logo-container { margin-bottom: 1.5rem; }
        .corp-logo { width: 48px; height: 48px; filter: drop-shadow(0 4px 10px rgba(16, 185, 129, 0.2)); }
        .h1-brand { font-size: 1.75rem; font-weight: 900; color: #0f172a; letter-spacing: -0.04em; margin: 0; font-family: 'Inter', sans-serif; }
        .p-sub { color: #64748b; font-size: 0.95rem; margin-top: 0.51rem; font-weight: 500; }

        .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-label { font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; padding-left: 2px; }

        .selector-custom { position: relative; }
        .auth-select, .auth-input {
          width: 100%; padding: 14px 16px; background: #f1f5f9; border: 1.5px solid transparent; border-radius: 14px;
          font-family: inherit; font-size: 0.95rem; color: #1e293b; transition: all 0.2s; font-weight: 500; outline: none; appearance: none;
        }
        .auth-select:focus, .auth-input:focus {
          background: white; border-color: #3b82f6; box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.1);
        }
        .arrow-down { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #64748b; pointer-events: none; }
        .opt-admin { font-weight: 800; color: #3b82f6; }

        .btn-access-portal {
          margin-top: 1rem; padding: 16px; background: #0f172a; color: white; border: none; border-radius: 14px;
          font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.2);
        }
        .btn-access-portal:hover:not(:disabled) { background: #1e293b; transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.3); }
        .btn-access-portal:active { transform: translateY(0); }
        .btn-access-portal:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-spinner { display: flex; gap: 4px; }
        .btn-spinner span { width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 1.4s infinite ease-in-out; opacity: 0.6; }
        .btn-spinner span:nth-child(2) { animation-delay: 0.2s; }
        .btn-spinner span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        .auth-error-panel {
          padding: 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;
          display: flex; align-items: center; gap: 12px; animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .err-indicator { width: 22px; height: 22px; background: #ef4444; color: white; border-radius: 50%; display: grid; place-items: center; font-weight: 900; font-size: 14px; }
        .err-text { color: #991b1b; font-size: 0.85rem; font-weight: 600; }
        
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }

        .login-legal-footer { text-align: center; border-top: 1.5px solid #f1f5f9; padding-top: 2rem; }
        .login-legal-footer p { font-size: 0.75rem; color: #94a3b8; font-weight: 600; margin: 0; margin-bottom: 8px; }
        .legal-links { display: flex; justify-content: center; gap: 12px; font-size: 0.75rem; font-weight: 800; color: #334155; }
        
        .platform-meta { text-align: center; margin-top: 2.5rem; }
        .platform-meta p { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
      `}</style>
    </div>
  );
}
