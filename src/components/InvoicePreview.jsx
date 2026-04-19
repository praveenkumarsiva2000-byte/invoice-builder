/* ─── InvoicePreview.jsx ──────────────────────────────────────────── */
import { useRef, useState } from 'react';
import { Download, Printer, CheckCircle } from 'lucide-react';

const fmt = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (s) => {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

export default function InvoicePreview({ invoice, subtotal, tax, total, onSave }) {
  const docRef  = useRef(null);
  const [busy,  setBusy]  = useState(false);
  const [done,  setDone]  = useState(false);
  const [error, setError] = useState('');

  /* ── PDF Export via html2canvas + jsPDF ── */
  const handleExportPDF = async () => {
    setBusy(true);
    setError('');
    try {
      const el = docRef.current;

      // Dynamic imports keep the initial bundle lean
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw      = pdf.internal.pageSize.getWidth();   // 210
      const ph      = pdf.internal.pageSize.getHeight();  // 297
      const ratio   = pw / canvas.width;
      const ih      = canvas.height * ratio;              // image height in mm

      let remaining = ih;
      let yOffset   = 0;

      pdf.addImage(imgData, 'PNG', 0, yOffset, pw, ih);
      remaining -= ph;

      while (remaining > 0) {
        yOffset -= ph;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, yOffset, pw, ih);
        remaining -= ph;
      }

      pdf.save(`${invoice.invoiceNumber || 'invoice'}.pdf`);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Export failed — please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-5 fade-in-up">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <p className="text-sm text-[#9CA3AF]">
          Invoice preview · <strong className="text-[#1A1F36]">Export PDF</strong> to download
        </p>
        <div className="flex items-center gap-3">
          {done && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <CheckCircle size={15} /> Downloaded!
            </span>
          )}
          {error && <span className="text-sm text-red-500">{error}</span>}

          <button
            onClick={onSave}
            className="flex items-center gap-2 border-2 border-[#C9A454] text-[#C9A454] hover:bg-[#C9A454] hover:text-[#1A1F36] text-sm px-4 py-2 rounded-xl transition-all font-semibold"
          >
            Save to History
          </button>

          <button onClick={() => window.print()} className="btn-outline no-print">
            <Printer size={15} /> Print
          </button>

          <button onClick={handleExportPDF} disabled={busy} className="btn-gold no-print">
            {busy ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating…
              </>
            ) : (
              <><Download size={15} /> Export PDF</>
            )}
          </button>
        </div>
      </div>

      {/* ── Invoice Document ── */}
      <div
        id="invoice-document"
        ref={docRef}
        className="bg-white rounded-2xl shadow-2xl shadow-[#1A1F36]/10 overflow-hidden max-w-4xl mx-auto"
        style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
      >
        {/* Top stripe */}
        <div style={{ height: 7, background: 'linear-gradient(90deg,#C9A454,#E8CB85 50%,#C9A454)' }} />

        <div className="p-10 sm:p-14">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1F36] leading-tight mb-1">
                {invoice.from.name || <span className="text-[#C5BFB8] italic">Your Business</span>}
              </h1>
              {invoice.from.email   && <p className="text-sm text-[#6B7280]">{invoice.from.email}</p>}
              {invoice.from.phone   && <p className="text-sm text-[#6B7280]">{invoice.from.phone}</p>}
              {invoice.from.address && <p className="text-sm text-[#6B7280]">{invoice.from.address}</p>}
              {invoice.from.city    && <p className="text-sm text-[#6B7280]">{invoice.from.city}</p>}
              {invoice.from.taxId   && <p className="text-xs text-[#9CA3AF] mt-1">GST: {invoice.from.taxId}</p>}
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-5xl font-bold text-[#C9A454] leading-none mb-2" style={{ letterSpacing: '-2px' }}>
                INVOICE
              </div>
              <div className="text-base font-medium text-[#6B7280] mb-4" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                #{invoice.invoiceNumber}
              </div>
              <div className="flex gap-8 justify-end">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#C9A454] mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>Date</div>
                  <div className="text-sm text-[#1A1F36] font-medium">{fmtDate(invoice.invoiceDate)}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#C9A454] mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>Due</div>
                  <div className="text-sm text-[#1A1F36] font-medium">{fmtDate(invoice.dueDate)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-8" style={{ height: 1.5, background: 'linear-gradient(90deg,#C9A454,#E8CB85 40%,transparent)' }} />

          {/* ── Bill To ── */}
          <div className="mb-10">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A454] mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>Bill To</div>
            {invoice.to.name ? (
              <>
                <div className="text-lg font-bold text-[#1A1F36]">{invoice.to.name}</div>
                {invoice.to.email   && <div className="text-sm text-[#6B7280]">{invoice.to.email}</div>}
                {invoice.to.phone   && <div className="text-sm text-[#6B7280]">{invoice.to.phone}</div>}
                {invoice.to.address && <div className="text-sm text-[#6B7280]">{invoice.to.address}</div>}
                {invoice.to.city    && <div className="text-sm text-[#6B7280]">{invoice.to.city}</div>}
              </>
            ) : (
              <p className="text-[#C5BFB8] italic text-sm">Client details not filled</p>
            )}
          </div>

          {/* ── Items Table ── */}
          <div className="mb-10 overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1A1F36' }}>
                  {['Description','Qty','Unit Rate','Amount'].map((h, i) => (
                    <th
                      key={h}
                      className={i === 0 ? 'text-left py-3 px-4' : 'text-right py-3 px-4 w-28'}
                      style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A454', fontFamily: "'Outfit',sans-serif" }}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.items.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-sm text-[#C5BFB8] italic">No items added</td></tr>
                ) : invoice.items.map((item, idx) => (
                  <tr key={item.id} style={{ background: idx % 2 === 0 ? '#FAFAF7' : '#fff', borderBottom: '1px solid #EFE9E0' }}>
                    <td className="py-3 px-4 text-sm text-[#1A1F36]">
                      {item.description || <span className="text-[#C5BFB8] italic">No description</span>}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-[#4B5563]" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-sm text-[#4B5563]" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(item.rate)}</td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-[#1A1F36]" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-end mb-10">
            <div className="w-72">
              {[
                { label: 'Subtotal', value: fmt(subtotal) },
                { label: `GST / Tax (${invoice.taxRate}%)`, value: fmt(tax) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#EFE9E0]">
                  <span className="text-sm text-[#6B7280]" style={{ fontFamily: "'Outfit',sans-serif" }}>{label}</span>
                  <span className="text-sm font-medium text-[#1A1F36]" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{value}</span>
                </div>
              ))}
              <div className="my-2" style={{ height: 1.5, background: 'linear-gradient(90deg,#C9A454,#E8CB85 60%,transparent)' }} />
              <div className="flex justify-between py-1">
                <span className="text-lg font-bold text-[#1A1F36]">Total Due</span>
                <span className="text-2xl font-bold text-[#C9A454]" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* ── Payment Info ── */}
          {invoice.paymentInfo && (
            <div className="mb-8 p-4 rounded-xl border border-[#E5E0D8] bg-[#FAFAF7]">
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A454] mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>Payment Details</div>
              <pre className="text-xs text-[#4B5563] whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{invoice.paymentInfo}</pre>
            </div>
          )}

          {/* ── Notes ── */}
          {invoice.notes && (
            <div className="mb-8 border-t border-[#EFE9E0] pt-6">
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A454] mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>Notes</div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="border-t border-[#EFE9E0] pt-6 flex justify-between items-center">
            <p className="text-xs text-[#B0A99A] italic">Thank you for your business</p>
            {invoice.from.name && <p className="text-xs text-[#B0A99A]" style={{ fontFamily: "'Outfit',sans-serif" }}>{invoice.from.name}</p>}
          </div>
        </div>

        {/* Bottom stripe */}
        <div style={{ height: 4, background: 'linear-gradient(90deg,#C9A454,#E8CB85 50%,#C9A454)' }} />
      </div>
    </div>
  );
}
