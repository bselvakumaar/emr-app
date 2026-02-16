import { useState, useMemo } from 'react';
import PatientSearch from '../components/PatientSearch.jsx';
import { patientName } from '../utils/format.js';
import { api } from '../api.js';

function printPrescription(enc, patient, medications, provider, tenant) {
  const w = window.open('', '_blank', 'width=800,height=900');
  const dateStr = new Date(enc.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Prescription - ${patient.firstName}</title>
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background: #fff; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #10b981; padding-bottom: 25px; margin-bottom: 40px; }
        .clinic-info h1 { color: #059669; margin: 0; font-size: 28px; font-weight: 900; }
        .clinic-info p { margin: 4px 0; color: #64748b; font-size: 13px; }
        .rx-label { font-size: 48px; color: #059669; font-weight: 900; margin: 20px 0; font-family: 'Times New Roman', serif; }
        .patient-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
        .patient-grid div span { color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px; letter-spacing: 0.05em; }
        .patient-grid div strong { font-size: 14px; color: #1e293b; font-weight: 700; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { text-align: left; padding: 15px; border-bottom: 2px solid #f1f5f9; color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; }
        td { padding: 20px 15px; border-bottom: 1px solid #f8fafc; font-size: 14px; color: #334155; }
        .med-name { font-weight: 800; color: #0f172a; font-size: 15px; }
        .instructions { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 500; }
        .footer { margin-top: 100px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature { text-align: center; border-top: 1px solid #cbd5e1; width: 220px; padding-top: 10px; }
        @media print { body { padding: 0px; } .header { border-bottom-width: 4px; } }
      </style>
    </head>
    <body onload="window.print(); window.close();">
      <div class="header">
        <div class="clinic-info">
          <h1>${tenant?.name || 'EMR Medical Center'}</h1>
          <p>Certified Healthcare Facility • Licensed Practitioner</p>
          <p>Contact: +91-XXXXX-XXXXX</p>
        </div>
        <div style="text-align: right">
          <p style="font-size: 14px; margin:0; font-weight: 800;">Date: ${dateStr}</p>
          <p style="font-size: 11px; color:#94a3b8; margin:4px 0; font-weight: 600;">ID: ${enc.id ? enc.id.toUpperCase().slice(0, 12) : 'TEMP'}</p>
        </div>
      </div>

      <div class="patient-grid">
        <div><span>Patient Identity</span><strong>${patient.firstName} ${patient.lastName}</strong></div>
        <div><span>MRN / File No.</span><strong>${patient.mrn || 'N/A'}</strong></div>
        <div><span>Age / Gender</span><strong>${new Date().getFullYear() - new Date(patient.dob).getFullYear()}Y / ${patient.gender}</strong></div>
        <div><span>Clinical Vitals</span><strong>BP: ${enc.bp || '--'} • HR: ${enc.hr || '--'}</strong></div>
      </div>

      <div class="rx-label">℞</div>

      <table>
        <thead>
          <tr>
            <th>Line Item / Medication</th>
            <th>Dosage Regime</th>
            <th>Cycle</th>
          </tr>
        </thead>
        <tbody>
          ${medications.length > 0 ? medications.map(m => `
            <tr>
              <td>
                <div class="med-name">${m.name}</div>
                <div class="instructions">${m.instructions || 'Follow clinical instructions'}</div>
              </td>
              <td style="font-weight: 700;">${m.dosage}</td>
              <td style="color:#64748b; font-weight:600;">${m.duration || 'As directed'}</td>
            </tr>
          `).join('') : '<tr><td colspan="3" style="text-align:center; color:#94a3b8; padding: 40px;">No medications recorded in this session.</td></tr>'}
        </tbody>
      </table>

      <div style="margin-top: 40px; background: #fdfcfb; padding: 25px; border-radius: 12px; border: 1px solid #fef3c7;">
        <h4 style="margin:0 0 10px; font-size:10px; color:#d97706; text-transform:uppercase; letter-spacing:0.1em; font-weight:900;">Physician Advice & Observations</h4>
        <p style="margin:0; font-size:14px; color:#1e293b; white-space: pre-wrap; font-weight: 500;">${enc.notes || 'No specific clinical observations recorded for this encounter.'}</p>
      </div>

      <div class="footer">
        <div><p style="font-size: 11px; color: #94a3b8; font-weight: 500;">This is a digitally signed clinical document. Verify with clinic system.</p></div>
        <div class="signature">
          <strong style="font-size: 15px; color: #0f172a;">${provider?.name || 'Authorized Practitioner'}</strong>
          <p style="font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 700;">Digital Signature: MC-${(provider?.id || 'V1').slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
    </body>
    </html>
  `);
  w.document.close();
}

export default function EmrPage({ tenant, patients, providers, encounters, onCreateEncounter, onDischarge }) {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [meds, setMeds] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);

  const activeEncounters = useMemo(() => encounters.filter(e => e.status === 'open'), [encounters]);
  const pastEncounters = useMemo(() => encounters.filter(e => e.status === 'closed'), [encounters]);

  const selectedPatient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);
  const patientHistory = useMemo(() => {
    if (!selectedPatientId) return [];
    return encounters.filter(e => e.patientId === selectedPatientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [encounters, selectedPatientId]);

  const handleAddMed = () => setMeds([...meds, { name: '', dosage: '', duration: '', instructions: '' }]);
  const handleMedChange = (i, f, v) => {
    const next = [...meds];
    next[i][f] = v;
    setMeds(next);
  };
  const handleRemoveMed = (i) => setMeds(meds.filter((_, idx) => idx !== i));

  const [lastSaved, setLastSaved] = useState(null);

  const handleEncounterSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const validMeds = meds.filter(m => m.name);

    const data = {
      patientId: selectedPatientId,
      providerId: fd.get('providerId'),
      type: fd.get('type'),
      complaint: fd.get('complaint'),
      diagnosis: fd.get('diagnosis'),
      notes: fd.get('notes'),
      bp: fd.get('bp'),
      hr: fd.get('hr'),
      medications: validMeds
    };

    try {
      await onCreateEncounter(data);
      setLastSaved({ ...data, createdAt: new Date().toISOString() });
      setMeds([{ name: '', dosage: '', duration: '', instructions: '' }]);
    } catch (err) {
      alert('Clinical Save Error: ' + err.message);
    }
  };

  if (lastSaved) {
    return (
      <div className="panel finish-card premium-glass" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div className="finish-icon">✅</div>
        <h2>Clinical Record Finalized</h2>
        <p className="finish-subtext">The consultation for <strong>{patientName(lastSaved.patientId, patients)}</strong> has been securely logged.</p>
        <div className="finish-actions">
          <button className="finish-btn print" onClick={() => {
            printPrescription({ ...lastSaved, id: 'NEW' }, patients.find(p => p.id === lastSaved.patientId), lastSaved.medications, providers.find(p => p.id === lastSaved.providerId), tenant);
          }}>
            <span className="icon">🖨️</span> Generate Prescription
          </button>
          <button className="finish-btn dashboard" onClick={() => {
            setLastSaved(null);
            setSelectedPatientId('');
            setActiveTab('active');
          }}>
            Clinical Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="view clinical-workspace">
      <div className="workspace-header">
        <div className="tab-group premium-glass">
          <button className={`tab-link ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
            <span className="icon">🏥</span> Active Encounters
          </button>
          <button className={`tab-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <span className="icon">📚</span> Global History
          </button>
          <button className={`tab-link ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')} id="new-consult-btn">
            <span className="icon">➕</span> New Consultation
          </button>
        </div>
      </div>

      {activeTab === 'new' && (
        <div className="consultation-layout-grid">

          <aside className="clinical-sidebar premium-glass">
            <div className="sidebar-header">
              <h4>1. Selection</h4>
              <p>Identify the subject patient</p>
            </div>
            <div className="sidebar-content">
              <PatientSearch tenantId={tenant?.id} onSelect={(p) => setSelectedPatientId(p.id)} />

              {selectedPatient && (
                <div className="subject-profile-card">
                  <div className="subject-header">
                    <div className="subject-avatar">{(selectedPatient.firstName || 'P')[0]}</div>
                    <div className="subject-names">
                      <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong>
                      <span>MRN: {selectedPatient.mrn || 'PENDING'}</span>
                    </div>
                  </div>
                  <div className="subject-criticals">
                    <div className="critical-item allergies">
                      <label>Allergies</label>
                      <strong>{selectedPatient.medicalHistory?.allergies || 'NONE RECORDED'}</strong>
                    </div>
                    <div className="critical-item chronic">
                      <label>Chronic History</label>
                      <strong>{selectedPatient.medicalHistory?.chronicConditions || 'CLEAR'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="consultation-container">
            {!selectedPatient ? (
              <div className="panel select-placeholder premium-glass">
                <div className="placeholder-content">
                  <img src="/logo.svg" style={{ width: '80px', opacity: 0.1, marginBottom: '1rem' }} />
                  <p>Identify a patient from the sidebar to begin clinical documentation</p>
                </div>
              </div>
            ) : (
              <form className="consultation-form panel premium-glass" onSubmit={handleEncounterSubmit}>
                <div className="consult-header">
                  <div className="header-meta">
                    <h3>Clinical Record Input</h3>
                    <p>Draft Electronic Medical Record & Prescription</p>
                  </div>
                  <div className="vitals-strip">
                    <div className="vital-input">
                      <label>BP</label>
                      <input name="bp" placeholder="---/--" />
                    </div>
                    <div className="vital-input">
                      <label>HR</label>
                      <input name="hr" placeholder="--" />
                    </div>
                  </div>
                </div>

                <div className="consult-form-grid">
                  <div className="form-group-rich">
                    <label>Attending Provider</label>
                    <select name="providerId" required>
                      {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group-rich">
                    <label>Interaction Type</label>
                    <select name="type">
                      <option>Out-patient</option>
                      <option>In-patient</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="consult-form-grid-2">
                  <div className="form-group-rich">
                    <label>Chief Complaint</label>
                    <input name="complaint" required placeholder="Subjective reasoning for visit..." />
                  </div>
                  <div className="form-group-rich">
                    <label>Provisional Diagnosis</label>
                    <input name="diagnosis" required placeholder="Objective assessment..." />
                  </div>
                </div>

                <div className="rx-module-premium">
                  <div className="rx-header">
                    <h4>℞ Medications</h4>
                    <button type="button" className="add-med-trigger" onClick={handleAddMed}>+ Add Prescription Line</button>
                  </div>
                  <div className="rx-lines">
                    {meds.map((m, i) => (
                      <div key={i} className="rx-entry-row">
                        <input className="med-name-in" placeholder="Drug" value={m.name} onChange={e => handleMedChange(i, 'name', e.target.value)} />
                        <input className="med-dose-in" placeholder="Dose (1-0-1)" value={m.dosage} onChange={e => handleMedChange(i, 'dosage', e.target.value)} />
                        <input className="med-dur-in" placeholder="Days" value={m.duration} onChange={e => handleMedChange(i, 'duration', e.target.value)} />
                        <input className="med-note-in" placeholder="Special Route/Note" value={m.instructions} onChange={e => handleMedChange(i, 'instructions', e.target.value)} />
                        <button type="button" className="remove-med-btn" onClick={() => handleRemoveMed(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group-rich">
                  <label>Physician Advice & Narrative</label>
                  <textarea name="notes" placeholder="Advice given, future investigations, follow-up..." style={{ height: '120px' }}></textarea>
                </div>

                <div className="form-actions-sticky">
                  <button type="submit" className="finalize-btn-premium">Finalize Session & Print Rx</button>
                </div>
              </form>
            )}
          </main>
        </div>
      )}

      {(activeTab === 'active' || activeTab === 'history') && (
        <article className="ledger-card premium-glass">
          <div className="ledger-header">
            <div className="title-stack">
              <h3>Clinical Encounter Ledger</h3>
              <p>Monitoring {(activeTab === 'active' ? activeEncounters : lastSaved ? [lastSaved, ...pastEncounters] : pastEncounters).length} clinical events</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Temporal Stamp</th>
                  <th>Clinical Subject</th>
                  <th>Dept/Type</th>
                  <th>Diagnosis / Outcome</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'active' ? activeEncounters : pastEncounters).length === 0 ? (
                  <tr><td colSpan="5" className="empty-table-msg">No clinical encounters recorded in this view.</td></tr>
                ) : (activeTab === 'active' ? activeEncounters : pastEncounters).map(e => {
                  const pat = patients.find(p => p.id === (e.patient_id || e.patientId));
                  return (
                    <tr key={e.id} className="ledger-row">
                      <td className="date-cell">
                        <strong>{new Date(e.created_at || e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</strong><br />
                        {new Date(e.created_at || e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="patient-cell">
                        <div className="p-link" onClick={() => { setSelectedPatientId(e.patient_id || e.patientId); setActiveTab('new'); }}>
                          {pat ? `${pat.firstName} ${pat.lastName}` : (e.patientName || 'Unknown')}
                        </div>
                        <span className="tiny-id">MRN: {pat?.mrn || 'NEW'}</span>
                      </td>
                      <td>
                        <span className={`status-chip ${(e.encounter_type || e.type || '').toLowerCase().replace('-', '')}`}>
                          {e.encounter_type || e.type}
                        </span>
                      </td>
                      <td className="diagnosis-cell">{e.diagnosis || 'Clinical Assessment...'}</td>
                      <td className="actions-cell">
                        <div className="action-button-group">
                          <button className="ledger-btn print" onClick={() => printPrescription(e, pat || { firstName: 'Patient' }, [], providers.find(p => p.id === (e.provider_id || e.providerId)), tenant)}>Rx</button>
                          {e.status === 'open' && (
                            <button className="ledger-btn consult" onClick={() => { setSelectedPatientId(e.patient_id || e.patientId); setActiveTab('new'); }}>📝 Documentation</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      )}

      <style>{`
        .clinical-workspace { animation: fade-in 0.5s ease-out; }
        .workspace-header { margin-bottom: 2rem; }
        .tab-group { display: flex; padding: 4px; border-radius: 12px; background: rgba(255,255,255,0.6); width: fit-content; }
        .tab-link { padding: 10px 20px; border: none; background: transparent; color: #64748b; font-size: 0.85rem; font-weight: 700; cursor: pointer; border-radius: 9px; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .tab-link.active { background: white; color: var(--tenant-primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        #new-consult-btn.active { color: #059669; }

        .consultation-layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; align-items: start; }
        .premium-glass { background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 25px rgba(0,0,0,0.03); }
        
        .clinical-sidebar { padding: 1.5rem; }
        .sidebar-header h4 { margin: 0; font-size: 0.85rem; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; }
        .sidebar-header p { margin: 4px 0 1.25rem; font-size: 0.75rem; color: #94a3b8; font-weight: 700; }
        
        .subject-profile-card { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f1f5f9; }
        .subject-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
        .subject-avatar { width: 44px; height: 44px; background: #ecfdf5; color: #10b981; border-radius: 12px; display: grid; place-items: center; font-weight: 900; font-size: 1.25rem; }
        .subject-names { display: flex; flex-direction: column; }
        .subject-names strong { font-size: 14px; color: #0f172a; }
        .subject-names span { font-size: 11px; color: #94a3b8; font-weight: 800; letter-spacing: 0.05em; }
        
        .subject-criticals { display: flex; flex-direction: column; gap: 1rem; }
        .critical-item { background: #f8fafc; padding: 12px; border-radius: 10px; border-left: 3px solid #e2e8f0; }
        .critical-item label { display: block; font-size: 9px; font-weight: 900; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
        .critical-item strong { font-size: 12px; color: #475569; }
        .critical-item.allergies { border-left-color: #f87171; background: #fef2f2; }
        .critical-item.allergies strong { color: #b91c1c; }

        .select-placeholder { height: 600px; display: grid; place-items: center; text-align: center; color: #94a3b8; font-weight: 600; font-size: 0.9rem; padding: 4rem; }
        
        .consultation-form { padding: 2.5rem; }
        .consult-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
        .header-meta h3 { margin: 0; font-size: 1.5rem; font-weight: 900; color: #0f172a; letter-spacing: -0.025em; }
        .header-meta p { margin: 4px 0 0; color: #64748b; font-size: 0.9rem; font-weight: 600; }
        
        .vitals-strip { display: flex; gap: 1rem; }
        .vital-input { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; display: flex; flex-direction: column; width: 90px; }
        .vital-input label { font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .vital-input input { border: none; background: transparent; width: 100%; font-weight: 800; color: #0f172a; font-size: 1.1rem; outline: none; margin-top: 2px; }

        .consult-form-grid, .consult-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .form-group-rich label { display: block; font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .form-group-rich input, .form-group-rich select, .form-group-rich textarea { width: 100%; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; font-weight: 600; color: #1e293b; outline: none; transition: 0.2s; }
        .form-group-rich input:focus, .form-group-rich textarea:focus { border-color: var(--tenant-primary); background: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

        .rx-module-premium { background: #fdfcfb; border: 1px solid #ffedd5; border-radius: 16px; padding: 1.5rem; margin: 2rem 0; }
        .rx-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .rx-header h4 { margin: 0; color: #c2410c; font-size: 0.9rem; font-weight: 900; letter-spacing: 0.05em; }
        .add-med-trigger { padding: 6px 14px; background: #fff7ed; border: 1px solid #ffedd5; color: #c2410c; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .add-med-trigger:hover { background: #ffedd5; }
        
        .rx-entry-row { display: grid; grid-template-columns: 1.5fr 1fr 80px 1.5fr 36px; gap: 10px; margin-bottom: 10px; }
        .rx-entry-row input { background: white; border: 1px solid #ffedd5; padding: 8px 12px; font-size: 13px; font-weight: 700; border-radius: 8px; outline: none; }
        .remove-med-btn { border: none; background: #fee2e2; color: #ef4444; border-radius: 8px; cursor: pointer; font-weight: 900; }

        .finalize-btn-premium { width: 100%; padding: 16px; background: var(--tenant-primary); color: white; border-radius: 14px; font-weight: 900; font-size: 1rem; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); cursor: pointer; transition: 0.2s; }
        .finalize-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(16, 185, 129, 0.3); }

        .finish-card h2 { font-weight: 900; font-size: 2rem; color: #0f172a; margin: 1rem 0; }
        .finish-icon { font-size: 4rem; }
        .finish-subtext { color: #64748b; font-size: 1.1rem; margin-bottom: 3rem; }
        .finish-actions { display: flex; gap: 1rem; justify-content: center; }
        .finish-btn { padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.2s; border: 1px solid #e2e8f0; }
        .finish-btn.print { background: #059669; color: white; border: none; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.2); }
        .finish-btn.dashboard { background: white; color: #1e293b; }

        .ledger-card { padding: 0; overflow: hidden; margin-top: 1rem; }
        .ledger-header { padding: 2rem; border-bottom: 1px solid #f1f5f9; }
        .ledger-header h3 { margin: 0; font-size: 1.25rem; font-weight: 900; }
        .ledger-header p { margin: 4px 0 0; color: #94a3b8; font-size: 0.85rem; font-weight: 700; }

        .table-wrapper { width: 100%; overflow-x: auto; }
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { text-align: left; padding: 1.25rem 1.5rem; background: #f8fafc; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f8fafc; font-size: 14px; vertical-align: middle; }
        
        .date-cell { font-size: 13px; color: #64748b; line-height: 1.4; }
        .p-link { font-weight: 800; color: var(--tenant-primary); cursor: pointer; transition: 0.2s; }
        .p-link:hover { text-decoration: underline; color: #0f172a; }
        .diagnosis-cell { font-weight: 600; color: #475569; }

        .status-chip { font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.05em; }
        .status-chip.outpatient, .status-chip.opd { background: #eff6ff; color: #3b82f6; }
        .status-chip.inpatient, .status-chip.ipd { background: #fffbeb; color: #d97706; }
        .status-chip.emergency, .status-chip.er { background: #fef2f2; color: #ef4444; }

        .ledger-btn { padding: 6px 12px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .ledger-btn.print { color: #059669; }
        .ledger-btn.consult { color: #3b82f6; border-color: #dbeafe; background: #f0f7ff; }
        .empty-table-msg { text-align: center; padding: 5rem; color: #cbd5e1; font-weight: 600; font-style: italic; }
      `}</style>
    </section>
  );
}
