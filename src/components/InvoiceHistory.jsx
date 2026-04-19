/* ─── InvoiceHistory.jsx ─────────────────────────────────────────── */
import { useState } from 'react';
import { Clock, Trash2, Download, AlertTriangle, FileText, RotateCcw } from 'lucide-react';

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const fmtMoney = (inv) => {
  const sub = inv.items?.reduce((s, i) => s + (i.amount || 0), 0) || 0;
  const tax = (sub * (inv.taxRate || 0)) / 100;
  return `₹${(sub + tax).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

export default function InvoiceHistory({ history, onLoad, onDelete, onClear }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [loadedId,     setLoadedId]     = useState(null);

  const handleLoad = (snap) => {
    onLoad(snap);
    setLoadedId(snap.id);
    setTimeout(() => setLoadedId(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="py-16 text-center fade-in-up">
        <div className="w-20 h-20 rounded-3xl bg-[#F2EFE8] flex items-center justify-center mx-auto mb-5">
          <Clock size={36} className="text-[#D4C9B0]" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1F36] mb-2">No saved invoices yet</h3>
        <p className="text-sm text-[#9CA3AF] max-w-xs mx-auto leading-relaxed">
          Switch to the <strong>Preview</strong> tab and click{' '}
          <strong className="text-[#C9A454]">Save to History</strong> to store a snapshot of your invoice here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-5 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A1F36]">Invoice History</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{history.length} saved snapshot{history.length !== 1 ? 's' : ''} · stored locally in your browser</p>
        </div>
        <button
          onClick={() => {
            if (confirmClear) { onClear(); setConfirmClear(false); }
            else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
          }}
          className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl border-2 transition-all font-semibold ${
            confirmClear
              ? 'border-red-500 text-red-500 bg-red-50'
              : 'border-[#E8E4DB] text-[#9CA3AF] hover:border-red-400 hover:text-red-400'
          }`}
        >
          <AlertTriangle size={13} />
          {confirmClear ? 'Confirm Clear All?' : 'Clear All'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {history.map((snap) => (
          <div
            key={snap.id}
            className="card hover:shadow-md hover:border-[#C9A454]/40 transition-all duration-200 group relative"
          >
            {/* Invoice icon */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F2EFE8] flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-[#C9A454]" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[#1A1F36] text-sm truncate"
                  style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                  #{snap.invoiceNumber}
                </div>
                <div className="text-xs text-[#6B7280] truncate">{snap.clientName}</div>
              </div>
              {/* Total badge */}
              <div className="ml-auto flex-shrink-0">
                <span className="text-xs font-bold text-[#C9A454]"
                  style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                  {fmtMoney(snap.invoice)}
                </span>
              </div>
            </div>

            {/* Saved at */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#B0A99A] mb-4">
              <Clock size={10} />
              {fmtDate(snap.savedAt)}
            </div>

            {/* Item count chips */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-[10px] bg-[#F2EFE8] text-[#6B7280] px-2 py-1 rounded-lg">
                {snap.invoice.items?.length || 0} item{snap.invoice.items?.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] bg-[#F2EFE8] text-[#6B7280] px-2 py-1 rounded-lg">
                GST {snap.invoice.taxRate || 0}%
              </span>
              {snap.invoice.invoiceDate && (
                <span className="text-[10px] bg-[#F2EFE8] text-[#6B7280] px-2 py-1 rounded-lg">
                  {snap.invoice.invoiceDate}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[#F0EDE6]">
              <button
                onClick={() => handleLoad(snap)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all ${
                  loadedId === snap.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-[#1A1F36] text-white hover:bg-[#252B47]'
                }`}
              >
                <RotateCcw size={12} />
                {loadedId === snap.id ? 'Loaded!' : 'Load Invoice'}
              </button>
              <button
                onClick={() => onDelete(snap.id)}
                title="Delete"
                className="p-2 rounded-xl text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-[#C5BFB8] mt-8">
        History is stored in your browser's localStorage · max 30 snapshots
      </p>
    </div>
  );
}
