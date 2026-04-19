/* ─── SummarySection.jsx ──────────────────────────────────────────── */

const fmt = (val) =>
  `₹${Number(val || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Row = ({ label, value, muted = false, large = false }) => (
  <div className={`flex justify-between items-center ${large ? 'py-1' : 'py-2'}`}>
    <span
      className={
        large
          ? 'text-base font-bold text-[#1A1F36]'
          : muted
          ? 'text-sm text-[#9CA3AF]'
          : 'text-sm text-[#6B7280]'
      }
    >
      {label}
    </span>
    <span
      className={
        large
          ? 'text-xl font-bold text-[#C9A454]'
          : 'text-sm font-medium text-[#1A1F36]'
      }
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {value}
    </span>
  </div>
);

export default function SummarySection({
  subtotal,
  taxRate,
  tax,
  total,
  notes,
  paymentInfo,
  updateInvoiceField,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* ── Notes & Payment ── */}
      <div className="space-y-5">
        <div className="card">
          <p className="section-title">Notes / Terms</p>
          <textarea
            value={notes}
            onChange={(e) => updateInvoiceField('notes', e.target.value)}
            placeholder="Payment terms, thank you note, or additional information..."
            rows={4}
            className="input-base resize-none !rounded-xl"
          />
        </div>

        <div className="card">
          <p className="section-title">Payment Details</p>
          <textarea
            value={paymentInfo}
            onChange={(e) => updateInvoiceField('paymentInfo', e.target.value)}
            placeholder="Bank Name: HDFC Bank&#10;Account No: 1234567890&#10;IFSC: HDFC0001234&#10;UPI: yourupi@bank"
            rows={4}
            className="input-base resize-none !rounded-xl"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
          />
        </div>
      </div>

      {/* ── Summary Card ── */}
      <div className="card flex flex-col justify-between">
        <div>
          <p className="section-title">Invoice Summary</p>

          <Row label="Subtotal" value={fmt(subtotal)} />

          {/* Tax row with editable rate */}
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B7280]">Tax Rate</span>
              <div className="flex items-center border border-[#E5E0D8] rounded-lg overflow-hidden">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) =>
                    updateInvoiceField('taxRate', parseFloat(e.target.value) || 0)
                  }
                  className="w-14 px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#C9A454] bg-white"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
                <span className="px-2 text-xs text-[#9CA3AF] bg-[#FAFAF7] border-l border-[#E5E0D8] h-full flex items-center py-1">
                  %
                </span>
              </div>
            </div>
            <span
              className="text-sm font-medium text-[#1A1F36]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {fmt(tax)}
            </span>
          </div>

          <div className="my-3 h-px bg-gradient-to-r from-[#C9A454] via-[#E8CB85] to-transparent" />

          <Row label="Total Due" value={fmt(total)} large />
        </div>

        {/* Status badge */}
        <div className="mt-6 pt-4 border-t border-[#F0EDE6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-[#9CA3AF]">Draft · Unpaid</span>
            </div>
            <div className="text-xs text-[#C5BFB8]">
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
