// src/components/ProductList.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders:
//   1. Category filter buttons  (auto-generated from products.json)
//   2. Products grid            (uses ProductCard)
//   3. Product detail page      (shown when a card is clicked)
//
// To add a new product: edit src/data/products.json — nothing else needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import ProductCard from "./ProductCard";
import PRODUCTS from "../data/products.json";

const BADGE_COLORS = { NEW: "#7fff00", HOT: "#ff003c" };
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Detail page ────────────────────────────────────────────────────────────
function ProductDetail({ product, onBack }) {
  const [added, setAdded] = useState(false);
  const { id, name, price, oldPrice, details, description, image, category, badge, rating, stock, specs = [] } = product;
  const isLow = stock <= 5;
  const badgeColor = BADGE_COLORS[badge] || "var(--accent)";
  const related = PRODUCTS.filter(p => p.id !== id && p.category === category).slice(0, 3);

  const imgContent = image && (image.startsWith("http") || image.startsWith("/") || image.includes("."))
    ? <img src={image} alt={name} style={{ maxHeight: 260, maxWidth: "100%", objectFit: "contain" }} />
    : <span style={{ fontSize: 120 }}>{image || "📦"}</span>;

  return (
    <div style={{ position: "relative", zIndex: 2, padding: "60px", maxWidth: 1100, margin: "0 auto", animation: "fadeUp .4s ease both" }}>

      {/* Breadcrumb */}
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--dim)", letterSpacing: 2, marginBottom: 40 }}>
        <span style={{ color: "var(--accent)", cursor: "none" }} onClick={onBack}>HOME</span>
        {" / "}
        <span style={{ cursor: "none" }} onClick={onBack}>PRODUCTS</span>
        {" / "}
        <span style={{ color: "#fff" }}>{name.toUpperCase()}</span>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>

        {/* Left: image */}
        <div>
          <div style={{
            background: "linear-gradient(135deg, var(--bg3), var(--bg2))",
            border: "1px solid var(--border)", borderRadius: 2,
            height: 380, display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {imgContent}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, var(--glow) 0%, transparent 70%)" }} />
          </div>

          {/* Tag row */}
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--accent)", border: "1px solid var(--accent)", padding: "4px 12px", letterSpacing: 2 }}>
              // {category}
            </span>
            {badge && (
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#000", background: badgeColor, padding: "4px 12px", letterSpacing: 2 }}>
                {badge}
              </span>
            )}
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--accent3)", border: "1px solid var(--accent3)", padding: "4px 12px" }}>
              ★ {rating}
            </span>
          </div>
        </div>

        {/* Right: info */}
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--dim)", letterSpacing: 3, marginBottom: 8 }}>
            PRODUCT ID: #{String(id).padStart(4, "0")}
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
            {name}
          </h1>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, color: "var(--dim)", lineHeight: 1.7, marginBottom: 28 }}>
            {details || description}
          </p>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 32, color: "var(--accent)", fontWeight: 700 }}>
              {fmt(price)}
            </span>
            {oldPrice && (
              <>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: "var(--dim)", textDecoration: "line-through" }}>
                  {fmt(oldPrice)}
                </span>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "var(--accent3)", background: "rgba(127,255,0,.1)", border: "1px solid var(--accent3)", padding: "2px 8px" }}>
                  SAVE {fmt(oldPrice - price)}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: isLow ? "var(--accent2)" : "var(--accent3)", letterSpacing: 1, marginBottom: 28 }}>
            {isLow ? `⚠ LOW STOCK — ONLY ${stock} UNITS LEFT` : `● IN STOCK — ${stock > 99 ? "100+" : stock} UNITS AVAILABLE`}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
            <button
              onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
              style={{
                flex: 1, fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: 2, fontWeight: 700,
                background: added ? "var(--accent3)" : "var(--accent)", color: "var(--bg)",
                border: "none", padding: "14px 24px", cursor: "none", transition: "all .3s",
                boxShadow: added ? "0 0 30px rgba(127,255,0,.5)" : "0 0 20px var(--glow)",
              }}
            >
              {added ? "✓ ADDED TO CART" : "ADD TO CART"}
            </button>
            <button
              style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: 2,
                background: "transparent", color: "var(--accent2)", border: "1px solid var(--accent2)",
                padding: "14px 24px", cursor: "none", transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent2)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent2)"; }}
            >
              ♡ WISHLIST
            </button>
          </div>

          {/* Specs */}
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--accent)", letterSpacing: 3, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
              // SPECIFICATIONS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {specs.map((spec, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--dim)" }}>
                  <span style={{ color: "var(--accent)", marginTop: 1 }}>›</span> {spec}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: 4, marginBottom: 24 }}>
            // RELATED.PRODUCTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 20 }}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} onView={() => window.scrollTo(0, 0)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ProductList ────────────────────────────────────────────────────────
export default function ProductList({ onProductSelect, selectedProduct, onBack }) {
  const [filter, setFilter] = useState("ALL");

  // Auto-generate category list from products.json
  const categories = ["ALL", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const filtered = filter === "ALL" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  // If a product is selected, show detail page
  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={onBack} />;
  }

  return (
    <section id="products" style={{ position: "relative", zIndex: 2, padding: "80px 60px" }}>

      {/* Section header */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: 4, display: "block", marginBottom: 12 }}>
          // FEATURED.PRODUCTS
        </span>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px,3vw,42px)", fontWeight: 900, letterSpacing: 2 }}>
          TOP <span style={{ color: "var(--accent)" }}>HARDWARE</span>
        </h2>
        <div style={{ width: 60, height: 1, background: "var(--accent)", margin: "16px auto 32px", boxShadow: "0 0 12px var(--accent)" }} />

        {/* Category filters — auto-generated from products.json */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 2,
                cursor: "none", transition: "all .2s",
                background: filter === cat ? "var(--accent)" : "transparent",
                color: filter === cat ? "var(--bg)" : "var(--dim)",
                border: `1px solid ${filter === cat ? "var(--accent)" : "var(--border)"}`,
                padding: "6px 14px",
              }}
              onMouseEnter={e => { if (filter !== cat) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; } }}
              onMouseLeave={e => { if (filter !== cat) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--dim)"; } }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onView={onProductSelect} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "var(--dim)", letterSpacing: 2 }}>
          NO PRODUCTS IN THIS CATEGORY YET
        </div>
      )}
    </section>
  );
}
