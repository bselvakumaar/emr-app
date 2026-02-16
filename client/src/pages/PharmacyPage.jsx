
import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function PharmacyPage({ tenant, providers, onRestock, onDispense }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [statusFilter, setStatusFilter] = useState('Pending');

    useEffect(() => {
        loadPrescriptions();
    }, [statusFilter]);

    const loadPrescriptions = async () => {
        setLoading(true);
        try {
            // Assuming getPrescriptions supports filters
            const allPrescriptions = await api.getPrescriptions(tenant.id, { status: statusFilter });
            setPrescriptions(allPrescriptions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDispense = async (prescription) => {
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
                    <table style={{ background: '#fff' }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Patient</th>
                                <th>Medication</th>
                                <th>Dosage</th>
                                <th>Instructions</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No prescriptions found.</td></tr>}
                            {Array.isArray(prescriptions) && prescriptions.map(p => (
                                <tr key={p.id}>
                                    <td>{new Date(p.createdAt || p.created_at).toLocaleDateString()}</td>
                                    <td>{p.patient_name || p.patientId}</td>
                                    <td style={{ fontWeight: '500' }}>{p.drug_name}</td>
                                    <td>{p.dosage}</td>
                                    <td style={{ fontSize: '12px', color: '#64748b' }}>{p.instructions}</td>
                                    <td>
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
                                    <td>
                                        {p.status === 'Pending' && (
                                            <button className="action-btn" style={{ color: '#16a34a', borderColor: '#16a34a' }} onClick={() => handleDispense(p)}>Dispense</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </article>

            {/* Could add Inventory Quick View here */}
        </section>
    );
}
