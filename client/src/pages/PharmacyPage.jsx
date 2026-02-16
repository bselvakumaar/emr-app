import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function PharmacyPage({ tenant, onDispense }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('Pending');

    useEffect(() => {
        loadPrescriptions();
    }, [statusFilter]);

    const loadPrescriptions = async () => {
        setLoading(true);
        try {
            const allPrescriptions = await api.getPrescriptions(tenant.id, { status: statusFilter });
            setPrescriptions(allPrescriptions || []);
        } catch (err) {
            console.error(err);
            setPrescriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDispense = async (prescription) => {
        // eslint-disable-next-line
        if (!confirm('Finalize dispensation? This will adjust inventory stock levels across the facility.')) return;
        try {
            const response = await api.dispensePrescription(prescription.id, {
                tenantId: tenant.id,
                status: 'Dispensed'
            });
            loadPrescriptions();
            if (onDispense) onDispense(response);
        } catch (err) {
            alert('Dispensation Registry Error: ' + err.message);
        }
    };

    return (
        <section className="view pharmacy-workspace">
            <header className="pharmacy-header">
                <div className="title-stack">
                    <h2>Medication Dispensation Queue</h2>
                    <p>Monitoring drug issuance and facility pharmacy operations</p>
                </div>
                <div className="filter-shelf premium-glass">
                    <span className="filter-label">Filing Status:</span>
                    <div className="filter-pills">
                        {['Pending', 'Dispensed', 'Cancelled'].map(s => (
                            <button
                                key={s}
                                className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
                                onClick={() => setStatusFilter(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <article className="dispensation-ledger premium-glass">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Refreshing clinical prescriptions...</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Registry Time</th>
                                    <th>Clinical Subject</th>
                                    <th>Line Item / Medication</th>
                                    <th>Usage Protocol</th>
                                    <th>Status Registry</th>
                                    <th style={{ textAlign: 'right' }}>Logistics</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty-table-msg">
                                            <div className="empty-ill">💊</div>
                                            No clinical prescriptions identified in this queue.
                                        </td>
                                    </tr>
                                ) : prescriptions.map(p => (
                                    <tr key={p.id} className="ledger-row">
                                        <td className="date-cell">
                                            <strong>{new Date(p.createdAt || p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</strong><br />
                                            <span>{new Date(p.createdAt || p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="patient-cell">
                                            <strong>{p.patient_name || p.patientId}</strong><br />
                                            <span className="tiny-id">PID: {(p.patientId || 'NEW').slice(0, 8).toUpperCase()}</span>
                                        </td>
                                        <td>
                                            <div className="med-pill-box">
                                                <span className="med-title">{p.drug_name}</span>
                                                <span className="med-sub">Unit: Standard Dispensation</span>
                                            </div>
                                        </td>
                                        <td className="dose-cell">{p.dosage}</td>
                                        <td>
                                            <span className={`status-chip-rich ${p.status.toLowerCase()}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {p.status === 'Pending' && (
                                                <button
                                                    className="dispense-btn-premium"
                                                    onClick={() => handleDispense(p)}
                                                >
                                                    Finalize Dispense
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </article>

            <style>{`
               .pharmacy-workspace { animation: fade-in 0.5s ease-out; }
               .pharmacy-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
               .pharmacy-header h2 { margin: 0; font-size: 1.75rem; font-weight: 900; color: #0f172a; letter-spacing: -0.025em; }
               .pharmacy-header p { margin: 4px 0 0; color: #64748b; font-size: 0.95rem; font-weight: 600; }
               
               .premium-glass { background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 25px rgba(0,0,0,0.03); }
               
               .filter-shelf { display: flex; align-items: center; gap: 12px; padding: 6px 16px; width: fit-content; }
               .filter-label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
               .filter-pills { display: flex; gap: 4px; }
               .filter-pill { padding: 6px 14px; border: none; background: transparent; color: #64748b; font-size: 11px; font-weight: 800; border-radius: 8px; cursor: pointer; transition: 0.2s; }
               .filter-pill:hover { background: #f8fafc; }
               .filter-pill.active { background: var(--tenant-primary); color: white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }

               .dispensation-ledger { padding: 0; overflow: hidden; }
               .table-wrapper { overflow-x: auto; }
               .premium-table { width: 100%; border-collapse: collapse; }
               .premium-table th { text-align: left; padding: 1.25rem 1.5rem; background: #f8fafc; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; border-bottom: 1px solid #f1f5f9; }
               .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
               
               .ledger-row { transition: 0.2s; }
               .ledger-row:hover { background: #fcfdfe; }
               
               .date-cell { font-size: 13px; color: #475569; line-height: 1.4; }
               .date-cell span { font-size: 11px; color: #94a3b8; font-weight: 700; }
               
               .patient-cell strong { color: #0f172a; font-size: 14px; }
               .tiny-id { font-size: 10px; color: #94a3b8; font-weight: 800; }
               
               .med-pill-box { display: flex; flex-direction: column; }
               .med-title { font-weight: 800; color: var(--tenant-primary); font-size: 14px; }
               .med-sub { font-size: 11px; color: #94a3b8; font-weight: 600; }
               
               .dose-cell { font-weight: 700; color: #334155; font-size: 13px; }
               
               .status-chip-rich { padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
               .status-chip-rich.pending { background: #ff7e331a; color: #ea580c; border: 1px solid #ff7e3333; }
               .status-chip-rich.dispensed { background: #10b9811a; color: #059669; border: 1px solid #10b98133; }
               .status-chip-rich.cancelled { background: #64748b1a; color: #475569; border: 1px solid #64748b33; }
               
               .dispense-btn-premium { background: var(--tenant-primary); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }
               .dispense-btn-premium:hover { transform: translateY(-1px); box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3); }
               
               .empty-table-msg { text-align: center; padding: 5rem; color: #cbd5e1; font-weight: 700; font-style: italic; }
               .empty-ill { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; font-style: normal; }
               
               .loading-state { text-align: center; padding: 5rem; color: #94a3b8; }
               .spinner { width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top-color: var(--tenant-primary); border-radius: 50%; display: inline-block; animation: spin 1s infinite linear; margin-bottom: 1rem; }
               @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </section>
    );
}
