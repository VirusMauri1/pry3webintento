import { useState } from "react";
import { useStorage } from "../context/StorageContext";
import { ItemCard } from "./ItemCard";
import { FiltrosBar } from "./FiltrosBar";

export function ListaItems({ onEditar }) {
  const { itemsFiltrados, itemsArchivados, filtros, restaurarItem, eliminarItem } = useStorage();
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const hayFiltros =
    (filtros.categoriaId && filtros.categoriaId !== "todas") ||
    (filtros.estado && filtros.estado !== "todos") ||
    filtros.busqueda;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <FiltrosBar />

      <div style={{ fontSize: 13, color: "var(--color-text-subtle)" }}>
        Mostrando <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>{itemsFiltrados.length}</span> estampas
        {hayFiltros && " (filtradas)"}
      </div>

      {/* Grid */}
      {itemsFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--color-text-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>
            {hayFiltros ? "No hay estampas con esos filtros" : "Aún no hay estampas"}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
          {itemsFiltrados.map((item) => <ItemCard key={item.id} item={item} onEditar={onEditar} />)}
        </div>
      )}

      {/* Archivados */}
      {itemsArchivados.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(192,245,250,0.1)", paddingTop: 16 }}>
          <button onClick={() => setMostrarArchivados(!mostrarArchivados)}
            style={{ background: "transparent", color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)", padding: "7px 14px", fontSize: 12 }}>
            Archivadas ({itemsArchivados.length}) {mostrarArchivados ? "▲" : "▼"}
          </button>
          {mostrarArchivados && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, opacity: 0.7 }}>
              {itemsArchivados.map((item) => (
                <div key={item.id} style={{
                  background: "var(--color-bg-surface)", border: "1px solid var(--color-border)",
                  borderRadius: 8, padding: "10px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>📦 {item.nombre}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => restaurarItem(item.id)}
                      style={{ background: "rgba(74,222,128,0.1)", color: "var(--color-success)",
                        border: "1px solid rgba(74,222,128,0.3)", padding: "4px 10px", fontSize: 11 }}>
                      Restaurar
                    </button>
                    <button onClick={() => eliminarItem(item.id)}
                      style={{ background: "rgba(248,113,113,0.1)", color: "var(--color-error)",
                        border: "1px solid rgba(248,113,113,0.3)", padding: "4px 10px", fontSize: 11 }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}