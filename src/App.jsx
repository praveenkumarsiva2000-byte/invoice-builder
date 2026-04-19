/* ─── App.jsx ─────────────────────────────────────────────────────── */
import { useState } from 'react';
import { FileText, PenSquare, Eye, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { useInvoice } from './hooks/useInvoice';
import InvoiceEditor from './components/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview';
import InvoiceHistory from './components/InvoiceHistory';

const TABS = [
  { id: 'edit', label: 'Edit', Icon: PenSquare },
  { id: 'preview', label: 'Preview', Icon: Eye },
  { id: 'history', label: 'History', Icon: Clock },
];

export default function App() {
  const [tab, setTab] = useState('edit');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const {
    invoice,
    updateInvoiceField, updateFrom, updateTo,
    addItem, updateItem, removeItem, duplicateItem,
    subtotal, tax, total,
    history, saveToHistory, loadFromHistory, deleteFromHistory, clearHistory,
    resetInvoice,
  } = useInvoice();

  const handleReset = () => {
    if (resetConfirm) { resetInvoice(); setResetConfirm(false); }
    else { setResetConfirm(true); setTimeout(() => setResetConfirm(false), 3000); }
  };

  const handleSave = () => {
    saveToHistory();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleLoadHistory = (snap) => {
    loadFromHistory(snap);
    setTab('edit');
  };

  return (
    <div className="min-h-screen bg-[#F2EFE8]" style={{ fontFamily: "'Outfit',sans-serif" }}>

      {/* ── Header ── */}
      <header className="bg-[#1A1F36] text-white sticky top-0 z-50 shadow-xl shadow-[#1A1F36]/30">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#C9A454,#E8CB85)' }}>
              <FileText size={18} className="text-[#1A1F36]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none">InvoiceForge</h1>
              <p className="text-[10px] text-[#6E7FA3] mt-0.5 leading-none">Professional Invoice Builder</p>
            </div>
          </div>

          {/* Invoice badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#0D1117] rounded-lg px-4 py-1.5">
            <span className="text-[10px] text-[#6E7FA3] uppercase tracking-widest">Invoice</span>
            <span className="text-sm font-semibold text-[#C9A454]"
              style={{ fontFamily: "'JetBrains Mono',monospace" }}>
              #{invoice.invoiceNumber}
            </span>
            <span className="text-[10px] text-[#6E7FA3] ml-2 hidden md:inline">
              Due {invoice.dueDate || '—'}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Toast */}
            {savedToast && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle size={13} /> Saved!
              </span>
            )}

            {/* History count badge */}
            {history.length > 0 && (
              <span className="bg-[#C9A454] text-[#1A1F36] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}

            {/* Reset */}
            <button
              onClick={handleReset}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all ${resetConfirm
                  ? 'text-red-400 bg-red-900/30'
                  : 'text-[#6E7FA3] hover:text-white hover:bg-[#252B47]'
                }`}
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">{resetConfirm ? 'Confirm?' : 'Reset'}</span>
            </button>

            {/* Tab switcher */}
            <div className="flex bg-[#0D1117] rounded-xl p-1 gap-0.5">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${tab === id
                      ? 'bg-[#C9A454] text-[#1A1F36] shadow-sm'
                      : 'text-[#6E7FA3] hover:text-white'
                    }`}
                >
                  <Icon size={12} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gold progress bar */}
        <div style={{ height: 2, background: 'linear-gradient(90deg,#C9A454,#E8CB85 30%,transparent 60%)' }} />
      </header>

      {/* ── Live Totals Banner ── */}
      <div className="bg-white border-b border-[#E5E0D8] no-print">
        <div className="max-w-6xl mx-auto px-5 py-2 flex items-center justify-end gap-5 flex-wrap">
          {[
            { label: 'Subtotal', value: subtotal },
            { label: `GST (${invoice.taxRate}%)`, value: tax },
          ].map(({ label, value }) => (
            <span key={label} className="text-xs text-[#9CA3AF]">
              {label}{' '}
              <strong className="text-[#1A1F36]"
                style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </strong>
            </span>
          ))}
          <span className="text-[#D4C9B0]">·</span>
          <span className="text-xs font-semibold text-[#1A1F36]">
            Total{' '}
            <strong className="text-[#C9A454] text-sm"
              style={{ fontFamily: "'JetBrains Mono',monospace" }}>
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </strong>
          </span>
        </div>
      </div>

      {/* ── Page Content ── */}
      <main className="max-w-6xl mx-auto px-5 pb-16">
        {tab === 'edit' && (
          <InvoiceEditor
            invoice={invoice}
            updateInvoiceField={updateInvoiceField}
            updateFrom={updateFrom}
            updateTo={updateTo}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            duplicateItem={duplicateItem}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        )}
        {tab === 'preview' && (
          <InvoicePreview
            invoice={invoice}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onSave={handleSave}
          />
        )}
        {tab === 'history' && (
          <InvoiceHistory
            history={history}
            onLoad={handleLoadHistory}
            onDelete={deleteFromHistory}
            onClear={clearHistory}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E0D8] py-4 no-print">
        <div className="max-w-6xl mx-auto px-5 flex flex-wrap justify-between items-center gap-2">
          <span className="text-xs text-[#C5BFB8]">Quick. Easy. Reliable.</span>
          <span className="text-xs text-[#C5BFB8]">All copyrights reserved by invoiceforge 2026.</span>
        </div>
      </footer>
    </div>
  );
}
