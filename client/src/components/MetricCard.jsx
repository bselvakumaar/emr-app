export default function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <h4>{label}</h4>
      <p>{value}</p>
    </article>
  );
}
