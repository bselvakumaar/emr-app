import MetricCard from '../components/MetricCard';

export default function InventoryPage({ inventory, onAddItem, onRestock }) {
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((item) => Number(item.stock) <= Number(item.reorder)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="premium-card p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="clinical-chip mb-4">Supply Chain Oversight</div>
          <h1 className="text-[1.95rem] md:text-[2.4rem] leading-tight font-extrabold tracking-[-0.04em] text-[var(--text-strong)]">
            Asset Logistics
          </h1>
          <p className="mt-3 text-[15px] md:text-base leading-7 text-[var(--text-muted)]">
            Monitor clinical inventory, reorder thresholds, and asset registration with a cleaner operational view.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MetricCard
          label="Stock Registry"
          value={totalItems}
          icon="inventory"
          accent="teal"
          trend="Validated nomenclature"
        />
        <MetricCard
          label="Threshold Alerts"
          value={lowStockItems}
          icon="appointments"
          accent="amber"
          trend="Low-stock review queue"
        />
        <MetricCard
          label="Audit Integrity"
          value="Secure"
          icon="insurance"
          accent="emerald"
          trend="Sequential ledger active"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <aside className="xl:col-span-4">
          <article className="premium-card p-6 h-full">
            <div className="mb-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--text-soft)]">Asset Registration</p>
              <h2 className="text-xl font-extrabold text-[var(--text-strong)] mt-2">Register a clinical supply item</h2>
              <p className="text-sm leading-6 text-[var(--text-muted)] mt-2">
                Add new supplies, medicines, consumables, or diagnostics into the facility inventory ledger.
              </p>
            </div>

            <form onSubmit={onAddItem} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                  Identifier
                </label>
                <input
                  name="code"
                  placeholder="MED-721-X"
                  className="clinical-input px-4 py-3 text-[15px] font-semibold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                  Nomenclature
                </label>
                <input
                  name="name"
                  placeholder="Sterile Saline 500ml"
                  className="clinical-input px-4 py-3 text-[15px] font-semibold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                  Category
                </label>
                <select name="category" className="clinical-select px-4 py-3 text-[15px] font-semibold" required>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Diagnostics">Diagnostics</option>
                  <option value="Surgical">Surgical</option>
                  <option value="General">General Supply</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                    Volume
                  </label>
                  <input
                    name="stock"
                    type="number"
                    placeholder="0"
                    className="clinical-input px-4 py-3 text-[15px] font-semibold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                    Reorder Point
                  </label>
                  <input
                    name="reorder"
                    type="number"
                    placeholder="10"
                    className="clinical-input px-4 py-3 text-[15px] font-semibold"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2">
                Commit to registry
              </button>
            </form>
          </article>
        </aside>

        <main className="xl:col-span-8">
          <article className="premium-card overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[var(--surface-muted)]">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--text-soft)]">Global Stock Ledger</p>
                <h2 className="text-xl font-extrabold text-[var(--text-strong)] mt-2">Inventory availability and logistics status</h2>
              </div>
              <input
                type="text"
                placeholder="Filter clinical items..."
                className="clinical-input px-4 py-3 w-full md:w-72 text-sm font-semibold bg-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white">
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Asset ID</th>
                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Nomenclature</th>
                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Availability</th>
                    <th className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Logistics Status</th>
                    <th className="px-4 py-4 text-right text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center px-6 py-20 text-[var(--text-muted)] text-sm italic">
                        No inventory units identified in the facility registry.
                      </td>
                    </tr>
                  ) : inventory.map((item) => {
                    const isLow = Number(item.stock) <= Number(item.reorder);
                    const stockPct = Math.min(100, (Number(item.stock) / (Number(item.reorder) * 3 || 1)) * 100);

                    return (
                      <tr key={item.id} className="border-b border-[var(--border)]/70 hover:bg-[var(--surface-muted)] transition-colors">
                        <td className="px-4 py-5">
                          <code className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-[11px] font-extrabold text-[var(--text-main)]">
                            {item.code}
                          </code>
                        </td>
                        <td className="px-4 py-5">
                          <div className="font-bold text-[var(--text-strong)] text-[1.05rem] leading-6">{item.name}</div>
                          <div className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                            {item.category || 'General Supply'}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="w-48 space-y-2">
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.12em]">
                              <span className="text-[var(--text-main)]">{item.stock} units</span>
                              <span className="text-[var(--text-soft)]">crit: {item.reorder}</span>
                            </div>
                            <div className="h-2 bg-[var(--border)]/70 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-teal-500'}`}
                                style={{ width: `${stockPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] bg-[var(--surface-muted)]">
                            <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className={isLow ? 'text-amber-700' : 'text-emerald-700'}>
                              {isLow ? 'Reorder needed' : 'Optimal'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-right">
                          <button
                            className="btn btn-secondary !min-h-[38px] !px-4 !text-xs uppercase tracking-[0.14em]"
                            onClick={() => onRestock(item.id)}
                          >
                            Initiate restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        </main>
      </section>
    </div>
  );
}
