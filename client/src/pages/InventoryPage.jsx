export default function InventoryPage({ inventory, onAddItem, onRestock }) {
  return (
    <section className="view inventory-workspace">
      <header className="inventory-header">
        <div className="header-badge color-teal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 2a2 2 0 1 0 2 0l-2 0ZM11 22a2 2 0 1 1 2 0l-2 0ZM2 11a2 2 0 0 1 0 2l0-2ZM22 11a2 2 0 1 0 0 2l0-2Z" /><circle cx="12" cy="12" r="3" /></svg> Supply Chain Active</div>
        <div className="title-stack">
          <h2>Facility Asset & Stock Management</h2>
          <p>Institutional oversight of {inventory.length} active inventory units across clinical departments.</p>
        </div>
      </header>

      <div className="operation-guide premium-glass">
        <div className="guide-item">
          <div className="guide-icon color-blue">📦</div>
          <div className="guide-text"><strong>Stock Registry</strong><span>Maintain accurate nomenclature for medical supplies.</span></div>
        </div>
        <div className="guide-item">
          <div className="guide-icon color-amber">⚠️</div>
          <div className="guide-text"><strong>Threshold Logic</strong><span>System alerts trigger automatically at reorder points.</span></div>
        </div>
        <div className="guide-item">
          <div className="guide-icon color-emerald">🛡️</div>
          <div className="guide-text"><strong>Audit Trial</strong><span>Every restock is logged in the encrypted facility ledger.</span></div>
        </div>
      </div>

      <div className="inventory-grid">
        <aside className="inventory-sidebar">
          <div className="panel creation-panel premium-glass">
            <h4>Register New Asset</h4>
            <p>Add medical supplies or equipment to global registry</p>
            <form className="inventory-form" onSubmit={onAddItem}>
              <div className="field-group">
                <label>Identifier/Code</label>
                <input name="code" placeholder="E.g. MED-721" required />
              </div>
              <div className="field-group">
                <label>Item Nomenclature</label>
                <input name="name" placeholder="E.g. Paracetamol 500mg" required />
              </div>
              <div className="field-group">
                <label>Resource Category</label>
                <select name="category" required>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Diagnostics">Diagnostics</option>
                  <option value="Surgical">Surgical</option>
                  <option value="General">General Supply</option>
                </select>
              </div>
              <div className="form-row-compact">
                <div className="field-group">
                  <label>Initial Stock</label>
                  <input name="stock" type="number" placeholder="0" required />
                </div>
                <div className="field-group">
                  <label>Reorder Point</label>
                  <input name="reorder" type="number" placeholder="10" required />
                </div>
              </div>
              <button type="submit" className="add-item-btn-premium">Commit to Registry</button>
            </form>
          </div>

          <div className="summary-card-tiny premium-glass">
            <div className="stat-line">
              <span className="dot critical"></span>
              <span className="label">Low Stock Alerts</span>
              <strong className="val">{inventory.filter(i => i.stock <= i.reorder).length}</strong>
            </div>
          </div>
        </aside>

        <main className="inventory-main">
          <article className="ledger-card premium-glass">
            <div className="ledger-header">
              <h3>Global Stock Ledger</h3>
              <div className="search-bar-mini">🔍 Filter stocks...</div>
            </div>
            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Nomenclature / Dept</th>
                    <th>Stock Level</th>
                    <th>Logistics Status</th>
                    <th style={{ textAlign: 'right' }}>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length === 0 ? (
                    <tr><td colSpan="5" className="empty-msg">No inventory units found. Registry is empty.</td></tr>
                  ) : inventory.map((i) => {
                    const isLow = i.stock <= i.reorder;
                    const stockPct = Math.min(100, (i.stock / (i.reorder * 3)) * 100);

                    return (
                      <tr key={i.id} className="inventory-row">
                        <td className="code-cell"><code>{i.code}</code></td>
                        <td>
                          <div className="item-name-stack">
                            <strong>{i.name}</strong>
                            <span>{i.category || 'General Supply'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="stock-meter-box">
                            <div className="stock-meta">
                              <strong>{i.stock} units</strong>
                              <span>Min: {i.reorder}</span>
                            </div>
                            <div className="meter-bg">
                              <div className="meter-fill" style={{ width: `${stockPct}%`, background: isLow ? '#ef4444' : '#10b981' }}></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`stock-status ${isLow ? 'low' : 'optimal'}`}>
                            {isLow ? 'Critical / Restock' : 'Optimal Level'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="restock-btn-micro" onClick={() => onRestock(i.id)}>
                            + Quick Restock
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
      </div>

      <style>{`
        .inventory-workspace { animation: fade-in 0.5s ease-out; }
        .inventory-header { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .header-badge { width: fit-content; display: flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; background: #f0fdfa; color: #0d9488; padding: 4px 10px; border-radius: 20px; border: 1px solid #ccfbf1; }
        .inventory-header h2 { margin: 0; font-size: 1.25rem; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; }
        .inventory-header p { margin: 0; color: #64748b; font-weight: 600; font-size: 0.8rem; }

        .operation-guide { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem; margin-bottom: 1rem; background: #f8fafc; }
        .guide-item { display: flex; align-items: center; gap: 12px; }
        .guide-icon { width: 36px; height: 36px; background: white; border-radius: 10px; display: grid; place-items: center; font-size: 1.25rem; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .guide-text { display: flex; flex-direction: column; }
        .guide-text strong { font-size: 0.75rem; color: #1e293b; }
        .guide-text span { font-size: 0.65rem; color: #64748b; font-weight: 500; }

        .inventory-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1rem; align-items: start; }
        .premium-glass { background: white; border-radius: 1.25rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }

        .creation-panel { padding: 1.25rem; }
        .creation-panel h4 { margin: 0; font-size: 0.85rem; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; }
        .creation-panel p { margin: 2px 0 1rem; font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
        
        .field-group { margin-bottom: 1rem; }
        .field-group label { display: block; font-size: 8px; font-weight: 900; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
        .field-group input, .field-group select { width: 100%; padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.8rem; font-weight: 700; color: #1e293b; outline: none; }
        .field-group input:focus { border-color: var(--tenant-primary); background: white; }
        
        .form-row-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .add-item-btn-premium { width: 100%; padding: 10px; background: var(--tenant-primary); color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: 0.2s; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2); margin-top: 0.25rem; }
        .add-item-btn-premium:hover { transform: translateY(-1px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }

        .summary-card-tiny { margin-top: 0.75rem; padding: 0.75rem 1rem; }
        .stat-line { display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.critical { background: #ef4444; animation: blink 1s infinite; }
        .label { flex: 1; font-size: 11px; font-weight: 800; color: #64748b; }
        .val { font-size: 13px; font-weight: 900; color: #0f172a; }
        @keyframes blink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        .ledger-card { padding: 0; overflow: hidden; }
        .ledger-header { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .ledger-header h3 { margin: 0; font-size: 0.95rem; font-weight: 900; color: #0f172a; }
        .search-bar-mini { font-size: 11px; color: #94a3b8; font-weight: 700; }

        .inventory-table { width: 100%; border-collapse: collapse; }
        .inventory-table th { text-align: left; padding: 1rem 1.5rem; background: #f8fafc; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; border-bottom: 1px solid #f1f5f9; }
        .inventory-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f8fafc; font-size: 14px; vertical-align: middle; }
        
        .code-cell code { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #475569; font-weight: 700; }
        .item-name-stack strong { display: block; color: #0f172a; font-size: 0.9rem; }
        .item-name-stack span { font-size: 11px; color: #94a3b8; font-weight: 800; }
        
        .stock-meter-box { width: 180px; }
        .stock-meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; font-weight: 800; }
        .stock-meta strong { color: #0f172a; }
        .stock-meta span { color: #94a3b8; }
        .meter-bg { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .meter-fill { height: 100%; border-radius: 10px; transition: 0.4s ease; }

        .stock-status { font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; }
        .stock-status.optimal { background: #ecfdf5; color: #059669; }
        .stock-status.low { background: #fee2e2; color: #ef4444; }

        .restock-btn-micro { padding: 6px 12px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px; font-weight: 800; color: #3b82f6; cursor: pointer; transition: 0.2s; }
        .restock-btn-micro:hover { border-color: #3b82f6; background: #eff6ff; }
        
        .empty-msg { text-align: center; padding: 5rem; color: #cbd5e1; font-weight: 700; font-style: italic; }
      `}</style>
    </section>
  );
}

