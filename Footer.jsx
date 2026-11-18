// src/components/Footer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Site footer — no props needed.
// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  const linkStyle = { fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--dim)", textDecoration: "none" };

  return (
    <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid var(--border)", background: "var(--bg2)", padding: "60px 60px 30px" }}>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 40 }}>

        {/* Brand */}
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: "var(--accent)", textShadow: "0 0 20px var(--accent)", letterSpacing: 3, marginBottom: 16 }}>
            DR.<span style={{ color: "var(--accent2)" }}>DEVIL</span>
          </div>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "var(--dim)", lineHeight: 1.7, maxWidth: 320 }}>
            India's premier destination for cybersecurity hardware and IoT components.
            Equipping makers, hackers & engineers.
          </p>
        </div>

       
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--dim)", letterSpacing: 2 }}>
          © 2025 <span style={{ color: "var(--accent)" }}>DR.DEVIL</span> CYBER ELECTRONICS — ALL SYSTEMS OPERATIONAL
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["SSL SECURED", "MADE IN INDIA"].map(label => (
            <span key={label} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--accent)", border: "1px solid var(--glow)", padding: "4px 10px", letterSpacing: 1 }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
