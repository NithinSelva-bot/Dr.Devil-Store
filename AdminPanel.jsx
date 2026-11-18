// src/components/AdminPanel.jsx
// ─────────────────────────────────────────────────────────────────────────────
// DR.DEVIL Admin Panel
// Features:
//   - List all products with edit / delete actions
//   - Full product form: add new or edit existing
//   - Saves directly to src/data/products.json via the Vite dev-server plugin
//   - 100% offline — no API key, no internet required
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  "DEV BOARD", "ESP MODULE", "SBC", "CYBER TOOL",
  "STARTER KIT", "IOT SENSOR", "IOT MODULE", "ACCESSORY",
];
const BADGES = ["", "NEW", "HOT", "-10%", "-20%", "-30%", "-40%", "-50%"];

const EMPTY = {
  id: null,
  name: "",
  price: "",
  oldPrice: "",
  description: "",
  details: "",
  image: "",
  category: CATEGORIES[0],
  badge: "",
  rating: "4.5",
  stock: "",
  specs: ["", "", ""],
};

// ── Tiny style helpers ─────────────────────────────────────────────────────
const S = {
  label: {
    display: "block",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10,
    color: "var(--accent)",
    letterSpacing: 2,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 15,
    padding: "10px 14px",
    outline: "none",
    borderRadius: 2,
    transition: "border-color .2s",
  },
  inputFocus: { borderColor: "var(--accent)" },
  group: { marginBottom: 20 },
  btn: (variant = "primary") => ({
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    padding: "11px 24px",
    border: "1px solid",
    cursor: "none",
    transition: "all .2s",
    ...(variant === "primary"
      ? { background: "var(--accent)", color: "var(--bg)", borderColor: "var(--accent)" }
      : variant === "danger"
      ? { background: "transparent", color: "var(--accent2)", borderColor: "var(--accent2)" }
      : { background: "transparent", color: "var(--dim)", borderColor: "var(--border)" }),
  }),
};

