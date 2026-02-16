
import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function InpatientPage({ tenant, providers, onDischarge }) {
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInpatientEncounters();
    }, []);

    const loadInpatientEncounters = async () => {
        setLoading(true);
        try {
            const allEncounters = await api.getEncounters(tenant.id); // Assuming getEncounters supports filtering or filter client side.
            // Filter for IPD and Open status
            const ipd = allEncounters.filter(e => (e.encounter_type === 'In-patient' || e.type === 'IPD') && e.status === 'open');
            setEncounters(ipd);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDischarge = async (encounter) => {
        if (!confirm('Discharge this patient?')) return;

        const diagnosis = prompt('Discharge Diagnosis:', encounter.diagnosis || '');
        if (diagnosis === null) return;

        const notes = prompt('Discharge Notes:', 'Stable condition');
        if (notes === null) return;

        try {
            await api.dischargePatient(encounter.id, { diagnosis, notes });
            loadInpatientEncounters();
            if (onDischarge) onDischarge();
        } catch (err) {
            alert('Failed to discharge: ' + err.message);
        }
    };

    return (
        <section className="view">
            <article className="panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Inpatient Admissions (Bed Management)</h3>
                    <button className="action-btn" onClick={loadInpatientEncounters}>Refresh</button>
                </div>

                {loading ? <p>Loading...</p> : (
                    <table style={{ marginTop: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Admission Date</th>
                                <th>Diagnosis</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encounters.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No active inpatient admissions.</td></tr>}
                            {Array.isArray(encounters) && encounters.map(e => (
                                <tr key={e.id}>
                                    <td style={{ fontWeight: '600' }}>{e.patient_name || e.patientId}</td>
                                    <td>{new Date(e.created_at || e.visit_date).toLocaleString()}</td>
                                    <td>{e.diagnosis}</td>
                                    <td><span className="badge live">Admitted</span></td>
                                    <td>
                                        <button className="action-btn" style={{ color: '#d97706', borderColor: '#d97706' }} onClick={() => handleDischarge(e)}>Discharge</button>
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
