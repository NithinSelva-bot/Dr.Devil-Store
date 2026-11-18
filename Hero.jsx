// src/components/Hero.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-screen hero section shown on the store home page.
// No props needed — purely presentational.
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        position: "relative", minHeight: "88vh",
        display: "flex", alignItems: "center",
        padding: "80px 60px", overflow: "hidden", zIndex: 2,
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            "radial-gradient(ellipse 60% 60% at 70% 50%, #00f5ff0d 0%, transparent 70%)," +
            "radial-gradient(ellipse 40% 40% at 20% 80%, #ff003c08 0%, transparent 60%)",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, animation: "fadeUp .6s ease both" }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: "1px solid var(--accent3)", background: "rgba(127,255,0,.05)",
            padding: "6px 14px",
            fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
            color: "var(--accent3)", letterSpacing: 2,
            marginBottom: 28, animation: "pulse-border 2s ease-in-out infinite",
          }}>
            <span style={{ animation: "blink 1s step-end infinite" }}>●</span>
            LIVE // NEW ARRIVALS ONLINE
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(38px, 5vw, 68px)",
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: -1, marginBottom: 24,
          }}>
            <span style={{ color: "#fff", display: "block" }}>NEXT-GEN</span>
            <span style={{ color: "var(--accent)", display: "block", animation: "glowPulse 3s ease-in-out infinite" }}>CYBER</span>
            <span style={{ color: "var(--accent2)", display: "block" }}>HARDWARE</span>
          </h1>

          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 18, color: "var(--dim)", lineHeight: 1.6, marginBottom: 36, maxWidth: 480 }}>
            Professional-grade IoT components, pentesting tools, and dev boards.
            DR.DEVIL equips makers, hackers & engineers.
          </p>

          <a
            href="#products"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "'Orbitron', sans-serif", fontSize: 12, letterSpacing: 2,
              background: "var(--accent)", color: "var(--bg)",
              padding: "14px 32px", textDecoration: "none", fontWeight: 700,
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent2)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(255,0,60,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            BROWSE PRODUCTS ⟶
          </a>
        </div>

        {/* Side stats */}
        <div style={{
          position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)",
          fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
          color: "var(--glow)", lineHeight: 2, textAlign: "right", opacity: .6,
        }}>
          {["SYSTEM: ONLINE", "STOCK: LIVE", "ENCRYPTED: TRUE", "BUILD: 2025.05"].map(t => (
            <div key={t}>{t}</div>
          ))}
        </div>
      </section>

      {/* ── Ticker ── */}
      <div style={{
        borderTop: "1px solid var(--glow)", borderBottom: "1px solid var(--glow)",
        background: "var(--bg2)", padding: "10px 0",
        overflow: "hidden", position: "relative", zIndex: 2,
      }}>
        <div style={{ display: "flex", animation: "ticker 30s linear infinite", whiteSpace: "nowrap" }}>
          {[0, 1].map(i => (
            <span key={i} style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
              color: "var(--accent3)", letterSpacing: 2, padding: "0 40px",
            }}>
              ⚡ ESP32 WROOM — IN STOCK &nbsp;//&nbsp; ◈ ARDUINO UNO R4 WIFI — NEW ARRIVAL &nbsp;//&nbsp; ⚡ RASPBERRY PI 5 — LIMITED UNITS &nbsp;//&nbsp; ◈ CYBERSECURITY TOOLS — PROFESSIONAL GRADE &nbsp;//&nbsp; ⚡ IoT STARTER KITS — 30% OFF THIS WEEK &nbsp;//&nbsp;
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
