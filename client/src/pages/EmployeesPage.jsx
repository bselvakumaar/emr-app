import { useState, useEffect } from 'react';
import api from '../api.js';
import { currency } from '../utils/format.js';

export default function EmployeesPage({ employees, employeeLeaves, onCreateEmployee, onRecordAttendance, onApplyLeave, tenant }) {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'attendance' | 'leaves'
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    async function loadAttendance() {
      if (!tenant) return;
      try {
        const records = await api.getAttendance(tenant.id, attendanceDate);
        setAttendanceRecords(records || []);
      } catch { setAttendanceRecords([]); }
    }
    loadAttendance();
  }, [tenant, attendanceDate]);

  const refreshAttendance = async () => {
    if (!tenant) return;
    try {
      const records = await api.getAttendance(tenant.id, attendanceDate);
      setAttendanceRecords(records || []);
    } catch { /* ignore */ }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    await onRecordAttendance(e);
    await refreshAttendance();
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Present': return { bg: '#dcfce7', color: '#16a34a' };
      case 'Absent': return { bg: '#fee2e2', color: '#dc2626' };
      case 'Half-Day': return { bg: '#fef3c7', color: '#ca8a04' };
      case 'Leave': return { bg: '#dbeafe', color: '#3b82f6' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  return (
    <section className="view employees-workspace">
      {/* Tab Navigation */}
      <div className="emp-tabs">
        <button className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`} onClick={() => setActiveTab('roster')}>
          👥 Employee Roster
        </button>
        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          📋 Daily Attendance
        </button>
        <button className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => setActiveTab('leaves')}>
          🏖️ Leave Management
        </button>
      </div>

      {/* Employee Roster */}
      {activeTab === 'roster' && (
        <>
          <article className="panel" style={{ maxWidth: '720px', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Add New Employee</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Register a staff member in the HR system.</p>
            </div>
            <form className="structured-form" onSubmit={onCreateEmployee}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <input name="name" placeholder="Dr. Priya Sharma" required />
                </div>
                <div className="field">
                  <label className="field-label">Employee Code</label>
                  <input name="code" placeholder="EMP-001" required />
                </div>
                <div className="field">
                  <label className="field-label">Department</label>
                  <input name="department" placeholder="Paediatrics" required />
                </div>
                <div className="field">
                  <label className="field-label">Designation</label>
                  <input name="designation" placeholder="Senior Doctor" required />
                </div>
                <div className="field">
                  <label className="field-label">Join Date</label>
                  <input name="joinDate" type="date" required />
                </div>
                <div className="field">
                  <label className="field-label">Shift</label>
                  <select name="shift"><option>Morning</option><option>Evening</option><option>Night</option></select>
                </div>
                <div className="field">
                  <label className="field-label">Monthly Salary (₹)</label>
                  <input name="salary" type="number" placeholder="0" required />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="primary-submit-btn" style={{ background: '#10b981' }}>+ Create Employee</button>
                </div>
              </div>
            </form>
          </article>

          <article className="panel">
            <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Staff Directory ({employees.length})
            </h3>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Shift</th>
                  <th style={{ textAlign: 'right' }}>Salary</th>
                  <th style={{ textAlign: 'center' }}>Leave Bal.</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No employees registered yet.</td></tr>
                )}
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{e.code}</code></td>
                    <td style={{ fontWeight: 600 }}>{e.name}</td>
                    <td>{e.department || '-'}</td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>{e.designation || '-'}</td>
                    <td>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, background: '#f0f9ff', color: '#0369a1' }}>
                        {e.shift || 'Morning'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{currency(e.salary)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: e.leaveBalance > 0 ? '#16a34a' : '#dc2626' }}>
                        {e.leaveBalance ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </>
      )}

      {/* Daily Attendance */}
      {activeTab === 'attendance' && (
        <>
          <article className="panel" style={{ maxWidth: '640px', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Mark Attendance</h3>
            </div>
            <form className="structured-form" onSubmit={handleAttendanceSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field">
                  <label className="field-label">Employee</label>
                  <select name="employeeId" required>
                    {employees.map((e) => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Date</label>
                  <input name="date" type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field-label">Check In</label>
                  <input name="timeIn" type="time" />
                </div>
                <div className="field">
                  <label className="field-label">Check Out</label>
                  <input name="timeOut" type="time" />
                </div>
                <div className="field">
                  <label className="field-label">Status</label>
                  <select name="status">
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Half-Day</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="primary-submit-btn" style={{ background: '#3b82f6' }}>✓ Mark Attendance</button>
                </div>
              </div>
            </form>
          </article>

          <article className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Attendance Records — {new Date(attendanceDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Employee</th>
                  <th>Shift</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No attendance records for this date.</td></tr>
                )}
                {attendanceRecords.map((r) => {
                  const sc = statusColor(r.status);
                  return (
                    <tr key={r.id}>
                      <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{r.code}</code></td>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td style={{ fontSize: '13px', color: '#64748b' }}>{r.shift || '-'}</td>
                      <td style={{ fontSize: '13px' }}>{r.check_in ? new Date(r.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td style={{ fontSize: '13px' }}>{r.check_out ? new Date(r.check_out).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, background: sc.bg, color: sc.color }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </>
      )}

      {/* Leave Management */}
      {activeTab === 'leaves' && (
        <>
          <article className="panel" style={{ maxWidth: '560px', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Apply for Leave</h3>
            </div>
            <form className="structured-form" onSubmit={onApplyLeave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field" style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">Employee</label>
                  <select name="employeeId" required>
                    {employees.map((e) => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">From</label>
                  <input name="from" type="date" required />
                </div>
                <div className="field">
                  <label className="field-label">To</label>
                  <input name="to" type="date" required />
                </div>
                <div className="field">
                  <label className="field-label">Leave Type</label>
                  <select name="type"><option>Casual</option><option>Sick</option><option>Earned</option></select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="primary-submit-btn" style={{ background: '#8b5cf6' }}>🏖️ Submit Request</button>
                </div>
              </div>
            </form>
          </article>

          <article className="panel">
            <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Leave Requests ({employeeLeaves.length})
            </h3>
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {employeeLeaves.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No leave requests found.</td></tr>
                )}
                {employeeLeaves.map((l) => {
                  const empName = employees.find(e => e.id === l.employeeId)?.name || l.employeeId?.slice(0, 8);
                  return (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{empName}</td>
                      <td style={{ fontSize: '13px' }}>{l.from ? new Date(l.from).toLocaleDateString('en-IN') : '-'}</td>
                      <td style={{ fontSize: '13px' }}>{l.to ? new Date(l.to).toLocaleDateString('en-IN') : '-'}</td>
                      <td>
                        <span style={{
                          padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                          background: l.type === 'Sick' ? '#fee2e2' : l.type === 'Earned' ? '#dbeafe' : '#f0fdf4',
                          color: l.type === 'Sick' ? '#dc2626' : l.type === 'Earned' ? '#2563eb' : '#16a34a'
                        }}>
                          {l.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                          background: l.status === 'Approved' ? '#dcfce7' : l.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                          color: l.status === 'Approved' ? '#16a34a' : l.status === 'Rejected' ? '#dc2626' : '#ca8a04'
                        }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        </>
      )}

      <style>{`
        .employees-workspace .emp-tabs { display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; flex-wrap: wrap; }
        .employees-workspace .tab-btn { padding: 8px 16px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; border-radius: 8px; transition: 0.2s; font-size: 13px; }
        .employees-workspace .tab-btn.active { color: #10b981; background: #ecfdf5; }
        .employees-workspace .tab-btn:hover { background: #f8fafc; }

        .employees-workspace .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em; display: block; margin-bottom: 6px; }
        .employees-workspace .primary-submit-btn { width: 100%; padding: 10px 16px; border: none; border-radius: 8px; color: white; font-weight: 700; cursor: pointer; font-size: 13px; transition: 0.2s; }
        .employees-workspace .primary-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .employees-workspace .clinical-table { width: 100%; border-collapse: collapse; }
        .employees-workspace .clinical-table th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
        .employees-workspace .clinical-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      `}</style>
    </section>
  );
}
