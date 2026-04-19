/* ─── InvoiceEditor.jsx ───────────────────────────────────────────── */

import ClientSection from './ClientSection';
import LineItemsTable from './LineItemsTable';
import SummarySection from './SummarySection';
import { Hash, Calendar, CalendarCheck } from 'lucide-react';

export default function InvoiceEditor({
  invoice,
  updateInvoiceField,
  updateFrom,
  updateTo,
  addItem,
  updateItem,
  removeItem,
  duplicateItem,
  subtotal,
  tax,
  total,
}) {
  return (
    <div className="space-y-5 py-5 fade-in-up">

      {/* ── Invoice Meta ─────────────────────────────────────────────── */}
      <div className="card">
        <p className="section-title">Invoice Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Invoice Number */}
          <div>
            <label className="label-base flex items-center gap-1.5">
              <Hash size={10} />
              Invoice Number
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
              className="input-base"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              placeholder="INV-001"
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="label-base flex items-center gap-1.5">
              <Calendar size={10} />
              Invoice Date
            </label>
            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => updateInvoiceField('invoiceDate', e.target.value)}
              className="input-base"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="label-base flex items-center gap-1.5">
              <CalendarCheck size={10} />
              Due Date
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
              className="input-base"
            />
          </div>
        </div>
      </div>

      {/* ── Client Sections ─────────────────────────────────────────── */}
      <ClientSection
        from={invoice.from}
        to={invoice.to}
        updateFrom={updateFrom}
        updateTo={updateTo}
      />

      {/* ── Line Items ──────────────────────────────────────────────── */}
      <LineItemsTable
        items={invoice.items}
        addItem={addItem}
        updateItem={updateItem}
        removeItem={removeItem}
        duplicateItem={duplicateItem}
      />

      {/* ── Summary ─────────────────────────────────────────────────── */}
      <SummarySection
        subtotal={subtotal}
        taxRate={invoice.taxRate}
        tax={tax}
        total={total}
        notes={invoice.notes}
        paymentInfo={invoice.paymentInfo}
        updateInvoiceField={updateInvoiceField}
      />
    </div>
  );
}
