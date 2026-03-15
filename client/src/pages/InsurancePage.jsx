import { useMemo, useState } from 'react';
import { Building2, Plus, Search, ShieldCheck } from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function InsurancePage({ providers = [], claims = [], onCreateProvider, onCreateClaim }) {
  const [showRegister, setShowRegister] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = useMemo(() => {
    if (!searchTerm) return providers;
    return providers.filter((provider) => provider.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [providers, searchTerm]);

  const totalCoverage = claims.reduce((sum, claim) => sum + (Number(claim.amount) || 0), 0);
  const pendingClaims = claims.filter((claim) => claim.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="premium-card p-6 md:p-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div className="max-w-3xl">
            <div className="clinical-chip mb-4">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              Coverage and claims operations
            </div>
            <h1 className="text-[1.95rem] md:text-[2.4rem] leading-tight font-extrabold tracking-[-0.04em] text-[var(--text-strong)]">
              Insurance Registry
            </h1>
            <p className="mt-3 text-[15px] md:text-base leading-7 text-[var(--text-muted)]">
              Manage payer relationships, coverage capacity, and claims visibility with a cleaner operational workflow.
            </p>
          </div>

          <button className="btn btn-primary self-start xl:self-auto" onClick={() => setShowRegister(true)}>
            <Plus className="w-4 h-4" />
            Register new provider
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MetricCard
          label="Active Providers"
          value={providers.length}
          icon="tenants"
          accent="teal"
          trend="Registered units"
        />
        <MetricCard
          label="Pending Claims"
          value={pendingClaims}
          icon="appointments"
          accent="amber"
          trend="High-priority queue"
        />
        <MetricCard
          label="Coverage Volume"
          value={`Rs ${(totalCoverage / 100000).toFixed(1)}L`}
          icon={Building2}
          accent="emerald"
          trend="Total liquidity"
        />
      </section>

      <section className="premium-card overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--surface-muted)]">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--text-soft)]">Provider Registry</p>
            <h2 className="text-xl font-extrabold text-[var(--text-strong)] mt-2">Coverage institutions and payer directory</h2>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)] w-4 h-4" />
            <input
              type="text"
              placeholder="Filter registry..."
              className="clinical-input pl-11 pr-4 py-3 w-full md:w-72 text-sm font-semibold bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Provider Identity</th>
                <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Category</th>
                <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Coverage Limit</th>
                <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Status</th>
                <th className="px-4 py-4 text-right text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.length > 0 ? filteredProviders.map((provider) => (
                <tr key={provider.id} className="border-b border-[var(--border)]/70 hover:bg-[var(--surface-muted)] transition-colors">
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-extrabold text-sm shadow-sm">
                        {provider.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-strong)] tracking-tight">{provider.name}</div>
                        <div className="text-[11px] text-[var(--text-soft)] font-extrabold uppercase tracking-[0.16em] mt-1">
                          {provider.contact_person || 'Clinical liaison pending'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                      {provider.type}
                    </span>
                  </td>
                  <td className="px-4 py-5 font-bold text-[var(--text-main)] text-sm">
                    Rs {(Number(provider.coverage_limit) / 100000).toFixed(1)}L cap
                  </td>
                  <td className="px-4 py-5">
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] bg-[var(--surface-muted)]">
                      <span className={`w-2 h-2 rounded-full ${provider.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      <span className={provider.status === 'Active' ? 'text-emerald-700' : 'text-amber-700'}>
                        {provider.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="btn btn-secondary !min-h-[38px] !px-4 !text-xs uppercase tracking-[0.14em]">
                        Details
                      </button>
                      <button
                        className="btn btn-primary !min-h-[38px] !px-4 !text-xs uppercase tracking-[0.14em]"
                        onClick={() => alert('Claim analytical view coming soon')}
                      >
                        Access claims
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-[var(--text-muted)] text-sm italic">
                    No insurance providers detected in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showRegister && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="premium-card w-full max-w-xl p-6 md:p-7">
            <header className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--text-soft)]">New Provider</p>
                <h3 className="text-2xl font-extrabold text-[var(--text-strong)] mt-2">Register insurance provider</h3>
              </div>
              <button onClick={() => setShowRegister(false)} className="text-[var(--text-soft)] hover:text-[var(--text-main)] font-bold text-xl">
                x
              </button>
            </header>

            <form onSubmit={(e) => { onCreateProvider(e); setShowRegister(false); }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Institutional Identity</label>
                  <input className="clinical-input px-4 py-3 text-[15px] font-semibold" name="name" required placeholder="HealthGuard Assurance" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Classification</label>
                  <select className="clinical-select px-4 py-3 text-[15px] font-semibold" name="type">
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Liability Cap (Rs)</label>
                  <input className="clinical-input px-4 py-3 text-[15px] font-semibold" name="coverageLimit" type="number" required defaultValue="500000" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Contact Officer</label>
                  <input className="clinical-input px-4 py-3 text-[15px] font-semibold" name="contactPerson" required placeholder="Registry Name" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Secure Comm Line</label>
                  <input className="clinical-input px-4 py-3 text-[15px] font-semibold" name="phone" required placeholder="+91 ..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Official Endpoint (Email)</label>
                <input className="clinical-input px-4 py-3 text-[15px] font-semibold" name="email" type="email" required placeholder="corporate@endpoint.com" />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegister(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Finalize registry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
