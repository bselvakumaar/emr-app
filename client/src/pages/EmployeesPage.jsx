import { currency } from '../utils/format.js';

export default function EmployeesPage({ employees, employeeLeaves, onCreateEmployee, onApplyLeave }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Employee Master</h3>
        <form className="form-grid" onSubmit={onCreateEmployee}>
          <input name="name" placeholder="Name" required />
          <input name="code" placeholder="Employee Code" required />
          <input name="department" placeholder="Department" required />
          <input name="designation" placeholder="Designation" required />
          <input name="joinDate" type="date" required />
          <select name="shift"><option>Morning</option><option>Evening</option><option>Night</option></select>
          <input name="salary" type="number" required />
          <button type="submit">Create Employee</button>
        </form>
        <table>
          <thead><tr><th>Code</th><th>Name</th><th>Dept</th><th>Shift</th><th>Salary</th><th>Leave</th></tr></thead>
          <tbody>{employees.map((e) => <tr key={e.id}><td>{e.code}</td><td>{e.name}</td><td>{e.department}</td><td>{e.shift}</td><td>{currency(e.salary)}</td><td>{e.leaveBalance}</td></tr>)}</tbody>
        </table>
      </article>

      <article className="panel">
        <h3>Leave Management</h3>
        <form className="form-grid" onSubmit={onApplyLeave}>
          <select name="employeeId" required>{employees.map((e) => <option key={e.id} value={e.id}>{e.code} - {e.name}</option>)}</select>
          <input name="from" type="date" required />
          <input name="to" type="date" required />
          <select name="type"><option>Casual</option><option>Sick</option><option>Earned</option></select>
          <button type="submit">Apply Leave</button>
        </form>
        <ul className="list">{employeeLeaves.map((l) => <li key={l.id}>{l.employeeId}: {l.from} to {l.to} ({l.type}) - {l.status}</li>)}</ul>
      </article>
    </section>
  );
}
