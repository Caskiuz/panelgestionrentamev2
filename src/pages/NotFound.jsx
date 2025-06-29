import React from "react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8fafc" }}>
      <h1 style={{ fontSize: "4rem", color: "#334155", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", color: "#64748b", marginBottom: "2rem" }}>
        Página no encontrada
      </p>
      <a href="/" style={{ color: "#2563eb", textDecoration: "underline", fontSize: "1.1rem" }}>
        Volver al inicio
      </a>
    </div>
  );
}
