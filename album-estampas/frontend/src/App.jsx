import { useState } from "react";
import { StorageProvider } from "./context/StorageContext";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { FormularioItem } from "./components/FormularioItem";
import { ListaItems } from "./components/ListaItems";
import { Estadisticas } from "./components/Estadisticas";
import { ModalEditar } from "./components/ModalEditar";

function AppInner() {
  const [vista, setVista] = useState("dashboard");
  const [itemEditando, setItemEditando] = useState(null);

  useAtajoTeclado({
    "ctrl+n": () => setVista("agregar"),
    "ctrl+d": () => setVista("dashboard"),
    "ctrl+e": () => setVista("estampas")
  });

  const handleEditar = (item) => {
    setItemEditando(item);
  };

  const renderVista = () => {
    switch (vista) {
      case "dashboard":
        return <Dashboard setVista={setVista} />;
      case "estampas":
        return <ListaItems onEditar={handleEditar} />;
      case "agregar":
        return (
          <div style={{
            maxWidth: 640,
            margin: "0 auto",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: 32
          }}>
            <FormularioItem onGuardado={() => setVista("estampas")} />
          </div>
        );
      case "estadisticas":
        return <Estadisticas />;
      default:
        return <Dashboard setVista={setVista} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar vistaActual={vista} setVista={setVista} />

      <main style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 24px"
      }}>
        {renderVista()}
      </main>

      {itemEditando && (
        <ModalEditar
          item={itemEditando}
          onCerrar={() => setItemEditando(null)}
        />
      )}

      {/* Atajo de teclado hint */}
      <div style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "8px 14px",
        fontSize: 11,
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)"
      }}>
        Ctrl+N nueva · Ctrl+D dashboard · Ctrl+E estampas
      </div>
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
