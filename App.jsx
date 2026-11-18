// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root of the DR.DEVIL store.
// Manages:
//   - Custom cursor
//   - Page state: "store" (home) ↔ "detail" (product page)
//   - Imports all components
//
// ════════════════════════════════════════════════════════════════════════════
// 👉 TO ADD A NEW PRODUCT:
//    Open  src/data/products.json
//    Paste a new object like this:
//    {
//      "id": 9,                        ← unique number
//      "name": "Product Name",
//      "price": 1999,                  ← number in ₹
//      "oldPrice": 2499,               ← or null
//      "description": "Short card description (max ~80 chars)",
//      "details": "Longer paragraph for the product detail page",
//      "image": "🔧",                  ← emoji or image URL
//      "category": "DEV BOARD",        ← see existing values for options
//      "badge": "NEW",                 ← "NEW" | "HOT" | "-30%" | null
//      "rating": 4.8,
//      "stock": 25,
//      "specs": ["Spec 1", "Spec 2", "Spec 3"]
//    }
//    Save the file → Vite hot-reloads and the product appears instantly.
// ════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import "./App.css";

import Navbar      from "./components/Navbar";
import Hero        from "./components/Hero";
import ProductList from "./components/ProductList";
import Footer      from "./components/Footer";
import AdminPanel  from "./components/AdminPanel";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState("store"); // "store" | "admin"

  // ── Custom cursor ────────────────────────────────────────────────────────
  const cursorRef = useRef(null);
  const dotRef    = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
      if (dotRef.current)    { dotRef.current.style.left    = e.clientX + "px"; dotRef.current.style.top    = e.clientY + "px"; }
    };
    const onOver = (e) => {
      const interactive = e.target.closest("a, button, [role='button']");
      if (cursorRef.current) cursorRef.current.classList.toggle("hovered", !!interactive);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); };
  }, []);

  // ── Navigation helpers ───────────────────────────────────────────────────
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedProduct(null);
    // Small delay so the store re-mounts before scrolling
    setTimeout(() => {
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Custom cursor */}
      <div className="cursor"     ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef}    />

      {/* Admin panel — full override */}
      {page === "admin" && (
        <AdminPanel onBack={() => { setPage("store"); setSelectedProduct(null); }} />
      )}

      {/* Store */}
      {page === "store" && (
        <>
          {/* Nav — shows ← BACK on detail page */}
          <Navbar
            onHome={handleBack}
            showBack={!!selectedProduct}
            onAdmin={() => setPage("admin")}
          />

          {/* Store home — Hero + ProductList */}
          {!selectedProduct && (
            <>
              <Hero />
              <ProductList onProductSelect={handleViewProduct} />
            </>
          )}

          {/* Product detail page */}
          {selectedProduct && (
            <ProductList
              selectedProduct={selectedProduct}
              onProductSelect={handleViewProduct}
              onBack={handleBack}
            />
          )}

          <Footer />
        </>
      )}
    </>
  );
}
