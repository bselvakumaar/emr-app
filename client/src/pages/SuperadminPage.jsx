import MetricCard from '../components/MetricCard.jsx';
import { currency } from '../utils/format.js';
import { exportToCSV } from '../utils/export.js';
import { useState, useEffect } from 'react';
import { api } from '../api.js';

function SuperadminPage({ superOverview: propOverview, tenants = [], onCreateTenant, onCreateUser }) {
  const superOverview = propOverview || {};
  const [killSwitches, setKillSwitches] = useState({});
  const [featureFlags, setFeatureFlags] = useState({});
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log('DEBUG: SuperadminPage component render', { superOverview, tenantsLength: tenants?.length });

  // Fetch kill switches and feature flags
  useEffect(() => {
    fetchKillSwitches();
  }, []);

  const fetchKillSwitches = async () => {
    try {
      const response = await api.get('/admin/kill-switches');
      setKillSwitches(response || {});
    } catch (error) {
      console.error('Error fetching kill switches:', error);
    }
  };

  const fetchTenantFeatures = async (tenantId) => {
    try {
      const response = await api.get(`/tenants/${tenantId}/features`);
      setFeatureFlags(response || {});
      setSelectedTenant(tenantId);
    } catch (error) {
      console.error('Error fetching tenant features:', error);
    }
  };

  const toggleKillSwitch = async (featureFlag, enabled) => {
    setLoading(true);
    try {
      await api.post('/admin/kill-switches', {
        featureFlag,
        enabled,
        reason: enabled ? 'Manual enable via admin panel' : 'Manual disable via admin panel'
      });

      setKillSwitches(prev => ({
        ...prev,
        [featureFlag]: enabled
      }));

      // Refresh tenant features if a tenant is selected
      if (selectedTenant) {
        fetchTenantFeatures(selectedTenant);
      }
    } catch (error) {
      console.error('Error toggling kill switch:', error);
      alert('Failed to update kill switch');
    } finally {
      setLoading(false);
    }
  };

  const updateTenantTier = async (tenantId, tier) => {
    setLoading(true);
    try {
      await api.patch(`/tenants/${tenantId}/settings`, {
        // Note: This would need to be implemented in the backend
        subscriptionTier: tier
      });

      alert(`Tenant updated to ${tier} tier`);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error updating tenant tier:', error);
      alert('Failed to update tenant tier');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const header = ['Facility Name', 'Code', 'Subscription Tier', 'Users', 'Patients', 'Appointments', 'Revenue ($)'];
    const rows = tenants.map(t => {
      const stats = superOverview?.tenants?.find(s => s.tenantId === t.id) || {};
      return [
        t.name,
        t.code,
        t.subscription_tier,
        stats.users || 0,
        stats.patients || 0,
        stats.appointments || 0,
        (stats.revenue || 0).toFixed(2)
      ];
    });

    exportToCSV([header, ...rows], `MedFlow_Network_Intelligence_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case 'Enterprise': return '#10b981';
      case 'Professional': return '#3b82f6';
      case 'Basic': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getFeatureDisplayName = (flag) => {
    const names = {
      'permission-core_engine-access': 'Core EMR Engine',
      'permission-hr_payroll-access': 'HR & Payroll',
      'permission-accounts-access': 'Accounts & Billing',
      'permission-customer_support-access': 'Customer Support'
    };
    return names[flag] || flag;
  };
  return (
    <div className="super-intelligence-view">
      {/* Header Section */}
      <div className="view-header-premium">
        <div className="header-labels">
          <span className="platform-tag">Platform Global Context</span>
          <h1>Strategic Intelligence <span>Center</span></h1>
          <p>Consolidated operational metrics and facility oversight across the entire MedFlow network.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-action-btn" onClick={handleExport}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Export Intelligence
          </button>
        </div>
      </div>

      {/* High-Impact Analytics */}
      <section className="analytics-grid-4">
        <MetricCard
          label="Active Entities"
          value={superOverview?.totals?.tenants ?? 0}
          icon="tenants"
          accent="blue"
          trend="+2 New"
        />
        <MetricCard
          label="User Engagement"
          value={superOverview?.totals?.users ?? 0}
          icon="employees"
          accent="amber"
        />
        <MetricCard
          label="Clinical Load"
          value={superOverview?.totals?.patients ?? 0}
          icon="patients"
          accent="rose"
        />
        <MetricCard
          label="Platform Volume"
          value={superOverview?.totals?.appointments ?? 0}
          icon="appointments"
          accent="violet"
          trend="High"
        />
      </section>

      {/* Main Content Grid */}
      <div className="main-oversight-grid">
        {/* Tenant Registry */}
        <section className="oversight-section">
          <div className="section-head-premium">
            <div className="head-text">
              <h3>Facility Registry</h3>
              <p>Operational status across all tenants</p>
            </div>
          </div>

          <div className="premium-table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Facility Identity</th>
                  <th>Intelligence Tier</th>
                  <th>Engagement</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td>
                      <div className="tenant-cell">
                        <div className="tenant-initial">{tenant.name?.charAt(0)}</div>
                        <div className="tenant-info">
                          <span className="name">{tenant.name}</span>
                          <span className="code">{tenant.code}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag tier ${tenant.subscription_tier?.toLowerCase()}`}>
                        {tenant.subscription_tier}
                      </span>
                    </td>
                    <td>
                      <div className="engagement-mini">
                        <span className="count">{tenant.user_count || 0}</span>
                        <span className="label">Practitioners</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        className="table-action-btn"
                        onClick={() => {
                          alert('Loading Facility Console: ' + tenant.name);
                          fetchTenantFeatures(tenant.id);
                        }}
                      >
                        Manage Facility
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Feature & Ecosystem Control */}
        <div className="side-controls-stack">
          <section className="oversight-section glass">
            <div className="section-head-premium">
              <div className="head-text">
                <h3>Ecosystem Integrity</h3>
                <p>Global kill switches & service status</p>
              </div>
            </div>

            <div className="empty-state-premium">
              <div className="icon">🛡️</div>
              <p>All core services are performing within optimal parameters.</p>
            </div>
          </section>

          <section className="oversight-section ivory">
            <div className="section-head-premium">
              <div className="head-text">
                <h3>Feature Deployment</h3>
                <p>Segmented access by facility</p>
              </div>
              <span className="control-count">{Object.keys(featureFlags).length} Flags</span>
            </div>

            <div className="feature-status-list">
              <p className="hint">Select a facility from the registry to audit granular module distribution.</p>
            </div>
          </section>
        </div>
      </div>

      {/* Administrative Actions Grid */}
      <div className="admin-actions-grid section-grid-2">
        <article className="oversight-section">
          <div className="section-head-premium">
            <div className="head-text">
              <h3>Onboard New Facility</h3>
              <p>Provision resources for a new healthcare organization</p>
            </div>
          </div>
          <div className="panel-body-premium">
            <form className="admin-form" onSubmit={onCreateTenant}>
              <div className="form-group">
                <label>Facility Name</label>
                <input name="name" className="premium-input" placeholder="E.g. City General Hospital" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Code</label>
                  <input name="code" className="premium-input" placeholder="SCH" required />
                </div>
                <div className="form-group">
                  <label>Subdomain</label>
                  <input name="subdomain" className="premium-input" placeholder="citygen" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Subscription Tier</label>
                  <select name="subscriptionTier" className="premium-select" defaultValue="Basic">
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Primary Brand</label>
                  <input name="primaryColor" type="color" defaultValue="#10b981" />
                </div>
              </div>
              <button type="submit" className="login-action-btn w-full">Provision Tenant</button>
            </form>
          </div>
        </article>

        <article className="oversight-section">
          <div className="section-head-premium">
            <div className="head-text">
              <h3>Manage Access</h3>
              <p>Generate unique credentials for administrative staff</p>
            </div>
          </div>
          <div className="panel-body-premium">
            <form className="admin-form" onSubmit={onCreateUser}>
              <div className="form-group">
                <label>Organization</label>
                <select name="tenantId" className="premium-select" required defaultValue="">
                  <option value="" disabled>Select facility...</option>
                  {Array.isArray(tenants) && tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" className="premium-input" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" className="premium-input" type="email" placeholder="john@hospital.com" required />
              </div>
              <div className="form-group">
                <label>System Role</label>
                <select name="role" className="premium-select">
                  <option>Admin</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Front Office</option>
                  <option>Billing</option>
                  <option>Inventory</option>
                  <option>Patient</option>
                </select>
              </div>
              <button type="submit" className="login-action-btn w-full">Register Administrator</button>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
}

export default SuperadminPage;
