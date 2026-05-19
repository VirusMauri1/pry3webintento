import { useState } from "react";
import { useStorage } from "../context/StorageContext";

export function Navbar({ vistaActual, setVista }) {
  const { items } = useStorage();
  const { porcentaje, pegadas, total } = useProgresoAlbum(items);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", emoji: "📊" },
    { id: "estampas", label: "Mis Estampas", emoji: "📒" },
    { id: "agregar", label: "Agregar", emoji: "➕" },
    { id: "estadisticas", label: "Estadísticas", emoji: "📈" }
  ];

  return (
    <nav style={{
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 20px rgba(0,0,0,0.3)"
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>📒</span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 16,
              color: "var(--cyan)",
              lineHeight: 1
            }}>
              Álbum de Estampas
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {pegadas}/{total} pegadas · {porcentaje}%
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setVista(item.id)}
              style={{
                background: vistaActual === item.id ? "var(--cyan-muted)" : "transparent",
                color: vistaActual === item.id ? "var(--cyan)" : "var(--text-secondary)",
                border: vistaActual === item.id ? "1px solid var(--border-strong)" : "1px solid transparent",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "var(--font-display)"
              }}
              onMouseEnter={(e) => {
                if (vistaActual !== item.id) {
                  e.target.style.color = "var(--text-primary)";
                  e.target.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (vistaActual !== item.id) {
                  e.target.style.color = "var(--text-secondary)";
                  e.target.style.background = "transparent";
                }
              }}
            >
              <span style={{ marginRight: 6 }}>{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Progress bar mini */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bg-card)",
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid var(--border)"
        }}>
          <div style={{
            width: 80,
            height: 6,
            background: "var(--bg-primary)",
            borderRadius: 3,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${porcentaje}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--cyan-dim), var(--cyan))",
              borderRadius: 3,
              transition: "width 0.5s ease"
            }} />
          </div>
          <span style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--cyan)",
            fontWeight: 700
          }}>
            {porcentaje}%
          </span>
        </div>
      </div>
    </nav>
  );
}
