
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
        if (!term && !date && !type && !status) {
            setPatients([]);
            return;
        }
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
            } else {
                setPatients([]);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, dateFilter, typeFilter, statusFilter]);

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setIsOpen(false);
        if (onSelect) onSelect(patient);
    };

    return (
        <div className="premium-patient-search" ref={wrapperRef}>
            {/* Selected Patient Token */}
            {selectedPatient && (
                <div className="selection-token">
                    <div className="token-info">
                        <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong>
                        <span>{selectedPatient.mrn}</span>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setSelectedPatient(null); }}
                        className="token-close"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Search Input Group */}
            {!selectedPatient && (
                <div className="search-group">
                    <div className="main-search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Find by Name, MRN, Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsOpen(true)}
                        />
                    </div>

                    <div className="filter-row">
                        <div className="filter-item">
                            <label>Context</label>
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="">Any</option>
                                <option value="OPD">OPD</option>
                                <option value="IPD">IPD</option>
                                <option value="emergency">ER</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Arrival</label>
                            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Search Dropdown */}
            {isOpen && !selectedPatient && (searchTerm || patients.length > 0) && (
                <div className="search-dropdown premium-glass">
                    {loading && <div className="dropdown-status">🔍 Scouring clinical records...</div>}

                    {!loading && patients.length === 0 && searchTerm && (
                        <div className="dropdown-empty">
                            No match found for "<strong>{searchTerm}</strong>"
                        </div>
                    )}

                    {!loading && patients.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => selectPatient(p)}
                            className="result-row"
                        >
                            <div className="result-avatar">{(p.firstName || 'P')[0]}</div>
                            <div className="result-main">
                                <div className="result-name">{p.firstName} {p.lastName}</div>
                                <div className="result-meta">
                                    {p.mrn} • {new Date().getFullYear() - new Date(p.dob).getFullYear()}Y • {p.gender}
                                </div>
                            </div>
                            <div className="result-aside">
                                {p.latest_encounter_type && (
                                    <span className={`type-tag ${p.latest_encounter_type}`}>
                                        {p.latest_encounter_type}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .premium-patient-search { position: relative; width: 100%; font-family: inherit; }
                
                .selection-token { 
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 8px 12px; background: #ecfdf5; border: 1px solid #d1fae5;
                    border-radius: 10px; margin-bottom: 12px; animation: slide-in 0.2s ease-out;
                }
                .token-info strong { color: #065f46; font-size: 13px; display: block; }
                .token-info span { color: #059669; font-size: 11px; font-weight: 700; }
                .token-close { background: transparent; border: none; color: #059669; font-size: 20px; cursor: pointer; padding: 0 4px; }

                .search-group { display: flex; flex-direction: column; gap: 8px; }
                .main-search-bar { 
                    position: relative; display: flex; align-items: center; 
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
                    transition: all 0.2s;
                }
                .main-search-bar:focus-within { border-color: var(--tenant-primary); background: white; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
                .search-icon { padding: 0 10px; font-size: 14px; opacity: 0.5; }
                .main-search-bar input { flex: 1; border: none; background: transparent; padding: 10px 0; font-size: 13px; outline: none; }

                .filter-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .filter-item { display: flex; flex-direction: column; gap: 4px; }
                .filter-item label { font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.05em; margin-left: 2px; }
                .filter-item select, .filter-item input { padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 11px; font-weight: 600; cursor: pointer; }

                .search-dropdown { 
                    position: absolute; top: calc(100% + 6px); left: 0; right: 0; 
                    background: white; border: 1px solid #e2e8f0; border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100; max-height: 320px; overflow-y: auto;
                }
                .dropdown-status { padding: 20px; text-align: center; color: #64748b; font-size: 12px; font-weight: 600; }
                .dropdown-empty { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
                
                .result-row { 
                    display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #f1f5f9; 
                    cursor: pointer; transition: 0.2s; align-items: center;
                }
                .result-row:hover { background: #f8fafc; }
                .result-avatar { width: 34px; height: 34px; border-radius: 8px; background: #f1f5f9; display: grid; place-items: center; font-weight: 800; color: #64748b; font-size: 12px; flex-shrink: 0; }
                .result-main { flex: 1; overflow: hidden; }
                .result-name { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .result-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
                
                .type-tag { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
                .type-tag.IPD { background: #fee2e2; color: #dc2626; }
                .type-tag.OPD { background: #dbeafe; color: #2563eb; }
                .type-tag.emergency { background: #fef3c7; color: #b45309; }

                @keyframes slide-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
