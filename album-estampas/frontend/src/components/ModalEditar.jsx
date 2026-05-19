import { useEffect } from "react";
import { FormularioItem } from "./FormularioItem";

export function ModalEditar({ item, onCerrar }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCerrar(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCerrar]);

  if (!item) return null;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div style={{
        background: "#232638", border: "1px solid rgba(192,245,250,0.25)",
        borderRadius: 12, padding: 28, width: "100%", maxWidth: 580,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <FormularioItem itemEditar={item} onGuardado={onCerrar} onCancelar={onCerrar} />
      </div>
    </div>
  );
}
