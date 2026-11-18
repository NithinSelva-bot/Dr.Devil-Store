// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Top navigation bar.
// Props:
//   onHome    — called when logo or PRODUCTS link is clicked (returns to store)
//   showBack  — if true, shows "← BACK" button instead of nav links (detail page)
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar({ onHome, showBack, onAdmin }) {
  const linkStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--dim)",
    textDecoration: "none",
    letterSpacing: 2,
    transition: "color .2s",
    cursor: "none",
  };

  const backBtnStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11,
    letterSpacing: 2,
    background: "transparent",
    border: "1px solid var(--accent)",
    color: "var(--accent)",
    padding: "8px 20px",
    cursor: "none",
    transition: "all .2s",
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(2,4,8,.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--glow)",
      padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64,
    }}>
      {/* Logo */}
      <div
        onClick={onHome}
        style={{ cursor: "none" }}
      >
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 22, fontWeight: 900,
          color: "var(--accent)",
          textShadow: "0 0 20px var(--accent), 0 0 40px var(--accent)",
          letterSpacing: 3,
        }}>
          DR.<span style={{ color: "var(--accent2)", textShadow: "0 0 20px var(--accent2)" }}>DEVIL</span>
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9, color: "var(--accent3)",
          letterSpacing: 2, display: "block", marginTop: -4,
        }}>
          // CYBER ELECTRONICS DIVISION
        </span>
      </div>

      {/* Right side */}
      {showBack ? (
        <button
          onClick={onHome}
          style={backBtnStyle}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}
        >
          ← BACK
        </button>
      ) : (
        <ul style={{ display: "flex", gap: 32, listStyle: "none", alignItems: "center" }}>
          <li>
            <a
              href="#products"
              style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}
            >
              PRODUCTS
            </a>
          </li>
          <li>
            <button
              onClick={onAdmin}
              style={{
                ...linkStyle,
                background: "transparent",
                border: "1px solid var(--border)",
                padding: "7px 16px",
                color: "var(--dim)",
                transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent2)"; e.currentTarget.style.borderColor = "var(--accent2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              ⬡ ADMIN
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
