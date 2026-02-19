import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function SubscriptionCatalogManager() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');
  const [editingSubscription, setEditingSubscription] = useState(null);

  // Available feature definitions
  const availableFeatures = [
    {
      id: 'permission-core_engine-access',
      name: 'Core EMR Engine',
      description: 'Essential EMR functionality including dashboard, patients, appointments, and medical records',
      category: 'Core',
      icon: '🏥',
      tier: 'Basic'
    },
    {
      id: 'permission-customer_support-access',
      name: 'Customer Support',
      description: 'Customer service and support ticketing system',
      category: 'Support',
      icon: '🎧',
      tier: 'Professional'
    },
    {
      id: 'permission-hr_payroll-access',
      name: 'HR & Payroll',
      description: 'Human resources management and payroll processing',
      category: 'HR',
      icon: '👥',
      tier: 'Enterprise'
    },
    {
      id: 'permission-accounts-access',
      name: 'Accounts & Billing',
      description: 'Financial management, invoicing, and billing operations',
      category: 'Finance',
      icon: '💰',
      tier: 'Enterprise'
    }
  ];

  // Default subscription templates
  const defaultSubscriptions = [
    {
      id: 'basic',
      name: 'Basic',
      displayName: 'Basic Plan',
      description: 'Essential EMR functionality for small practices',
      price: '$99/month',
      features: ['permission-core_engine-access'],
      color: '#6b7280',
      icon: '🩺',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      displayName: 'Professional Plan',
      description: 'Enhanced EMR with customer support features',
      price: '$299/month',
      features: ['permission-core_engine-access', 'permission-customer_support-access'],
      color: '#3b82f6',
      icon: '⭐',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      displayName: 'Enterprise Plan',
      description: 'Complete EMR solution with all advanced features',
      price: '$599/month',
      features: ['permission-core_engine-access', 'permission-customer_support-access', 'permission-hr_payroll-access', 'permission-accounts-access'],
      color: '#10b981',
      icon: '🏢',
      popular: false
    }
  ];

  useEffect(() => {
    loadSubscriptions();
    loadFeatures();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from API
      // For now, use default templates
      setSubscriptions(defaultSubscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeatures = async () => {
    try {
      // In a real implementation, this would fetch from API
      setFeatures(availableFeatures);
    } catch (error) {
      console.error('Error loading features:', error);
    }
  };

  const saveSubscription = async (subscription) => {
    try {
      setSaving(true);
      
      // In a real implementation, this would save to backend
      console.log('Saving subscription:', subscription);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptions(prev => 
        prev.map(sub => sub.id === subscription.id ? subscription : sub)
      );
      
      setEditingSubscription(null);
      alert('Subscription saved successfully!');
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Failed to save subscription');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatureInSubscription = (subscriptionId, featureId) => {
    setSubscriptions(prev => 
      prev.map(sub => {
        if (sub.id === subscriptionId) {
          const features = [...sub.features];
          const index = features.indexOf(featureId);
          if (index > -1) {
            features.splice(index, 1);
          } else {
            features.push(featureId);
          }
          return { ...sub, features };
        }
        return sub;
      })
    );
  };

  const applySubscriptionToTenants = async (subscriptionId) => {
    try {
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      if (!subscription) return;

      const response = await api.post('/admin/apply-subscription-bundle', {
        subscriptionId,
        features: subscription.features
      });

      if (response.data.success) {
        alert(`Subscription bundle applied to ${response.data.tenantsUpdated} tenants`);
      } else {
        alert('Failed to apply subscription bundle');
      }
    } catch (error) {
      console.error('Error applying subscription:', error);
      alert('Error applying subscription bundle');
    }
  };

  const resetToDefaults = () => {
    setSubscriptions(defaultSubscriptions);
    alert('Reset to default templates');
  };

  return (
    <div className="subscription-catalog-manager">
      <div className="catalog-header">
        <h2>📦 Subscription Catalog Manager</h2>
        <p>Manage feature bundles and subscription tiers for your EMR platform</p>
      </div>

      <div className="catalog-tabs">
        <button 
          className={`tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          📦 Subscription Plans
        </button>
        <button 
          className={`tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          🎯 Feature Library
        </button>
        <button 
          className={`tab ${activeTab === 'apply' ? 'active' : ''}`}
          onClick={() => setActiveTab('apply')}
        >
          🚀 Apply to Tenants
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="catalog-content">
          <div className="subscriptions-grid">
            {subscriptions.map(subscription => (
              <div key={subscription.id} className="subscription-card">
                {subscription.popular && <div className="popular-badge">POPULAR</div>}
                
                <div className="subscription-header" style={{ backgroundColor: subscription.color }}>
                  <div className="subscription-icon">{subscription.icon}</div>
                  <div className="subscription-info">
                    <h3>{subscription.displayName}</h3>
                    <div className="subscription-price">{subscription.price}</div>
                  </div>
                </div>

                <div className="subscription-body">
                  <p className="subscription-description">{subscription.description}</p>
                  
                  <div className="features-list">
                    <h4>📋 Included Features:</h4>
                    {features
                      .filter(feature => subscription.features.includes(feature.id))
                      .map(feature => (
                        <div key={feature.id} className="feature-item">
                          <span className="feature-icon">{feature.icon}</span>
                          <div className="feature-details">
                            <div className="feature-name">{feature.name}</div>
                            <div className="feature-description">{feature.description}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="subscription-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => setEditingSubscription(subscription)}
                    >
                      ✏️ Edit Bundle
                    </button>
                    <button 
                      className="btn-apply"
                      onClick={() => applySubscriptionToTenants(subscription.id)}
                    >
                      🚀 Apply to Tenants
                    </button>
                  </div>
              </div>
            ))}
          </div>

          <div className="catalog-actions">
            <button className="btn-secondary" onClick={resetToDefaults}>
              🔄 Reset to Defaults
            </button>
            <button className="btn-primary" onClick={() => alert('Publish to production')}>
              📢 Publish Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="features-catalog">
          <h3>🎯 Feature Library</h3>
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon-large">{feature.icon}</div>
                  <div className="feature-info">
                    <h4>{feature.name}</h4>
                    <span className="feature-category">{feature.category}</span>
                  </div>
                </div>
                <div className="feature-description-full">
                  {feature.description}
                </div>
                <div className="feature-tier">
                  <strong>Default Tier:</strong> {feature.tier}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'apply' && (
        <div className="apply-bulk">
          <h3>🚀 Apply Subscription Bundles to Tenants</h3>
          <div className="bulk-actions">
            {subscriptions.map(subscription => (
              <div key={subscription.id} className="bulk-item">
                <div className="bulk-info">
                  <h4>{subscription.displayName}</h4>
                  <p>{subscription.features.length} features included</p>
                </div>
                <button 
                  className="btn-bulk-apply"
                  onClick={() => applySubscriptionToTenants(subscription.id)}
                >
                  Apply to All Tenants
                </button>
              </div>
            ))}
          </div>
          
          <div className="apply-actions">
            <button className="btn-secondary" onClick={() => alert('Preview changes')}>
              👁️ Preview Changes
            </button>
            <button className="btn-primary" onClick={() => alert('Apply all changes')}>
              🚀 Apply All Changes
            </button>
          </div>
        </div>
      )}

      {editingSubscription && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>✏️ Edit Subscription Bundle</h3>
              <button onClick={() => setEditingSubscription(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={editingSubscription.displayName}
                  onChange={(e) => setEditingSubscription({
                    ...editingSubscription,
                    displayName: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={editingSubscription.description}
                  onChange={(e) => setEditingSubscription({
                    ...editingSubscription,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="text" 
                  value={editingSubscription.price}
                  onChange={(e) => setEditingSubscription({
                    ...editingSubscription,
                    price: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Features</label>
                <div className="feature-selector">
                  {features.map(feature => (
                    <label key={feature.id}>
                      <input 
                        type="checkbox" 
                        checked={editingSubscription.features.includes(feature.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingSubscription({
                              ...editingSubscription,
                              features: [...editingSubscription.features, feature.id]
                            });
                          } else {
                            setEditingSubscription({
                              ...editingSubscription,
                              features: editingSubscription.features.filter(f => f !== feature.id)
                            });
                          }
                        }}
                      />
                      <span>{feature.icon} {feature.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditingSubscription(null)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => saveSubscription(editingSubscription)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}


