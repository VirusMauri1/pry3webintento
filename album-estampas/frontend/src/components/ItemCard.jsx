import { useState, memo } from "react";
import { useStorage } from "../context/StorageContext";
import { getCategoriaById, getEstadoById } from "../utils/categorias";

const rarezaColor = {
  "común": "#8b90b0", "poco común": "#4ade80",
  "rara": "#60a5fa", "épica": "#a78bfa", "legendaria": "#facc15",
};

function ItemCardBase({ item, onEditar }) {
  const { cambiarEstado, archivarItem } = useStorage();

  const cat    = getCategoriaById(item.categoriaId);
  const estado = getEstadoById(item.estado);
  const rareza = item.atributos?.rareza || "común";
  const rColor = rarezaColor[rareza] || "#8b90b0";

  return (
    <div style={{
      background: "#232638", border: "1px solid rgba(192,245,250,0.1)",
      borderRadius: 12, padding: 18, display: "flex", flexDirection: "column",
      gap: 10, position: "relative", overflow: "hidden",
    }}>
      {/* top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: cat.color }} />

      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>{cat.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>{item.nombre}</span>
          </div>
          <div style={{ fontSize: 11, color: "#555a7a", marginTop: 2 }}>
            {cat.nombre}{item.atributos?.numero ? ` · #${item.atributos.numero}` : ""}
          </div>
        </div>
        <span style={{
          background: `${estado.color}20`, color: estado.color,
          border: `1px solid ${estado.color}40`,
          padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>
          {estado.emoji} {estado.nombre}
        </span>
      </div>

      {/* tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: rColor, background: `${rColor}15`,
          border: `1px solid ${rColor}30`, padding: "2px 7px", borderRadius: 10 }}>
          ✦ {rareza}
        </span>
        {item.atributos?.pegada   && <span style={badge("#4ade80")}>✅ pegada</span>}
        {item.atributos?.repetida && <span style={badge("#facc15")}>🔁 repetida</span>}
        {item.atributos?.seccion  && <span style={badge("#60a5fa")}>📂 {item.atributos.seccion}</span>}
      </div>

      {item.notas && (
        <p style={{ fontSize: 12, color: "#8b90b0", fontStyle: "italic", margin: 0 }}>"{item.notas}"</p>
      )}

      {/* acciones */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: "auto" }}>
        <button onClick={() => cambiarEstado(item.id, item.estado === "pegada" ? "faltante" : "pegada")}
          style={{ ...btn, color: "#4ade80", borderColor: "rgba(74,222,128,0.3)",
            background: item.estado === "pegada" ? "rgba(74,222,128,0.15)" : "transparent" }}>
          {item.estado === "pegada" ? "↩️ Quitar" : "✅ Pegar"}
        </button>
        <button onClick={() => cambiarEstado(item.id, item.estado === "repetida" ? "faltante" : "repetida")}
          style={{ ...btn, color: "#facc15", borderColor: "rgba(250,204,21,0.3)",
            background: item.estado === "repetida" ? "rgba(250,204,21,0.15)" : "transparent" }}>
          Repetida
        </button>
        <button onClick={() => onEditar(item)}
          style={{ ...btn, color: "#8b90b0", borderColor: "rgba(192,245,250,0.1)", marginLeft: "auto" }}>
          Editar
        </button>
        <button onClick={() => archivarItem(item.id)}
          style={{ ...btn, color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
          Archivar
        </button>
      </div>
    </div>
  );
}

const btn = { background: "transparent", padding: "4px 9px", fontSize: 11, fontWeight: 600, border: "1px solid" };

function badge(color) {
  return { fontSize: 11, color, background: `${color}15`, border: `1px solid ${color}30`, padding: "2px 7px", borderRadius: 10 };
}

export const ItemCard = memo(ItemCardBase);
export default ItemCard;
