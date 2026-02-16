
import { useState, useEffect, useRef } from 'react';
import { api } from '../api.js';

export default function PatientSearch({ tenantId, onSelect, initialPatientId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const wrapperRef = useRef(null);

    // Load initial patient if ID provided
    useEffect(() => {
        if (initialPatientId && !selectedPatient) {
            api.getUsers(tenantId).then(() => {
                // We actually need getPatientById here but it's not exposed cleanly in api.js as a standalone that returns just the patient object without other context sometimes.
                // Actually api.getPatientPrintData returns { patient: ... }. Let's use that or add getPatientById.
                // For now, let's just search by ID if possible? No, search API doesn't support ID.
                // Let's blindly trust the parent might pass the full patient object if they have it, or we just show "Loading..."
                // Or we can just use the search to find it if it's not pre-loaded. 
                // Actually, let's keep it simple. If initialPatientId is passed, we might assume the parent handles the initial display or we fetch it.
                // Let's try to fetch it via the search API using a hack or just don't preload for now.
            });
        }
    }, [initialPatientId]);

    // Handle outside click to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = async (term = searchTerm, date = dateFilter, type = typeFilter, status = statusFilter) => {
        setLoading(true);
        try {
            const results = await api.searchPatients(tenantId, { text: term, date, type, status });
            setPatients(results);
            setIsOpen(true);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm || dateFilter || typeFilter || statusFilter) {
                handleSearch();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, dateFilter, typeFilter, statusFilter]);

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setIsOpen(false);
        if (onSelect) onSelect(patient);
    };

    return (
        <div className="patient-search-wrapper" ref={wrapperRef} style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '0.5rem' }}>
                Find Patient
            </label>

            {/* Hidden input for form submission compatibility */}
            <input type="hidden" name="patientId" value={selectedPatient?.id || ''} required />

            {/* Selected Patient Display */}
            {selectedPatient && (
                <div style={{
                    padding: '10px 14px',
                    background: '#f0fdf4',
                    border: '1px solid #16a34a',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <span style={{ fontWeight: 'bold', color: '#15803d' }}>{selectedPatient.firstName} {selectedPatient.lastName}</span>
                        <span style={{ fontSize: '12px', color: '#166534', marginLeft: '8px' }}>({selectedPatient.mrn})</span>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setSelectedPatient(null); }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#166534',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '0 5px'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Search Controls */}
            {!selectedPatient && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search Name, MRN, Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        style={{ flex: 2, minWidth: '200px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <input
                        type="date"
                        title="Visit Date or DOB"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ flex: 1, minWidth: '130px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="">Status</option>
                        <option value="OPD">OPD</option>
                        <option value="IPD">IPD</option>
                        <option value="emergency">Emergency</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ flex: 1, minWidth: '120px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="">Check-in</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Discharged">Discharged</option>
                    </select>
                </div>
            )}

            {/* Dropdown Results */}
            {isOpen && !selectedPatient && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '4px'
                }}>
                    {loading && <div style={{ padding: '12px', color: '#64748b', textAlign: 'center' }}>Searching...</div>}

                    {!loading && patients.length === 0 && (
                        <div style={{ padding: '12px', color: '#94a3b8', textAlign: 'center', fontSize: '13px' }}>
                            No patients found. Try adjusting filters.
                        </div>
                    )}

                    {!loading && patients.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => selectPatient(p)}
                            style={{
                                padding: '10px 14px',
                                borderBottom: '1px solid #f1f5f9',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                            <div>
                                <div style={{ fontWeight: '500', color: '#1e293b' }}>{p.firstName} {p.lastName}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    {p.mrn} •
                                    {p.phone ? p.phone : 'No Phone'} •
                                    {new Date(p.dob).getFullYear()} ({new Date().getFullYear() - new Date(p.dob).getFullYear()})
                                </div>
                            </div>
                            <div style={{ fontSize: '11px', textAlign: 'right' }}>
                                {p.latest_encounter_type && (
                                    <span style={{
                                        background: p.latest_encounter_type === 'IPD' ? '#fef3c7' : '#dbeafe',
                                        color: p.latest_encounter_type === 'IPD' ? '#d97706' : '#2563eb',
                                        padding: '2px 8px', borderRadius: '12px', fontWeight: '600'
                                    }}>
                                        {p.latest_encounter_type}
                                    </span>
                                )}
                                {p.latest_encounter_status === 'closed' && (
                                    <span style={{ marginLeft: '4px', color: '#64748b' }}>Discharged</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
