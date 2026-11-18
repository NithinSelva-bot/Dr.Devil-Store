import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const PRODUCTS_PATH = path.resolve("src/data/products.json");

// ── Tiny local API plugin ─────────────────────────────────────────────────────
// Handles two endpoints completely offline, no server needed:
//   POST /api/save-product       → upserts a product into products.json
//   DELETE /api/delete-product/:id → removes a product from products.json
function adminApiPlugin() {
  return {
    name: "admin-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ── Helper: read body ──────────────────────────────────────────────
        const readBody = () =>
          new Promise((resolve, reject) => {
            let data = "";
            req.on("data", (chunk) => (data += chunk));
            req.on("end", () => {
              try { resolve(JSON.parse(data)); }
              catch (e) { reject(e); }
            });
          });

        const json = (status, payload) => {
          res.writeHead(status, { "Content-Type": "application/json" });
          res.end(JSON.stringify(payload));
        };

        // ── POST /api/save-product ─────────────────────────────────────────
        if (req.method === "POST" && req.url === "/api/save-product") {
          try {
            const product = await readBody();
            const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8"));

            const idx = products.findIndex((p) => p.id === product.id);
            if (idx >= 0) {
              products[idx] = product; // update existing
            } else {
              const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
              product.id = maxId + 1;
              products.push(product);
            }

            fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
            return json(200, { ok: true, product });
          } catch (err) {
            return json(500, { ok: false, error: err.message });
          }
        }

        // ── DELETE /api/delete-product/:id ─────────────────────────────────
        const delMatch = req.url?.match(/^\/api\/delete-product\/(\d+)$/);
        if (req.method === "DELETE" && delMatch) {
          try {
            const id = parseInt(delMatch[1], 10);
            let products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8"));
            products = products.filter((p) => p.id !== id);
            fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
            return json(200, { ok: true });
          } catch (err) {
            return json(500, { ok: false, error: err.message });
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminApiPlugin()],
});
