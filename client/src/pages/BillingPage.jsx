import { useState } from 'react';
import PatientSearch from '../components/PatientSearch.jsx';
import { currency, patientName } from '../utils/format.js';

function printInvoice(invoice, patients, tenant) {
  const pName = patientName(invoice.patientId, patients);
  const w = window.open('', '_blank', 'width=800,height=900');
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${invoice.number}</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 40px; }
        .clinic-info h1 { color: #059669; margin: 0; font-size: 24px; }
        .clinic-info p { margin: 2px 0; color: #64748b; font-size: 13px; }
        .bill-label { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.025em; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .meta-box h4 { font-size: 11px; text-transform: uppercase; color: #94a3b8; margin: 0 0 8px; letter-spacing: 0.1em; }
        .meta-box p { font-size: 15px; font-weight: 600; color: #334155; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 11px; text-transform: uppercase; }
        td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .amount-col { text-align: right; font-weight: 600; }
        .totals { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .total-row { display: flex; justify-content: space-between; width: 250px; font-size: 14px; color: #64748b; }
        .grand-total { border-top: 2px solid #059669; padding-top: 12px; margin-top: 8px; color: #1e293b; font-size: 20px; font-weight: 800; }
        .footer { margin-top: 80px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body onload="window.print(); window.close();">
      <div class="header">
        <div class="clinic-info">
          <h1>${tenant?.name || 'EMR Medical Center'}</h1>
          <p>Certified Outpatient & Inpatient Services</p>
          <p>Contact: +91 XXXXX XXXXX</p>
        </div>
        <div style="text-align: right">
          <h2 class="bill-label">INVOICE</h2>
          <p style="color: #64748b; font-size: 13px;">#${invoice.number}</p>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-box">
          <h4>Billed To</h4>
          <p>${pName}</p>
          <p style="font-weight: 400; font-size: 13px;">Patient ID: ${invoice.patientId || 'N/A'}</p>
        </div>
        <div class="meta-box" style="text-align: right">
          <h4>Invoice Date</h4>
          <p>${new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description of Services</th>
            <th style="text-align: right">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoice.description || 'Clinical Consultation & Services'}</td>
            <td class="amount-col">${currency(invoice.subtotal)}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row"><span>Subtotal</span><strong>${currency(invoice.subtotal)}</strong></div>
        <div class="total-row"><span>GST / Tax</span><strong>${currency(invoice.tax)}</strong></div>
        <div class="total-row grand-total"><span>Total Amount</span><span>${currency(invoice.total)}</span></div>
        ${invoice.status === 'paid' ? '<div style="margin-top: 8px; color: #10b981; font-weight: 800; text-transform: uppercase; font-size: 12px;">✅ FULLY PAID</div>' : ''}
      </div>

      <div class="footer">
        <p>This is a computer-generated tax invoice. Registered with Health Authority.</p>
        <p style="margin-top: 4px;">Thank you for choosing ${tenant?.name || 'us'}.</p>
      </div>
    </body>
    </html>
  `);
  w.document.close();
}

export default function BillingPage({ tenant, patients,
  invoices,
  setView,
  setActivePatientId,
  onIssueInvoice,
  onMarkPaid }) {
  const [activeView, setActiveView] = useState('list'); // 'list' | 'create'

  const sortedInvoices = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className="view billing-workspace">
      <div className="workspace-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          className={`tab-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          📄 Transaction Ledger
        </button>
        <button
          className={`tab-btn ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => setActiveView('create')}
          style={{ marginLeft: 'auto', background: '#3b82f6', color: 'white' }}
        >
          + Create New Invoice
        </button>
      </div>

      {activeView === 'create' && (
        <article className="panel" style={{ maxWidth: '600px', margin: '0 0 2rem' }}>
          <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, border: 'none' }}>Issue Patient Invoice</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Enter medical services and costs to generate a bill.</p>
          </div>
          <form className="structured-form" onSubmit={(e) => {
            onIssueInvoice(e);
            setActiveView('list');
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <PatientSearch tenantId={tenant.id} />

              <div className="field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Service Description</label>
                <input name="description" placeholder="e.g. Consultation + Lab Tests" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Base Amount (₹)</label>
                  <input name="amount" type="number" step="0.01" placeholder="0.00" required />
                </div>
                <div className="field">
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Tax Percent (%)</label>
                  <input name="taxPercent" type="number" step="0.01" defaultValue="5" />
                </div>
              </div>

              <div className="field">
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Payment Method</label>
                <select name="paymentMethod" defaultValue="Cash">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI / Digital</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
            </div>
            <button type="submit" className="primary-submit-btn" style={{ background: '#3b82f6', marginTop: '1.5rem' }}>
              Generate & Finalize Invoice
            </button>
          </form>
        </article>
      )}

      {activeView === 'list' && (
        <article className="panel">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice #</th>
                <th>Patient Identity</th>
                <th>Total Value</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Financial Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No financial transactions found.</td></tr>
              )}
              {Array.isArray(sortedInvoices) && sortedInvoices.map((i) => (
                <tr key={i.id}>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>
                    {i.createdAt ? new Date(i.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </td>
                  <td><code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>{i.number}</code></td>
                  <td>
                    <div
                      style={{ fontWeight: 600, color: '#10b981', cursor: 'pointer' }}
                      onClick={() => { setActivePatientId(i.patientId); setView('patients'); }}
                    >
                      {patientName(i.patientId, patients) || 'Patient Record'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {i.patientId?.slice(0, 8)}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{currency(i.total)}</td>
                  <td>
                    <span className={`badge-status ${i.status}`} style={{
                      background: i.status === 'paid' ? '#dcfce7' : '#fef9c3',
                      color: i.status === 'paid' ? '#16a34a' : '#ca8a04',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 800
                    }}>
                      {i.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {i.status !== 'paid' && (
                        <button className="mini-action-btn" onClick={() => onMarkPaid(i.id)} style={{ color: '#10b981', borderColor: '#d1fae5' }}>Mark Paid</button>
                      )}
                      <button className="mini-action-btn" onClick={() => printInvoice(i, patients, tenant)} style={{ border: 'none', background: '#f8fafc' }}>🖨️ Print</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      )}

      <style>{`
        .billing-workspace .tab-btn { padding: 8px 16px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; border-radius: 8px; transition: 0.2s; }
        .billing-workspace .tab-btn.active { color: #3b82f6; background: #eff6ff; }
        .primary-submit-btn { width: 100%; padding: 12px; border: none; border-radius: 8px; color: white; font-weight: 700; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(59,130,246,0.3); }
        .clinical-table { width: 100%; border-collapse: collapse; }
        .clinical-table th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
        .clinical-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .mini-action-btn { padding: 4px 12px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; font-size: 12px; cursor: pointer; transition: 0.2s; font-weight: 600; }
        .mini-action-btn:hover { border-color: #3b82f6; color: #3b82f6; }
      `}</style>
    </section>
  );
}
