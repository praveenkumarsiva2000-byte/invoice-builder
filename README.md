# 🧾 InvoiceForge — React Invoice Builder

A professional, fully-featured invoice generation app built with React JS + TailwindCSS.

---

## ✨ Features

- **Invoice Details** — editable invoice number, date, due date
- **From / To Sections** — business info, client info, GST number
- **Line Items** — add, edit, duplicate, delete items with auto-calculation
- **Real-time Totals** — subtotal, GST/tax (editable %), grand total updated live
- **Notes & Payment Info** — custom notes, bank/UPI details
- **PDF Export** — one-click A4 PDF download via html2pdf.js
- **Print Support** — clean print layout with `window.print()`
- **Reset** — clear all data and start fresh

---

## 🗂️ Project Structure

```
invoice-builder/
├── index.html                  ← App entry + Google Fonts
├── package.json                ← Dependencies
├── vite.config.js              ← Vite config
├── tailwind.config.js          ← Tailwind config
├── postcss.config.js           ← PostCSS config
└── src/
    ├── main.jsx                ← React root mount
    ├── App.jsx                 ← Main layout, tab nav, live totals
    ├── index.css               ← Tailwind + custom styles + print
    ├── hooks/
    │   └── useInvoice.js       ← All invoice state management
    └── components/
        ├── InvoiceEditor.jsx   ← Edit tab container
        ├── ClientSection.jsx   ← From / To panels
        ├── LineItemsTable.jsx  ← Items table with CRUD
        ├── SummarySection.jsx  ← Tax, totals, notes, payment
        └── InvoicePreview.jsx  ← Printable doc + PDF export
```

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI & state management |
| TailwindCSS 3 | Styling |
| React Hooks | `useState`, `useCallback`, `useMemo`, `useRef` |
| html2pdf.js | PDF export |
| lucide-react | Icons |
| Vite | Build tool / dev server |

---

## 📋 Step-by-Step Setup in VS Code

### Step 1 — Prerequisites
Make sure you have these installed:
- **Node.js** (v16 or higher) → https://nodejs.org
- **VS Code** → https://code.visualstudio.com

Check versions in terminal:
```bash
node -v    # should show v16+
npm -v     # should show 8+
```

### Step 2 — Open the Project in VS Code
1. Copy the `invoice-builder` folder to your preferred location
2. Open **VS Code**
3. Go to **File → Open Folder**
4. Select the `invoice-builder` folder
5. Click **Open**

### Step 3 — Open the Integrated Terminal
In VS Code press:
- **Windows/Linux:** `Ctrl + `` ` `` (backtick)
- **Mac:** `Cmd + `` ` `` (backtick)

Or go to **Terminal → New Terminal** from the menu bar.

### Step 4 — Install Dependencies
In the terminal, run:
```bash
npm install
```
This will install React, TailwindCSS, Vite, html2pdf.js, and all other packages.
It may take 1–2 minutes. You'll see a `node_modules/` folder appear.

### Step 5 — Start the Development Server
```bash
npm run dev
```
You'll see output like:
```
  VITE v4.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### Step 6 — Open in Browser
Open your browser and go to:
```
http://localhost:5173
```
The InvoiceForge app will load! 🎉

### Step 7 — Use the App
1. **Edit Tab** (default):
   - Fill in Invoice Number, Date, Due Date
   - Enter your business details under "From"
   - Enter client details under "Bill To"
   - Add line items using "Add Item" button
   - Edit Quantity and Rate — Amount calculates automatically
   - Adjust Tax Rate in the Summary section
   - Add Notes and Payment details

2. **Preview Tab**:
   - Click **Preview** button in the header
   - See the formatted invoice document
   - Click **Export PDF** to download as PDF
   - Click **Print** to print directly

### Step 8 — Build for Production (Optional)
To create an optimized production build:
```bash
npm run build
```
Output will be in the `dist/` folder. You can deploy this to any static host (Netlify, Vercel, GitHub Pages, etc.)

---

## 🔧 Recommended VS Code Extensions

Install these for the best development experience:
- **ES7+ React/Redux/React-Native snippets** — React code snippets
- **Tailwind CSS IntelliSense** — Autocomplete for Tailwind classes
- **Prettier - Code formatter** — Auto-format on save
- **Auto Rename Tag** — Sync HTML/JSX tag renaming

Install via VS Code Extensions sidebar (`Ctrl+Shift+X`).

---

## 🎨 Customization

### Change Colors
Edit `src/index.css` and `tailwind.config.js`:
```js
// tailwind.config.js
colors: {
  navy: '#1A1F36',   // ← change to your brand color
  gold: '#C9A454',   // ← change accent color
}
```

### Change Currency
In `src/hooks/useInvoice.js`, change the default currency:
```js
currency: '$',  // USD
currency: '€',  // EUR
currency: '£',  // GBP
```
Then update `fmt()` functions in components to use `invoice.currency`.

### Change Tax Label
In `SummarySection.jsx` and `InvoicePreview.jsx`, replace `GST` with `VAT`, `HST`, etc.

### Change Default Tax Rate
In `src/hooks/useInvoice.js`:
```js
taxRate: 10,  // change from 18 to any default %
```

---

## 🛠️ Troubleshooting

**`npm install` fails:**
- Try `npm install --legacy-peer-deps`
- Or delete `node_modules` and run again

**Port 5173 already in use:**
- Run on a different port: `npm run dev -- --port 3000`

**PDF export looks wrong:**
- Make sure you're on the Preview tab before exporting
- Try a different browser (Chrome recommended for best PDF output)
- Ensure all fonts are loaded (wait 1–2s after opening)

**Fonts not loading:**
- Check your internet connection (fonts load from Google Fonts CDN)
- For offline use, download and self-host the fonts

---

## 📄 License

MIT — Free to use, modify, and distribute.
