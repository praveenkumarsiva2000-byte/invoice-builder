/* ─── LineItemsTable.jsx ─────────────────────────────────────────────
   Fix: use React.memo on row + stable key + no tableLayout:fixed
   to prevent focus loss and allow multi-word typing.
──────────────────────────────────────────────────────────────────── */
import { memo } from 'react';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';

const fmt = (val) =>
  Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const thStyle = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#9CA3AF',
  fontFamily: "'Outfit', sans-serif",
  whiteSpace: 'nowrap',
};

/* Memoised row — only re-renders when its own item changes */
const ItemRow = memo(({ item, idx, totalItems, updateItem, removeItem, duplicateItem }) => (
  <tr className="group border-b border-[#F0EDE6] hover:bg-[#FAFAF7] transition-colors">

    {/* Grip */}
    <td className="py-2.5 px-2 w-6 text-[#D4C9B0] align-middle">
      <GripVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </td>

    {/* Description — takes all remaining space */}
    <td className="py-2.5 px-2 align-middle">
      <input
        type="text"
        autoComplete="off"
        value={item.description}
        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
        placeholder={`Item ${idx + 1} — e.g. Web Design Services`}
        className="w-full bg-transparent border border-transparent focus:border-[#C9A454] focus:bg-white rounded-lg px-2.5 py-1.5 text-sm text-[#1A1F36] placeholder:text-[#D4C9B0] focus:outline-none focus:ring-1 focus:ring-[#C9A454]/30 transition-all"
      />
    </td>

    {/* Qty */}
    <td className="py-2.5 px-2 w-24 align-middle">
      <input
        type="number"
        min="0"
        step="1"
        value={item.quantity}
        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
        className="w-full bg-transparent border border-transparent focus:border-[#C9A454] focus:bg-white rounded-lg px-2 py-1.5 text-sm text-right text-[#1A1F36] focus:outline-none focus:ring-1 focus:ring-[#C9A454]/30 transition-all"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
    </td>

    {/* Rate */}
    <td className="py-2.5 px-2 w-36 align-middle">
      <input
        type="number"
        min="0"
        step="0.01"
        value={item.rate}
        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
        className="w-full bg-transparent border border-transparent focus:border-[#C9A454] focus:bg-white rounded-lg px-2 py-1.5 text-sm text-right text-[#1A1F36] focus:outline-none focus:ring-1 focus:ring-[#C9A454]/30 transition-all"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
    </td>

    {/* Amount — read-only */}
    <td className="py-2.5 px-2 w-36 text-right align-middle">
      <span className="text-sm font-semibold text-[#1A1F36]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {fmt(item.amount)}
      </span>
    </td>

    {/* Actions */}
    <td className="py-2.5 px-2 w-20 align-middle">
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => duplicateItem(item.id)}
          title="Duplicate"
          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#C9A454] hover:bg-[#C9A454]/10 transition-all"
        >
          <Copy size={13} />
        </button>
        {totalItems > 1 && (
          <button
            onClick={() => removeItem(item.id)}
            title="Delete"
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </td>
  </tr>
), (prev, next) =>
  prev.item === next.item &&
  prev.totalItems === next.totalItems
);

export default function LineItemsTable({ items, addItem, updateItem, removeItem, duplicateItem }) {
  return (
    <div className="card">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="section-title mb-0">Line Items</p>
        <button onClick={addItem} className="btn-primary">
          <Plus size={15} strokeWidth={2.5} />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr className="border-b-2 border-[#E8E4DB]">
              <th className="py-2.5 px-2 w-6" />
              <th className="py-2.5 px-2 text-left" style={thStyle}>Description</th>
              <th className="py-2.5 px-2 w-24 text-right" style={thStyle}>Qty</th>
              <th className="py-2.5 px-2 w-36 text-right" style={thStyle}>Rate (₹)</th>
              <th className="py-2.5 px-2 w-36 text-right" style={thStyle}>Amount (₹)</th>
              <th className="py-2.5 px-2 w-20" />
            </tr>
          </thead>

          <tbody>
            {items.map((item, idx) => (
              <ItemRow
                key={item.id}
                item={item}
                idx={idx}
                totalItems={items.length}
                updateItem={updateItem}
                removeItem={removeItem}
                duplicateItem={duplicateItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 text-[#C5BFB8] text-sm">
          No items yet —{' '}
          <button onClick={addItem} className="text-[#C9A454] underline underline-offset-2 hover:no-underline">
            Add Item
          </button>{' '}
          to start
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#F0EDE6] flex justify-between text-xs text-[#B0A99A]">
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          <span>Hover a row to duplicate or delete</span>
        </div>
      )}
    </div>
  );
}
