import { useState, useEffect, useRef } from "react";
import { StorageProvider, useStorage } from "./context/StorageContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { FormularioItem } from "./components/FormularioItem";
import { ListaItems } from "./components/ListaItems";
import { ModalEditar } from "./components/ModalEditar";

const NAV_ITEMS = [
  { id: "estampas", label: "Mis Estampas" },
  { id: "agregar",  label: "Agregar" },
];

function Navbar({ vista, setVista, nombreInputRef }) {
  const { items, modo, setModo, obtenerItems } = useStorage();
  const { tema, toggleTema } = useTheme();

  const total   = items.filter((i) => i.activo).length;
  const pegadas = items.filter((i) => i.activo && i.estado === "pegada").length;
  const pct     = total > 0 ? Math.round((pegadas / total) * 100) : 0;

  const handleModo = () => {
    const nuevoModo = modo === "local" ? "api" : "local";
    setModo(nuevoModo);
    // obtenerItems se dispara automáticamente en StorageContext al cambiar modo
  };

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

        {/* Tabs de navegación */}
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

        {/* Controles de la derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Switch modo */}
          <button
            onClick={handleModo}
            title={`Modo actual: ${modo}. Click para cambiar.`}
            style={{
              background: modo === "api" ? "rgba(96,165,250,0.15)" : "var(--color-accent-dim)",
              color: modo === "api" ? "var(--color-info)" : "var(--color-accent)",
              border: `1px solid ${modo === "api" ? "rgba(96,165,250,0.4)" : "var(--color-accent-border)"}`,
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>
            {modo === "api" ? "🌐 API" : "💾 Local"}
          </button>

          {/* Toggle tema */}
          <button
            onClick={toggleTema}
            title={`Tema ${tema === "oscuro" ? "claro" : "oscuro"} (atajo: T)`}
            style={{
              background: "var(--color-accent-dim)",
              color: "var(--color-accent)",
              border: "1px solid var(--color-accent-border)",
              padding: "5px 10px", borderRadius: 20, fontSize: 14, cursor: "pointer",
            }}>
            {tema === "oscuro" ? "☀️" : "🌙"}
          </button>

          {/* Barra de progreso */}
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

  // Ref para poder enfocar el input nombre desde el atajo Ctrl+N
  const nombreInputRef = useRef(null);

  // ── Atajos de teclado ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // T → toggle tema (solo si no estamos escribiendo en un input/textarea/select)
      if (
        e.key === "t" || e.key === "T"
      ) {
        const tag = document.activeElement?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
          toggleTema();
        }
      }

      // Ctrl+N → navegar a "agregar" y enfocar el campo nombre
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setVista("agregar");
        // Pequeño timeout para que el componente monte antes de enfocar
        setTimeout(() => {
          if (nombreInputRef.current) {
            nombreInputRef.current.focus();
          }
        }, 50);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleTema]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar vista={vista} setVista={setVista} nombreInputRef={nombreInputRef} />

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
        ) : (
          <ListaItems onEditar={setItemEditando} />
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