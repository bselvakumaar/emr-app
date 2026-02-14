import { currency, patientName } from '../utils/format.js';

export default function BillingPage({ patients, invoices, onIssueInvoice, onMarkPaid }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Issue Invoice</h3>
        <form className="form-grid" onSubmit={onIssueInvoice}>
          <select name="patientId" required>{patients.map((p) => <option key={p.id} value={p.id}>{p.mrn}</option>)}</select>
          <input name="description" placeholder="Description" required />
          <input name="amount" type="number" step="0.01" required />
          <input name="taxPercent" type="number" step="0.01" placeholder="Tax %" />
          <button type="submit">Issue Invoice</button>
        </form>
        <table>
          <thead><tr><th>Invoice</th><th>Patient</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{invoices.map((i) => <tr key={i.id}><td>{i.number}</td><td>{patientName(i.patientId, patients)}</td><td>{currency(i.total)}</td><td>{i.status}</td><td><button className="action-btn" onClick={() => onMarkPaid(i.id)}>Mark Paid</button></td></tr>)}</tbody>
        </table>
      </article>
    </section>
  );
}
