import { useState, useEffect } from 'react';
import api from '../api.js';
import { currency } from '../utils/format.js';

export default function AccountsPage({ tenant }) {
    const [financials, setFinancials] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7) + '-01');

    useEffect(() => {
        async function load() {
            if (!tenant) return;
            const data = await api.getFinancials(tenant.id, currentMonth);
            setFinancials(data);
            // We don't have getExpenses exposed directly, but we can assume getFinancials might return detail or we use the summary for now.
            // Actually, let's just stick to the summary provided by repo.getFinancials
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
        const data = await api.getFinancials(tenant.id, currentMonth);
        setFinancials(data);
        e.target.reset();
    }

    return (
        <section className="view">
            <div className="grid-2">
                <article className="panel">
                    <h3>Record Outflow</h3>
                    <form className="form-grid" onSubmit={handleAddExpense}>
                        <select name="category" required>
                            <option>Purchase</option>
                            <option>Salary</option>
                            <option>Maintenance</option>
                            <option>Utilities</option>
                            <option>Govt Fees</option>
                            <option>Certifications</option>
                            <option>Subscriptions</option>
                            <option>Equipment</option>
                            <option>Other</option>
                        </select>
                        <input name="amount" type="number" placeholder="Amount" required />
                        <input name="description" placeholder="Description / Item Name" required style={{ gridColumn: 'span 2' }} />
                        <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
                        <select name="paymentMethod">
                            <option>Bank Transfer</option>
                            <option>Cash</option>
                            <option>Cheque</option>
                            <option>Card</option>
                        </select>
                        <input name="reference" placeholder="Ref No / Transaction ID" />
                        <button type="submit" className="primary-btn">Record Expense</button>
                    </form>
                </article>

                <article className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Financial Snapshot</h3>
                        <input type="month" value={currentMonth.slice(0, 7)} onChange={e => setCurrentMonth(e.target.value + '-01')} />
                    </div>

                    {financials && (
                        <div className="financial-summary">
                            <div className="summary-card income">
                                <span>Inward (Fees/Services)</span>
                                <strong>{currency(financials.income)}</strong>
                            </div>
                            <div className="summary-card expense">
                                <span>Outward (Expenses)</span>
                                <strong>{currency(Object.values(financials.expenses).reduce((a, b) => a + b, 0))}</strong>
                            </div>
                            <div className="summary-card balance">
                                <span>Net Balance</span>
                                <strong style={{
                                    color: (financials.income - Object.values(financials.expenses).reduce((a, b) => a + b, 0)) >= 0 ? '#16a34a' : '#dc2626'
                                }}>
                                    {currency(financials.income - Object.values(financials.expenses).reduce((a, b) => a + b, 0))}
                                </strong>
                            </div>
                        </div>
                    )}

                    {financials?.projectedSalaries > 0 && (
                        <div className="alert-box info">
                            <strong>Payroll Projection: </strong>
                            The estimated monthly salary outflow for active employees is {currency(financials.projectedSalaries)}.
                        </div>
                    )}

                    <h4>Expense Breakdown</h4>
                    <table className="simple-table">
                        <tbody>
                            {financials && Object.entries(financials.expenses).map(([cat, amt]) => (
                                <tr key={cat}>
                                    <td>{cat}</td>
                                    <td style={{ textAlign: 'right' }}>{currency(amt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </article>
            </div>

            <style>{`
        .financial-summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .summary-card { padding: 1rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
        .summary-card span { font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; }
        .summary-card strong { font-size: 1.5rem; color: #0f172a; }
        .summary-card.income strong { color: #16a34a; }
        .summary-card.expense strong { color: #dc2626; }
        .alert-box { padding: 1rem; background: #eff6ff; border: 1px solid #dbeafe; border-radius: 6px; color: #1e40af; margin-bottom: 1.5rem; font-size: 0.9rem; }
      `}</style>
        </section>
    );
}
