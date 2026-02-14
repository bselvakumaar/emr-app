export default function InventoryPage({ inventory, onAddItem, onRestock }) {
  return (
    <section className="view">
      <article className="panel">
        <h3>Inventory</h3>
        <form className="form-grid" onSubmit={onAddItem}>
          <input name="code" placeholder="Code" required />
          <input name="name" placeholder="Name" required />
          <input name="category" placeholder="Category" required />
          <input name="stock" type="number" required />
          <input name="reorder" type="number" required />
          <button type="submit">Add Item</button>
        </form>
        <table>
          <thead><tr><th>Code</th><th>Name</th><th>Stock</th><th>Reorder</th><th>Action</th></tr></thead>
          <tbody>{inventory.map((i) => <tr key={i.id}><td>{i.code}</td><td>{i.name}</td><td>{i.stock}</td><td>{i.reorder}</td><td><button className="action-btn" onClick={() => onRestock(i.id)}>Restock</button></td></tr>)}</tbody>
        </table>
      </article>
    </section>
  );
}
