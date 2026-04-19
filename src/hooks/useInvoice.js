import { useState, useCallback, useMemo } from 'react';

const generateId = () => Math.random().toString(36).substr(2, 9);
const todayStr = () => new Date().toISOString().split('T')[0];
const dueDateStr = () => {
  const d = new Date(); d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

const blankInvoice = () => ({
  invoiceNumber: 'INV-001',
  invoiceDate: todayStr(),
  dueDate: dueDateStr(),
  from: { name: '', email: '', phone: '', address: '', city: '', taxId: '' },
  to:   { name: '', email: '', phone: '', address: '', city: '' },
  items: [{ id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }],
  taxRate: 18,
  notes: 'Thank you for your business! Payment is due within 30 days.',
  paymentInfo: '',
});

const HISTORY_KEY = 'invoiceforge_history';

const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
};

export const useInvoice = () => {
  const [invoice, setInvoice] = useState(blankInvoice);
  const [history, setHistory] = useState(loadHistory);

  /* ── Meta ── */
  const updateInvoiceField = useCallback((field, value) =>
    setInvoice(p => ({ ...p, [field]: value })), []);

  /* ── From / To ── */
  const updateFrom = useCallback((field, value) =>
    setInvoice(p => ({ ...p, from: { ...p.from, [field]: value } })), []);
  const updateTo = useCallback((field, value) =>
    setInvoice(p => ({ ...p, to: { ...p.to, [field]: value } })), []);

  /* ── Items ── */
  const addItem = useCallback(() =>
    setInvoice(p => ({
      ...p,
      items: [...p.items, { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }],
    })), []);

  const updateItem = useCallback((id, field, value) =>
    setInvoice(p => ({
      ...p,
      items: p.items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = parseFloat(updated.quantity || 0) * parseFloat(updated.rate || 0);
        }
        return updated;
      }),
    })), []);

  const removeItem = useCallback((id) =>
    setInvoice(p => ({ ...p, items: p.items.filter(i => i.id !== id) })), []);

  const duplicateItem = useCallback((id) =>
    setInvoice(p => {
      const idx = p.items.findIndex(i => i.id === id);
      if (idx === -1) return p;
      const clone = { ...p.items[idx], id: generateId() };
      const items = [...p.items];
      items.splice(idx + 1, 0, clone);
      return { ...p, items };
    }), []);

  /* ── Totals ── */
  const subtotal = useMemo(() =>
    invoice.items.reduce((s, i) => s + (i.amount || 0), 0), [invoice.items]);
  const tax   = useMemo(() => (subtotal * invoice.taxRate) / 100, [subtotal, invoice.taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  /* ── History ── */
  const saveToHistory = useCallback(() => {
    setInvoice(cur => {
      const snap = {
        id: Date.now(),
        savedAt: new Date().toISOString(),
        invoiceNumber: cur.invoiceNumber,
        clientName: cur.to.name || 'Unknown Client',
        invoice: { ...cur, items: cur.items.map(i => ({ ...i })) },
      };
      setHistory(prev => {
        const updated = [snap, ...prev].slice(0, 30);
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
      return cur;
    });
  }, []);

  const loadFromHistory = useCallback((snap) =>
    setInvoice({ ...snap.invoice }), []);

  const deleteFromHistory = useCallback((id) =>
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    }), []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  }, []);

  /* ── Reset ── */
  const resetInvoice = useCallback(() => setInvoice(blankInvoice()), []);

  return {
    invoice,
    updateInvoiceField, updateFrom, updateTo,
    addItem, updateItem, removeItem, duplicateItem,
    subtotal, tax, total,
    history, saveToHistory, loadFromHistory, deleteFromHistory, clearHistory,
    resetInvoice,
  };
};
