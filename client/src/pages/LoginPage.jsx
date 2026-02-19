import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin, tenants }) { // keys: tenants passed from App
  const [credentials, setCredentials] = useState({
    tenantId: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Demo credentials for each tenant
  const demoCredentials = {
    'superadmin': {
      email: 'superadmin@emr.local',
      password: 'Admin@123'
    },
    'EHS': {
      email: 'michael@enterprise.hos',
      password: 'Test@123'
    },
    'PMC': {
      email: 'robert@professional.med',
      password: 'Test@123'
    },
    'BHC': {
      email: 'sarah@basic.health',
      password: 'Test@123'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use api.login to ensure token is stored correctly in localStorage
      // and consistent with api.js internal logic
      const { api } = await import('../api.js');
      const data = await api.login(credentials.tenantId, credentials.email, credentials.password);

      // onLogin will handle state update in App.jsx
      onLogin(data);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTenantChange = (tenantId) => {
    setCredentials(prev => ({ ...prev, tenantId }));
    setShowDemoCredentials(false);
  };

  const useDemoCredentials = () => {
    const demo = demoCredentials[credentials.tenantId];
    if (demo) {
      setCredentials(prev => ({
        ...prev,
        email: demo.email,
        password: demo.password
      }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="login-portal">
      <div className="login-container">
        {/* Left Panel: Branding & Value Proposition */}
        <section className="login-branding">
          <div className="branding-glass">
            <div className="logo-box">
              <img
                src="/Medflow-logo.jpg"
                alt="MedFlow EMR"
                className="medflow-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="logo-fallback" style={{ display: 'none' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="branding-text">
              <h1 className="hero-title">MedFlow <span>EMR</span></h1>
              <p className="hero-subtitle">The Intelligence Engine for Modern Healthcare</p>

              <div className="trust-badges">
                <div className="badge-item">
                  <span className="badge-icon">🛡️</span>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="badge-item">
                  <span className="badge-icon">⚡</span>
                  <span>Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Authentication Form */}
        <section className="login-form-area">
          <div className="auth-card">
            <header className="auth-header">
              <h2>Secure Access</h2>
              <p>Welcome to the MedFlow Platform</p>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-field">
                <label>Organization Context</label>
                <div className="input-group">
                  <select
                    value={credentials.tenantId}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className="premium-select"
                    required
                  >
                    <option value="">Choose organization...</option>
                    <option value="superadmin">🛡️ Platform Superadmin</option>
                    {tenants?.map((tenant) => (
                      <option key={tenant.id} value={tenant.code || tenant.id}>
                        {tenant.code === 'EHS' ? '🏥' : (tenant.code === 'PMC' ? '⭐' : (tenant.code === 'BHC' ? '🩺' : '🏢'))} {tenant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="premium-input"
                  placeholder="name@organization.com"
                  required
                />
              </div>

              <div className="form-field">
                <label>Access Key</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="premium-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {credentials.tenantId && (
                <div className="demo-hint-box">
                  <div className="demo-header" onClick={() => setShowDemoCredentials(!showDemoCredentials)}>
                    <span className="icon">🔑</span>
                    <span className="text">Development Credentials Available</span>
                    <span className="toggle">{showDemoCredentials ? '−' : '+'}</span>
                  </div>

                  {showDemoCredentials && (
                    <div className="demo-body">
                      <div className="credential-row" onClick={() => copyToClipboard(demoCredentials[credentials.tenantId]?.email)}>
                        <code>{demoCredentials[credentials.tenantId]?.email}</code>
                      </div>
                      <button
                        type="button"
                        onClick={useDemoCredentials}
                        className="quick-auth-btn"
                      >
                        Auto-Fill & Launch
                      </button>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="auth-error">
                  <span className="error-icon">✕</span>
                  <p>{error}</p>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="login-action-btn">
                {isLoading ? (
                  <span className="loader">Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <footer className="auth-footer">
              <p>Problems signing in? <a href="#">Contact Support</a></p>
            </footer>
          </div>
        </section>
      </div>

      <div className="portal-footer">
        <p>© 2026 MedFlow Systems. Secure Enterprise Environment.</p>
      </div>
    </div>
  );
}
