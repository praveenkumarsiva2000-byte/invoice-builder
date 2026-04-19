/* ─── ClientSection.jsx ───────────────────────────────────────────── */
/*
  BUG FIX: Field and Panel were defined INSIDE the parent component
  function body. React treated them as new component types on every
  render → unmount + remount → input lost focus after each character.
  Fix: move both to module scope so they are stable references.
*/

/* ── Shared field — defined at MODULE level, not inside ClientSection ── */
function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="label-base">{label}</label>
      <input
        type={type}
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base"
      />
    </div>
  );
}

/* ── Panel wrapper — also at MODULE level ── */
function Panel({ title, children }) {
  return (
    <div className="card relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, #C9A454, transparent)' }}
      />
      <p className="section-title">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ── Main component ── */
export default function ClientSection({ from, to, updateFrom, updateTo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* ── From (Your Business) ── */}
      <Panel title="From — Your Business">
        <Field
          label="Business / Your Name"
          value={from.name}
          onChange={(v) => updateFrom('name', v)}
          placeholder="Acme Solutions Pvt. Ltd."
        />
        <Field
          label="Email Address"
          value={from.email}
          onChange={(v) => updateFrom('email', v)}
          placeholder="hello@acme.com"
          type="email"
        />
        <Field
          label="Phone Number"
          value={from.phone}
          onChange={(v) => updateFrom('phone', v)}
          placeholder="+91 98765 43210"
          type="tel"
        />
        <Field
          label="Street Address"
          value={from.address}
          onChange={(v) => updateFrom('address', v)}
          placeholder="42 MG Road, Bangalore – 560001"
        />
        <Field
          label="City / State"
          value={from.city}
          onChange={(v) => updateFrom('city', v)}
          placeholder="Bangalore, Karnataka"
        />
        <Field
          label="GST / Tax Number"
          value={from.taxId}
          onChange={(v) => updateFrom('taxId', v)}
          placeholder="27AAPFU0939F1ZV"
        />
      </Panel>

      {/* ── Bill To (Client) ── */}
      <Panel title="Bill To — Client Info">
        <Field
          label="Client Name / Company"
          value={to.name}
          onChange={(v) => updateTo('name', v)}
          placeholder="Client Corporation Ltd."
        />
        <Field
          label="Email Address"
          value={to.email}
          onChange={(v) => updateTo('email', v)}
          placeholder="client@example.com"
          type="email"
        />
        <Field
          label="Phone Number"
          value={to.phone}
          onChange={(v) => updateTo('phone', v)}
          placeholder="+91 98765 43210"
          type="tel"
        />
        <Field
          label="Street Address"
          value={to.address}
          onChange={(v) => updateTo('address', v)}
          placeholder="12 Park Street, Mumbai – 400001"
        />
        <Field
          label="City / State"
          value={to.city}
          onChange={(v) => updateTo('city', v)}
          placeholder="Mumbai, Maharashtra"
        />
      </Panel>

    </div>
  );
}