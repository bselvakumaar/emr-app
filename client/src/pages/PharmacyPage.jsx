
import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function PharmacyPage({ tenant, providers, onRestock, onDispense }) {
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
        if (!confirm('Dispense this prescription? This will reduce inventory stock.')) return;
        try {
            const response = await api.dispensePrescription(prescription.id, {
                tenantId: tenant.id,
                status: 'Dispensed'
            });
            loadPrescriptions();
            if (onDispense) onDispense(response);
        } catch (err) {
            alert('Failed to dispense: ' + err.message);
        }
    };

    return (
        <section className="view">
            <article className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Pharmacy Prescriptions</h3>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Dispensed">Dispensed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? <p>Loading prescriptions...</p> : (
                    <table style={{ background: '#fff', width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Date</th>
                                <th style={{ padding: '10px' }}>Patient</th>
                                <th style={{ padding: '10px' }}>Medication</th>
                                <th style={{ padding: '10px' }}>Dosage</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        No prescriptions found.
                                    </td>
                                </tr>
                            )}
                            {prescriptions.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px' }}>{new Date(p.createdAt || p.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px' }}>{p.patient_name || p.patientId}</td>
                                    <td style={{ padding: '10px', fontWeight: '500' }}>{p.drug_name}</td>
                                    <td style={{ padding: '10px' }}>{p.dosage}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            background: p.status === 'Pending' ? '#fff7ed' : (p.status === 'Dispensed' ? '#f0fdf4' : '#f1f5f9'),
                                            color: p.status === 'Pending' ? '#c2410c' : (p.status === 'Dispensed' ? '#16a34a' : '#64748b')
                                        }}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {p.status === 'Pending' && (
                                            <button
                                                className="action-btn"
                                                style={{ padding: '4px 12px', borderRadius: '6px', background: 'white', border: '1px solid #16a34a', color: '#16a34a', cursor: 'pointer' }}
                                                onClick={() => handleDispense(p)}
                                            >
                                                Dispense
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </article>
        </section>
    );
}
