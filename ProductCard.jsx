// src/components/ProductCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Single product card shown in the grid AND on the related-products row.
// Props:
//   product  — full product object from products.json
//   onView   — called with the product object when "VIEW DETAILS" is clicked
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

const BADGE_COLORS = { NEW: "#7fff00", HOT: "#ff003c" };
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function ProductCard({ product, onView }) {
  const [hovered, setHovered] = useState(false);
  const { name, price, oldPrice, description, image, category, badge, rating, stock } = product;
  const isLow = stock <= 5;
  const badgeColor = BADGE_COLORS[badge] || "var(--accent)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 2, position: "relative", overflow: "hidden",
        cursor: "none", transition: "border-color .3s, box-shadow .3s, transform .3s",
        boxShadow: hovered ? "0 0 30px var(--glow), 0 8px 40px rgba(0,0,0,.5)" : "none",
        transform: hovered ? "translateY(-4px)" : "none",
        animation: "fadeUp .5s ease both",
      }}
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: badgeColor, color: "#000",
          fontFamily: "'Orbitron', sans-serif", fontSize: 9, fontWeight: 700,
          padding: "4px 8px", letterSpacing: 1, zIndex: 2,
        }}>
          {badge}
        </div>
      )}

      {/* Image area */}
      <div style={{
        height: 140, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 56, background: "linear-gradient(135deg, var(--bg3), var(--bg2))",
        borderBottom: "1px solid var(--border)", position: "relative",
      }}>
        {/* Support both emoji and image URLs */}
        {image && (image.startsWith("http") || image.startsWith("/") || image.includes("."))
          ? <img src={image} alt={name} style={{ height: "100%", width: "100%", objectFit: "contain", padding: 16 }} />
          : <span>{image || "📦"}</span>
        }
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, var(--glow) 0%, transparent 70%)" }} />
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--accent)", letterSpacing: 2, marginBottom: 6 }}>
          // {category}
        </div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
          {name}
        </div>
        <div style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.5, marginBottom: 14 }}>
          {description}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, color: "var(--accent)", fontWeight: 700 }}>
              {fmt(price)}
            </span>
            {oldPrice && (
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--dim)", textDecoration: "line-through", marginLeft: 8 }}>
                {fmt(oldPrice)}
              </span>
            )}
          </div>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--accent3)" }}>
            ★ {rating}
          </span>
        </div>

        {/* Stock */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 9,
          color: isLow ? "var(--accent2)" : "var(--accent3)",
          letterSpacing: 1, marginBottom: 14,
        }}>
          {isLow ? `⚠ LOW STOCK — ${stock} UNITS` : `● IN STOCK — ${stock > 99 ? "100+" : stock} UNITS`}
        </div>

        {/* CTA */}
        <button
          onClick={() => onView(product)}
          style={{
            width: "100%",
            fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: 2, fontWeight: 700,
            background: hovered ? "var(--accent)" : "transparent",
            color: hovered ? "var(--bg)" : "var(--accent)",
            border: "1px solid var(--accent)", padding: "10px",
            cursor: "none", transition: "all .2s",
            boxShadow: hovered ? "0 0 20px var(--glow)" : "none",
          }}
        >
          VIEW DETAILS ⟶
        </button>
      </div>
    </div>
  );
}
