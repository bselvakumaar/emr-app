import { useState, useEffect } from 'react';
import api from '../api.js';
import { currency } from '../utils/format.js';

const CATEGORIES = ['Purchase', 'Salary', 'Maintenance', 'Utilities', 'Govt Fees', 'Certifications', 'Subscriptions', 'Equipment', 'Other'];
const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'Cheque', 'Card'];

export default function AccountsPage({ tenant }) {
    const [financials, setFinancials] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7) + '-01');
    const [activeTab, setActiveTab] = useState('snapshot'); // 'snapshot' | 'record' | 'ledger'

    useEffect(() => {
        async function load() {
            if (!tenant) return;
            const [data, expenseList] = await Promise.all([
                api.getFinancials(tenant.id, currentMonth),
                api.getExpenses(tenant.id, currentMonth)
            ]);
            setFinancials(data);
            setExpenses(expenseList || []);
        }
        load();
    }, [tenant, currentMonth]);

    async function handleAddExpense(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        await api.addExpense({
            tenantId: tenant.id,
            category: fd.get('category'),
            description: fd.get('description'),
            amount: Number(fd.get('amount')),
            date: fd.get('date'),
            paymentMethod: fd.get('paymentMethod'),
            reference: fd.get('reference')
        });
        // refresh
        const [data, expenseList] = await Promise.all([
            api.getFinancials(tenant.id, currentMonth),
            api.getExpenses(tenant.id, currentMonth)
        ]);
        setFinancials(data);
        setExpenses(expenseList || []);
        e.target.reset();
        setActiveTab('ledger');
    }

    const totalExpenses = financials ? Object.values(financials.expenses).reduce((a, b) => a + b, 0) : 0;
    const netBalance = financials ? financials.income - totalExpenses : 0;

    return (
        <section className="view accounts-workspace">
            {/* Tab Navigation */}
            <div className="accounts-tabs">
                <button className={`tab-btn ${activeTab === 'snapshot' ? 'active' : ''}`} onClick={() => setActiveTab('snapshot')}>
                    📊 Financial Snapshot
                </button>
                <button className={`tab-btn ${activeTab === 'record' ? 'active' : ''}`} onClick={() => setActiveTab('record')}>
                    ➕ Record Outflow
                </button>
                <button className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
                    📒 Expense Ledger ({expenses.length})
                </button>
                <div className="tab-spacer" />
                <input
                    type="month"
                    value={currentMonth.slice(0, 7)}
                    onChange={e => setCurrentMonth(e.target.value + '-01')}
                    className="month-picker"
                />
            </div>

            {/* Financial Snapshot */}
            {activeTab === 'snapshot' && financials && (
                <div className="snapshot-grid">
                    <div className="summary-grid-3">
                        <div className="finance-card income">
                            <div className="finance-card-icon">↓</div>
                            <div className="finance-card-body">
                                <span className="finance-label">Inward (Revenue)</span>
                                <strong className="finance-value">{currency(financials.income)}</strong>
                                <span className="finance-sub">Invoices collected this month</span>
                            </div>
                        </div>
                        <div className="finance-card expense">
                            <div className="finance-card-icon">↑</div>
                            <div className="finance-card-body">
                                <span className="finance-label">Outward (Expenses)</span>
                                <strong className="finance-value">{currency(totalExpenses)}</strong>
                                <span className="finance-sub">{Object.keys(financials.expenses).length} categories</span>
                            </div>
                        </div>
                        <div className="finance-card balance">
                            <div className="finance-card-icon">≈</div>
                            <div className="finance-card-body">
                                <span className="finance-label">Net Balance</span>
                                <strong className="finance-value" style={{ color: netBalance >= 0 ? '#16a34a' : '#dc2626' }}>
                                    {currency(netBalance)}
                                </strong>
                                <span className="finance-sub">{netBalance >= 0 ? 'Profitable' : 'Deficit'}</span>
                            </div>
                        </div>
                    </div>

                    {financials.projectedSalaries > 0 && (
                        <div className="payroll-banner">
                            <div className="payroll-icon">💰</div>
                            <div>
                                <strong>Payroll Projection</strong>
                                <p>Estimated monthly salary liability for active employees: <strong>{currency(financials.projectedSalaries)}</strong></p>
                            </div>
                        </div>
                    )}

                    <article className="panel">
                        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Expense Breakdown by Category
                        </h3>
                        {Object.keys(financials.expenses).length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No expenses recorded for this month.</p>
                        ) : (
                            <div className="breakdown-bars">
                                {Object.entries(financials.expenses)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([cat, amt]) => (
                                        <div key={cat} className="bar-item">
                                            <div className="bar-label">
                                                <span>{cat}</span>
                                                <strong>{currency(amt)}</strong>
                                            </div>
                                            <div className="bar-track">
                                                <div
                                                    className="bar-fill"
                                                    style={{ width: `${totalExpenses > 0 ? (amt / totalExpenses * 100) : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </article>
                </div>
            )}

            {/* Record Outflow */}
            {activeTab === 'record' && (
                <article className="panel" style={{ maxWidth: '640px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Record New Expense</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Log operational expenses and outward payments.</p>
                    </div>
                    <form className="structured-form" onSubmit={handleAddExpense}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="field">
                                    <label className="field-label">Category</label>
                                    <select name="category" required>
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="field">
                                    <label className="field-label">Amount (₹)</label>
                                    <input name="amount" type="number" step="0.01" placeholder="0.00" required />
                                </div>
                            </div>
                            <div className="field">
                                <label className="field-label">Description / Item Name</label>
                                <input name="description" placeholder="e.g. Monthly electricity bill" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="field">
                                    <label className="field-label">Date</label>
                                    <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
                                </div>
                                <div className="field">
                                    <label className="field-label">Payment Method</label>
                                    <select name="paymentMethod">
                                        {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="field">
                                    <label className="field-label">Reference / TXN ID</label>
                                    <input name="reference" placeholder="Optional" />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="primary-submit-btn" style={{ background: '#f59e0b', marginTop: '1.5rem' }}>
                            💸 Record Expense
                        </button>
                    </form>
                </article>
            )}

            {/* Expense Ledger */}
            {activeTab === 'ledger' && (
                <article className="panel">
                    <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Expense Transaction History
                    </h3>
                    <table className="clinical-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Payment</th>
                                <th>Reference</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 && (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No expenses recorded for this period.</td></tr>
                            )}
                            {expenses.map((exp) => (
                                <tr key={exp.id}>
                                    <td style={{ fontSize: '12px', color: '#64748b' }}>
                                        {exp.date ? new Date(exp.date).toLocaleDateString('en-IN') : '-'}
                                    </td>
                                    <td>
                                        <span className="category-badge">{exp.category}</span>
                                    </td>
                                    <td style={{ maxWidth: '220px' }}>{exp.description}</td>
                                    <td style={{ fontSize: '12px', color: '#64748b' }}>{exp.payment_method || '-'}</td>
                                    <td style={{ fontSize: '12px', color: '#94a3b8' }}>{exp.reference || '-'}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                                        {currency(parseFloat(exp.amount))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {expenses.length > 0 && (
                            <tfoot>
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'right', fontWeight: 700, color: '#475569' }}>Total:</td>
                                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: '16px' }}>
                                        {currency(expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0))}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </article>
            )}

            <style>{`
                .accounts-workspace .accounts-tabs { display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; align-items: center; flex-wrap: wrap; }
                .accounts-workspace .tab-btn { padding: 8px 16px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; border-radius: 8px; transition: 0.2s; font-size: 13px; }
                .accounts-workspace .tab-btn.active { color: #f59e0b; background: #fffbeb; }
                .accounts-workspace .tab-btn:hover { background: #f8fafc; }
                .tab-spacer { flex: 1; }
                .month-picker { padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #475569; background: #f8fafc; }

                .summary-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .finance-card { display: flex; align-items: center; gap: 16px; padding: 1.25rem; border-radius: 12px; background: white; border: 1px solid #e2e8f0; transition: 0.3s; }
                .finance-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
                .finance-card-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-size: 18px; font-weight: 800; }
                .finance-card.income .finance-card-icon { background: #dcfce7; color: #16a34a; }
                .finance-card.expense .finance-card-icon { background: #fee2e2; color: #dc2626; }
                .finance-card.balance .finance-card-icon { background: #dbeafe; color: #3b82f6; }
                .finance-card-body { display: flex; flex-direction: column; }
                .finance-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; font-weight: 700; }
                .finance-value { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 2px 0; }
                .finance-sub { font-size: 11px; color: #94a3b8; }
                .finance-card.income .finance-value { color: #16a34a; }
                .finance-card.expense .finance-value { color: #dc2626; }

                .payroll-banner { display: flex; align-items: center; gap: 16px; padding: 1rem 1.25rem; background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1px solid #fde68a; border-radius: 10px; margin-bottom: 1.5rem; }
                .payroll-banner .payroll-icon { font-size: 28px; }
                .payroll-banner strong { color: #92400e; font-size: 14px; }
                .payroll-banner p { margin: 4px 0 0; font-size: 13px; color: #78350f; }

                .breakdown-bars { display: flex; flex-direction: column; gap: 12px; }
                .bar-item { display: flex; flex-direction: column; gap: 4px; }
                .bar-label { display: flex; justify-content: space-between; font-size: 13px; color: #475569; }
                .bar-label strong { color: #0f172a; }
                .bar-track { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
                .bar-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #f97316); border-radius: 4px; transition: width 0.5s ease; min-width: 4px; }

                .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em; display: block; margin-bottom: 6px; }

                .clinical-table { width: 100%; border-collapse: collapse; }
                .clinical-table th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                .clinical-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                .clinical-table tfoot td { border-top: 2px solid #e2e8f0; border-bottom: none; padding: 16px 12px; }

                .category-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #92400e; }

                .primary-submit-btn { width: 100%; padding: 12px; border: none; border-radius: 8px; color: white; font-weight: 700; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(245,158,11,0.3); font-size: 14px; }
                .primary-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }

                @media (max-width: 768px) {
                    .summary-grid-3 { grid-template-columns: 1fr; }
                    .accounts-tabs { gap: 4px; }
                }
            `}</style>
        </section>
    );
}
