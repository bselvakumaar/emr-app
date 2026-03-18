import { useMemo, useState, useEffect } from 'react';
import { BRAND } from '../config/branding.js';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: HeartPulse,
    title: 'Advanced Clinical Care',
    description: 'Real-time patient monitoring with AI-powered diagnostics and seamless EMR integration.',
    stats: '99.9% Uptime'
  },
  {
    icon: Users,
    title: 'Multi-Tenant Architecture',
    description: 'Secure, isolated environments for each healthcare facility with enterprise-grade security.',
    stats: '500+ Facilities'
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Insights',
    description: 'Comprehensive reporting dashboard with predictive analytics and operational intelligence.',
    stats: 'Real-time Data'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'Optimized workflows and instant access to critical patient information when you need it most.',
    stats: '< 1s Response'
  }
];

export default function LoginPage({ onLogin, tenants }) {
  const [credentials, setCredentials] = useState({
    tenantId: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tenantOptions = useMemo(() => tenants || [], [tenants]);

  const demoCredentials = {
    superadmin: {
      label: 'Platform Services',
      email: 'superadmin@emr.local',
      password: 'Admin@123'
    },
    ehs: {
      label: 'Enterprise Hospital Systems',
      email: 'admin@ehs.local',
      password: 'Test@123'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!credentials.tenantId) {
      setError('Select a facility or platform organization before signing in.');
      setIsLoading(false);
      return;
    }

    try {
      const { api } = await import('../api.js');
      const data = await api.login(credentials.tenantId, credentials.email, credentials.password);
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Authentication failed. Review the credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTenantChange = (tenantId) => {
    setCredentials((prev) => ({ ...prev, tenantId, email: '', password: '' }));
    setShowDemoCredentials(false);
  };

  const useDemoCredentials = (key) => {
    const demo = demoCredentials[key || credentials.tenantId];
    if (!demo) return;

    setCredentials({
      tenantId: key || credentials.tenantId,
      email: demo.email,
      password: demo.password
    });
  };

  return (
    <div className="login-split-portal animate-fade-in">
      <section className="login-brand-panel">
        <div className="relative z-10 max-w-2xl text-center">
          <div className="mb-4 mt-0">
            <div className="w-24 h-24 mx-auto flex items-center justify-center">
              <img src="/medflow_logo_8k.svg" alt={BRAND.name} className="w-full h-full" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/40 font-black mt-2">{BRAND.name}</p>
          </div>
          
          <div className="clinical-chip !bg-white/10 !border-white/15 !text-white mb-6">
            <ShieldCheck className="w-4 h-4" />
            Operational Healthcare Lifecycle Platform
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                {(() => {
                  const Icon = features[currentFeatureIndex].icon;
                  return <Icon className="w-6 h-6 text-white" />;
                })()}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.04em] text-white mb-2 transition-all duration-500">
              {features[currentFeatureIndex].title}
            </h2>
            <p className="text-base text-white/80 leading-relaxed mb-3 transition-all duration-500">
              {features[currentFeatureIndex].description}
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full">
              <span className="text-xs font-bold text-white/90">{features[currentFeatureIndex].stats}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mb-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeatureIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFeatureIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`rounded-[20px] border p-4 backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                    index === currentFeatureIndex
                      ? 'border-white/30 bg-white/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => setCurrentFeatureIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                      <p className="text-xs text-white/60">{feature.stats}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-pro-card">
          <div className="mb-6">
            <div className="clinical-chip mb-3">
              <Lock className="w-4 h-4 text-[var(--primary)]" />
              Secure staff sign-in
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--primary)] font-display">
              {BRAND.slogan}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Choose your organization and sign in with your staff credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="clinical-grid">
            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Organization</label>
              <div className="relative">
                <select
                  name="tenantId"
                  className="clinical-select px-4 py-4 pr-12 text-sm font-semibold appearance-none"
                  value={credentials.tenantId}
                  onChange={(e) => handleTenantChange(e.target.value)}
                >
                  <option value="">Select platform or facility</option>
                  <option value="superadmin">Platform Services</option>
                  {tenantOptions.map((tenant) => (
                    <option key={tenant.id} value={tenant.code || tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-soft)] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  className="clinical-input pl-12 pr-4 py-4 text-sm font-semibold"
                  placeholder="name@hospital.org"
                  value={credentials.email}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-soft)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="clinical-input pl-12 pr-4 py-4 text-sm font-semibold"
                  placeholder="Enter your secure password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-soft)]" />
              </div>
            </div>

            {error && (
              <div className="rounded-[18px] border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--danger)] mt-0.5" />
                  <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full !h-14 !rounded-[18px] flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                  Signing in
                </>
              ) : (
                <>
                  Continue to workspace
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <button
              type="button"
              onClick={() => setShowDemoCredentials((prev) => !prev)}
              className="w-full flex items-center justify-between gap-4 text-left"
            >
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--text-soft)]">Developer Access</p>
                <p className="text-sm font-bold text-[var(--text-main)] mt-1">Use seeded demo accounts for validation</p>
              </div>
              <ArrowRight className={`w-4 h-4 text-[var(--text-soft)] transition-transform ${showDemoCredentials ? 'rotate-90' : ''}`} />
            </button>

            {showDemoCredentials && (
              <div className="mt-4 grid gap-3">
                {Object.entries(demoCredentials).map(([key, demo]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => useDemoCredentials(key)}
                    className="flex items-center justify-between gap-3 rounded-[18px] border border-[var(--border)] bg-white px-4 py-3 text-left transition-all hover:border-[var(--accent)]/30 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[var(--text-main)] truncate">{demo.label}</div>
                        <div className="text-xs text-[var(--text-muted)] truncate">{demo.email}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-soft)] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
