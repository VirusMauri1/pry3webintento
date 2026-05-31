import { useState, useEffect, useRef } from "react";
import { StorageProvider, useStorage } from "./context/StorageContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { FormularioItem } from "./components/FormularioItem";
import { ListaItems } from "./components/ListaItems";
import { Graficas } from "./components/Graficas";
import { ModalEditar } from "./components/ModalEditar";

const NAV_ITEMS = [
  { id: "estampas", label: "Mis Estampas" },
  { id: "graficas", label: "Gráficas" },
  { id: "agregar",  label: "Agregar" },
];

function Navbar({ vista, setVista }) {
  const { items, modo, setModo } = useStorage();
  const { tema, toggleTema } = useTheme();

  const total   = items.filter((i) => i.activo).length;
  const pegadas = items.filter((i) => i.activo && i.estado === "pegada").length;
  const pct     = total > 0 ? Math.round((pegadas / total) * 100) : 0;

  return (
    <nav style={{
      background: "var(--color-bg-surface)",
      borderBottom: "1px solid var(--color-border)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>

        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map((n) => (
            <button key={n.id} onClick={() => setVista(n.id)}
              style={{
                background: vista === n.id ? "var(--color-accent-dim)" : "transparent",
                color: vista === n.id ? "var(--color-accent)" : "var(--color-text-muted)",
                border: vista === n.id ? "1px solid var(--color-accent-border)" : "1px solid transparent",
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setModo(modo === "local" ? "api" : "local")}
            title={`Modo actual: ${modo}. Click para cambiar.`}
            style={{
              background: modo === "api" ? "rgba(96,165,250,0.15)" : "var(--color-accent-dim)",
              color: modo === "api" ? "var(--color-info)" : "var(--color-accent)",
              border: `1px solid ${modo === "api" ? "rgba(96,165,250,0.4)" : "var(--color-accent-border)"}`,
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>
            {modo === "api" ? "🌐 API" : "💾 Local"}
          </button>

          <button
            onClick={toggleTema}
            style={{
              background: "var(--color-accent-dim)",
              color: "var(--color-accent)",
              border: "1px solid var(--color-accent-border)",
              padding: "5px 10px", borderRadius: 20, fontSize: 14, cursor: "pointer",
            }}>
            {tema === "oscuro" ? "☀️" : "🌙"}
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--color-bg-elevated)", padding: "5px 12px", borderRadius: 20,
            border: "1px solid var(--color-border)",
          }}>
            <div style={{ width: 72, height: 5, background: "var(--color-bg)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "var(--color-accent)", borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--color-accent)", fontWeight: 700, fontFamily: "monospace" }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppInner() {
  const [vista, setVista] = useState("estampas");
  const [itemEditando, setItemEditando] = useState(null);
  const { toggleTema } = useTheme();
  const nombreInputRef = useRef(null);

  const irAgregar = () => {
    setVista("agregar");
    setTimeout(() => {
      if (nombreInputRef.current) nombreInputRef.current.focus();
    }, 50);
  };

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const enInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if ((e.key === "t" || e.key === "T") && !enInput) toggleTema();

      if (e.altKey && (e.key === "n" || e.key === "N")) { // Alt+N y no ctrl + n ya que abre nueva ventana
        e.preventDefault();
        irAgregar();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleTema]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar vista={vista} setVista={setVista} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {vista === "agregar" ? (
          <div style={{
            maxWidth: 620, margin: "0 auto",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12, padding: 28,
          }}>
            <FormularioItem
              onGuardado={() => setVista("estampas")}
              nombreInputRef={nombreInputRef}
            />
          </div>
        ) : vista === "graficas" ? (
          <Graficas />
        ) : (
          <>
            {/* se muestra el hint de atajo */}
            <p style={{
              fontSize: 12,
              color: "var(--color-text-subtle)",
              textAlign: "right",
              marginBottom: 16,
            }}>
              Presiona{" "}
              <kbd style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: 4,
                padding: "1px 6px",
                fontSize: 11,
                fontFamily: "monospace",
                color: "var(--color-text-muted)",
              }}>Alt+N</kbd>
              {" "}para agregar una nueva estampa
            </p>
            <ListaItems onEditar={setItemEditando} />
          </>
        )}
      </main>

      {itemEditando && (
        <ModalEditar item={itemEditando} onCerrar={() => setItemEditando(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StorageProvider>
        <AppInner />
      </StorageProvider>
    </ThemeProvider>
  );
}