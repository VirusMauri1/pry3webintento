import { useState } from "react";
import { StorageProvider, useStorage } from "./context/StorageContext";
import { FormularioItem } from "./components/FormularioItem";
import { ListaItems } from "./components/ListaItems";
import { ModalEditar } from "./components/ModalEditar";

const NAV_ITEMS = [
  { id: "estampas", label: "Mis Estampas"},
  { id: "agregar",  label: "Agregar"},
];

function Navbar({ vista, setVista }) {
  const { items } = useStorage();
  const total   = items.filter((i) => i.activo).length;
  const pegadas = items.filter((i) => i.activo && i.estado === "pegada").length;
  const pct     = total > 0 ? Math.round((pegadas / total) * 100) : 0;

  return (
    <nav style={{
      background: "#1e2130", borderBottom: "1px solid rgba(192,245,250,0.1)",
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
                background: vista === n.id ? "rgba(192,245,250,0.12)" : "transparent",
                color: vista === n.id ? "#C0F5FA" : "#8b90b0",
                border: vista === n.id ? "1px solid rgba(192,245,250,0.25)" : "1px solid transparent",
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
              {n.emoji} {n.label}
            </button>
          ))}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#232638", padding: "5px 12px", borderRadius: 20,
          border: "1px solid rgba(192,245,250,0.1)",
        }}>
          <div style={{ width: 72, height: 5, background: "#181925", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "#C0F5FA", borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 12, color: "#C0F5FA", fontWeight: 700, fontFamily: "monospace" }}>{pct}%</span>
        </div>
      </div>
    </nav>
  );
}

function AppInner() {
  const [vista, setVista] = useState("estampas");
  const [itemEditando, setItemEditando] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#181925" }}>
      <Navbar vista={vista} setVista={setVista} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {vista === "agregar" ? (
          <div style={{
            maxWidth: 620, margin: "0 auto",
            background: "#232638", border: "1px solid rgba(192,245,250,0.1)",
            borderRadius: 12, padding: 28,
          }}>
            <FormularioItem onGuardado={() => setVista("estampas")} />
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
    <StorageProvider>
      <AppInner />
    </StorageProvider>
  );
}