// ── FocusInput wrapper (adds glow on focus) ────────────────────────────────
function FInput({ as: Tag = "input", style = {}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      style={{ ...S.input, ...(focused ? S.inputFocus : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ── Toast notification ─────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const color = type === "error" ? "var(--accent2)" : "var(--accent3)";
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 999,
      background: "var(--bg2)", border: `1px solid ${color}`,
      color, fontFamily: "'Share Tech Mono', monospace",
      fontSize: 12, letterSpacing: 1.5, padding: "14px 24px",
      boxShadow: `0 0 24px ${color}44`,
      animation: "fadeUp .3s ease both",
    }}>
      {type === "error" ? "✗ " : "✓ "}{msg}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AdminPanel({ onBack }) {
  const [products, setProducts] = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [mode, setMode]       = useState("list"); // "list" | "edit"
  const [toast, setToast]     = useState({ msg: "", type: "ok" });
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  // ── Load products from JSON ──────────────────────────────────────────────
  const loadProducts = async () => {
    try {
      const r = await fetch(`/src/data/products.json?t=${Date.now()}`);
      const data = await r.json();
      setProducts(data);
    } catch {
      showToast("Could not load products.json", "error");
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3200);
  };

  // ── Form helpers ─────────────────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const setSpec = (i) => (e) => {
    const specs = [...form.specs];
    specs[i] = e.target.value;
    setForm((f) => ({ ...f, specs }));
  };

  const addSpec = () =>
    setForm((f) => ({ ...f, specs: [...f.specs, ""] }));

  const removeSpec = (i) =>
    setForm((f) => ({ ...f, specs: f.specs.filter((_, j) => j !== i) }));

  const editProduct = (p) => {
    setForm({
      ...p,
      oldPrice: p.oldPrice ?? "",
      badge: p.badge ?? "",
      specs: p.specs?.length ? [...p.specs] : [""],
    });
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const newProduct = () => {
    setForm(EMPTY);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Basic validation
    if (!form.name.trim())        return showToast("Name is required", "error");
    if (!form.price)              return showToast("Price is required", "error");
    if (!form.description.trim()) return showToast("Description is required", "error");

    setSaving(true);
    try {
      const payload = {
        ...form,
        id:       form.id ?? null,
        price:    Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        rating:   Number(form.rating) || 4.5,
        stock:    Number(form.stock) || 0,
        badge:    form.badge || null,
        specs:    form.specs.filter((s) => s.trim()),
      };

      const r = await fetch("/api/save-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error);

      await loadProducts();
      showToast(form.id ? "Product updated!" : "Product added!");
      setMode("list");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const r = await fetch(`/api/delete-product/${id}`, { method: "DELETE" });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error);
      await loadProducts();
      showToast("Product deleted.");
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  // ── Render: Product List ──────────────────────────────────────────────────
  const renderList = () => (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--accent3)", letterSpacing: 2, marginBottom: 4 }}>
            // PRODUCT DATABASE
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>
            {products.length} PRODUCTS
          </h2>
        </div>
        <button
          style={S.btn("primary")}
          onClick={newProduct}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--bg)"; }}
        >
          + ADD PRODUCT
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["ID", "NAME", "CATEGORY", "PRICE", "STOCK", "BADGE", "ACTIONS"].map(h => (
                <th key={h} style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: 9,
                  color: "var(--accent)", letterSpacing: 2,
                  padding: "10px 14px", textAlign: "left",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: i % 2 === 0 ? "transparent" : "rgba(0,245,255,.02)",
                  transition: "background .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,245,255,.05)"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,245,255,.02)"}
              >
                <td style={{ padding: "12px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--dim)" }}>#{p.id}</td>
                <td style={{ padding: "12px 14px", fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: "#fff", maxWidth: 200 }}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>{p.image?.length <= 2 ? p.image : "📦"}</span>
                  {p.name}
                </td>
                <td style={{ padding: "12px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--accent3)", letterSpacing: 1 }}>{p.category}</td>
                <td style={{ padding: "12px 14px", fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: "var(--accent)" }}>₹{Number(p.price).toLocaleString("en-IN")}</td>
                <td style={{ padding: "12px 14px", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: p.stock <= 5 ? "var(--accent2)" : "var(--dim)" }}>{p.stock}</td>
                <td style={{ padding: "12px 14px" }}>
                  {p.badge && (
                    <span style={{
                      fontFamily: "'Orbitron', sans-serif", fontSize: 9, fontWeight: 700,
                      background: p.badge === "HOT" ? "var(--accent2)" : "var(--accent3)",
                      color: "#000", padding: "3px 7px", letterSpacing: 1,
                    }}>{p.badge}</span>
                  )}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      style={{ ...S.btn("ghost"), padding: "6px 14px", fontSize: 9 }}
                      onClick={() => editProduct(p)}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                    >
                      EDIT
                    </button>
                    <button
                      style={{ ...S.btn("danger"), padding: "6px 14px", fontSize: 9, opacity: deleting === p.id ? 0.5 : 1 }}
                      onClick={() => { if (window.confirm(`Delete "${p.name}"?`)) handleDelete(p.id); }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent2)"; e.currentTarget.style.color = "#000"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent2)"; }}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? "..." : "DEL"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Render: Edit Form ─────────────────────────────────────────────────────
  const renderForm = () => (
    <div>
      {/* Form header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--accent3)", letterSpacing: 2, marginBottom: 4 }}>
          {form.id ? `// EDITING PRODUCT #${form.id}` : "// NEW PRODUCT"}
        </div>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>
          {form.id ? "EDIT PRODUCT" : "ADD PRODUCT"}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Name */}
        <div style={{ ...S.group, gridColumn: "1 / -1" }}>
          <label style={S.label}>PRODUCT NAME *</label>
          <FInput value={form.name} onChange={set("name")} placeholder="e.g. Arduino UNO R4 WiFi" />
        </div>

        {/* Price */}
        <div style={S.group}>
          <label style={S.label}>PRICE (₹) *</label>
          <FInput type="number" value={form.price} onChange={set("price")} placeholder="e.g. 3499" />
        </div>

        {/* Old Price */}
        <div style={S.group}>
          <label style={S.label}>OLD PRICE (₹) — optional</label>
          <FInput type="number" value={form.oldPrice} onChange={set("oldPrice")} placeholder="e.g. 4200 (leave blank for none)" />
        </div>

        {/* Category */}
        <div style={S.group}>
          <label style={S.label}>CATEGORY *</label>
          <FInput as="select" value={form.category} onChange={set("category")}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </FInput>
        </div>

        {/* Badge */}
        <div style={S.group}>
          <label style={S.label}>BADGE</label>
          <FInput as="select" value={form.badge} onChange={set("badge")}>
            {BADGES.map(b => <option key={b} value={b}>{b || "(none)"}</option>)}
          </FInput>
        </div>

        {/* Rating */}
        <div style={S.group}>
          <label style={S.label}>RATING (0–5)</label>
          <FInput type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set("rating")} />
        </div>

        {/* Stock */}
        <div style={S.group}>
          <label style={S.label}>STOCK (units)</label>
          <FInput type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="e.g. 25" />
        </div>

        {/* Image */}
        <div style={{ ...S.group, gridColumn: "1 / -1" }}>
          <label style={S.label}>IMAGE — emoji or URL</label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <FInput value={form.image} onChange={set("image")} placeholder="e.g. 🔵  or  https://example.com/img.png" style={{ flex: 1 }} />
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              background: "var(--bg3)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>
              {form.image
                ? (form.image.startsWith("http") || form.image.includes("."))
                  ? <img src={form.image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : form.image
                : "📦"}
            </div>
          </div>
        </div>

        {/* Short description */}
        <div style={{ ...S.group, gridColumn: "1 / -1" }}>
          <label style={S.label}>SHORT DESCRIPTION * (shown on card, max ~80 chars)</label>
          <FInput
            as="textarea"
            rows={2}
            value={form.description}
            onChange={set("description")}
            placeholder="e.g. RA4M1 MCU + ESP32-S3 WiFi/BT combo. 48MHz, USB-C, LED matrix."
            style={{ resize: "vertical" }}
          />
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: form.description.length > 80 ? "var(--accent2)" : "var(--dim)", marginTop: 4, letterSpacing: 1 }}>
            {form.description.length}/80 chars
          </div>
        </div>

        {/* Long details */}
        <div style={{ ...S.group, gridColumn: "1 / -1" }}>
          <label style={S.label}>FULL DETAILS (shown on product page)</label>
          <FInput
            as="textarea"
            rows={4}
            value={form.details}
            onChange={set("details")}
            placeholder="Longer paragraph describing the product in detail..."
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Specs */}
        <div style={{ ...S.group, gridColumn: "1 / -1" }}>
          <label style={S.label}>SPECS — one per line</label>
          {form.specs.map((spec, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <FInput
                value={spec}
                onChange={setSpec(i)}
                placeholder={`Spec ${i + 1}  e.g. Dual-core Xtensa LX7 @ 240MHz`}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => removeSpec(i)}
                style={{ ...S.btn("danger"), padding: "8px 14px", fontSize: 16, lineHeight: 1 }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent2)"; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent2)"; }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addSpec}
            style={{ ...S.btn("ghost"), fontSize: 9, padding: "8px 16px", marginTop: 4 }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent3)"; e.currentTarget.style.borderColor = "var(--accent3)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            + ADD SPEC
          </button>
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ ...S.btn("primary"), opacity: saving ? 0.6 : 1, padding: "13px 36px" }}
          onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = "var(--bg)"; e.currentTarget.style.color = "var(--accent)"; }}}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--bg)"; }}
        >
          {saving ? "SAVING..." : form.id ? "SAVE CHANGES ⟶" : "ADD PRODUCT ⟶"}
        </button>
        <button
          onClick={() => setMode("list")}
          style={{ ...S.btn("ghost"), padding: "13px 24px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );

  // ── Root render ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", paddingTop: 40, paddingBottom: 80, position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>

        {/* Panel header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 40,
        }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--accent2)", letterSpacing: 3, marginBottom: 6 }}>
              ⬡ DR.DEVIL ADMIN TERMINAL v1.0
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 26, fontWeight: 900, color: "var(--accent)", textShadow: "0 0 20px var(--accent)" }}>
              ADMIN PANEL
            </div>
          </div>
          <button
            onClick={onBack}
            style={{ ...S.btn("ghost"), padding: "10px 22px" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            ← BACK TO STORE
          </button>
        </div>

        {/* Tab switcher — only show in list mode */}
        {mode === "list" && (
          <div style={{
            display: "flex", gap: 0, marginBottom: 32,
            borderBottom: "1px solid var(--border)",
          }}>
            {["ALL PRODUCTS", "ADD NEW"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => i === 1 ? newProduct() : setMode("list")}
                style={{
                  fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: 2, fontWeight: 700,
                  background: "transparent", border: "none",
                  borderBottom: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
                  color: i === 0 ? "var(--accent)" : "var(--dim)",
                  padding: "10px 24px", cursor: "none", transition: "color .2s",
                }}
                onMouseEnter={e => { if (i !== 0) e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { if (i !== 0) e.currentTarget.style.color = "var(--dim)"; }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        <div style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          padding: 32,
        }}>
          {mode === "list" ? renderList() : renderForm()}
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
