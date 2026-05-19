import { useStorage } from "../context/StorageContext";
import { ItemCard } from "./ItemCard";
import { CATEGORIAS, ESTADOS } from "../utils/categorias";

export function ListaItems({ onEditar }) {
  const { itemsFiltrados, itemsArchivados, filtros, setFiltros, restaurarItem, eliminarItem } = useStorage();
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const limpiarFiltros = () => setFiltros({ categoriaId: "", estado: "", busqueda: "" });

  const hayFiltros = filtros.categoriaId || filtros.estado || filtros.busqueda;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Filtros */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 20,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "flex-end"
      }}>
        <div style={{ flex: "1 1 200px", minWidth: 160 }}>
          <label style={labelStyle}>🔍 Buscar</label>
          <input
            type="text"
            value={filtros.busqueda}
            onChange={(e) => setFiltros((f) => ({ ...f, busqueda: e.target.value }))}
            placeholder="Nombre o notas..."
          />
        </div>

        <div style={{ flex: "1 1 140px", minWidth: 120 }}>
          <label style={labelStyle}>📂 Categoría</label>
          <select
            value={filtros.categoriaId}
            onChange={(e) => setFiltros((f) => ({ ...f, categoriaId: e.target.value }))}
          >
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1 1 120px", minWidth: 110 }}>
          <label style={labelStyle}>🏷️ Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros((f) => ({ ...f, estado: e.target.value }))}
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>{e.emoji} {e.nombre}</option>
            ))}
          </select>
        </div>

        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            style={{
              background: "rgba(248,113,113,0.1)",
              color: "var(--danger)",
              border: "1px solid rgba(248,113,113,0.3)",
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              alignSelf: "flex-end"
            }}
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Contador */}
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Mostrando <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{itemsFiltrados.length}</span> estampas
        {hayFiltros && " (filtradas)"}
      </div>

      {/* Grid de tarjetas */}
      {itemsFiltrados.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "var(--text-muted)"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>
            {hayFiltros ? "No hay estampas con esos filtros" : "Aún no hay estampas"}
          </p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            {hayFiltros ? "Prueba otros filtros" : "¡Agrega tu primera estampa!"}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16
        }}>
          {itemsFiltrados.map((item) => (
            <ItemCard key={item.id} item={item} onEditar={onEditar} />
          ))}
        </div>
      )}

      {/* Archivados */}
      {itemsArchivados.length > 0 && (
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 20
        }}>
          <button
            onClick={() => setMostrarArchivados(!mostrarArchivados)}
            style={{
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              padding: "8px 16px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            📦 Archivadas ({itemsArchivados.length}) {mostrarArchivados ? "▲" : "▼"}
          </button>

          {mostrarArchivados && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
              marginTop: 16,
              opacity: 0.6
            }}>
              {itemsArchivados.map((item) => (
                <div key={item.id} style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    📦 {item.nombre}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => restaurarItem(item.id)}
                      style={{
                        background: "rgba(74,222,128,0.1)",
                        color: "var(--success)",
                        border: "1px solid rgba(74,222,128,0.3)",
                        padding: "4px 10px",
                        fontSize: 11
                      }}
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => eliminarItem(item.id)}
                      style={{
                        background: "rgba(248,113,113,0.1)",
                        color: "var(--danger)",
                        border: "1px solid rgba(248,113,113,0.3)",
                        padding: "4px 10px",
                        fontSize: 11
                      }}
                    >
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

import { useState } from "react";

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--text-muted)",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em"
};
