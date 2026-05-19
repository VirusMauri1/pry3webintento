import { useState } from "react";
import { useStorage } from "../context/StorageContext";
import { getCategoriaById, getEstadoById } from "../utils/categorias";

export function ItemCard({ item, onEditar }) {
  const { cambiarEstado, archivarItem, toggleAtributo, agregarRegistro } = useStorage();
  const [showRegistro, setShowRegistro] = useState(false);
  const [valorRegistro, setValorRegistro] = useState(1);
  const [notasRegistro, setNotasRegistro] = useState("");

  const categoria = getCategoriaById(item.categoriaId);
  const estado = getEstadoById(item.estado);

  const handleRegistro = () => {
    agregarRegistro({ itemId: item.id, valor: valorRegistro, notas: notasRegistro });
    setShowRegistro(false);
    setValorRegistro(1);
    setNotasRegistro("");
  };

  const rareza = item.atributos?.rareza || "común";
  const rarezaColor = {
    "común": "#8b90b0",
    "poco común": "#4ade80",
    "rara": "#60a5fa",
    "épica": "#a78bfa",
    "legendaria": "#facc15"
  }[rareza] || "#8b90b0";

  return (
    <div className="fade-in" style={{
      background: "var(--bg-card)",
      border: `1px solid var(--border)`,
      borderRadius: "var(--radius)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      transition: "all 0.2s",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "var(--border-strong)";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "var(--shadow-cyan)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}>
      {/* Color accent top */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 3,
        background: categoria.color,
        borderRadius: "var(--radius) var(--radius) 0 0"
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18 }}>{categoria.emoji}</span>
            <h3 style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 180
            }}>
              {item.nombre}
            </h3>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {categoria.nombre}
            {item.atributos?.numero && ` · #${item.atributos.numero}`}
          </div>
        </div>

        {/* Estado badge */}
        <span style={{
          background: `${estado.color}20`,
          color: estado.color,
          border: `1px solid ${estado.color}40`,
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: "nowrap"
        }}>
          {estado.emoji} {estado.nombre}
        </span>
      </div>

      {/* Atributos */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 11,
          color: rarezaColor,
          background: `${rarezaColor}15`,
          border: `1px solid ${rarezaColor}30`,
          padding: "2px 8px",
          borderRadius: 10,
          fontFamily: "var(--font-mono)"
        }}>
          ✦ {rareza}
        </span>
        {item.atributos?.pegada && (
          <span style={badgeStyle("#4ade80")}>✅ pegada</span>
        )}
        {item.atributos?.repetida && (
          <span style={badgeStyle("#facc15")}>🔁 repetida</span>
        )}
        {item.atributos?.seccion && (
          <span style={badgeStyle("#60a5fa")}>📂 {item.atributos.seccion}</span>
        )}
      </div>

      {/* Puntuación */}
      {item.puntuacion !== null && item.puntuacion !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Puntuación:</span>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8,
                borderRadius: "50%",
                background: i < item.puntuacion ? "var(--cyan)" : "var(--bg-secondary)"
              }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>
            {item.puntuacion}/10
          </span>
        </div>
      )}

      {item.notas && (
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontStyle: "italic", margin: 0 }}>
          "{item.notas}"
        </p>
      )}

      {/* Registro form */}
      {showRegistro && (
        <div style={{
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-sm)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          border: "1px solid var(--border)"
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              min="1"
              value={valorRegistro}
              onChange={(e) => setValorRegistro(Number(e.target.value))}
              placeholder="Cant."
              style={{ width: 70 }}
            />
            <input
              type="text"
              value={notasRegistro}
              onChange={(e) => setNotasRegistro(e.target.value)}
              placeholder="Notas del día..."
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleRegistro} style={{
              background: "var(--success)",
              color: "#181925",
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              flex: 1
            }}>
              Registrar
            </button>
            <button onClick={() => setShowRegistro(false)} style={{
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              padding: "6px 12px",
              fontSize: 12
            }}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div style={{ display: "flex", gap: 6, marginTop: "auto", flexWrap: "wrap" }}>
        <button
          onClick={() => cambiarEstado(item.id, item.estado === "pegada" ? "faltante" : "pegada")}
          style={{
            background: item.estado === "pegada" ? "rgba(74,222,128,0.15)" : "transparent",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.3)",
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 600
          }}
        >
          {item.estado === "pegada" ? "↩️ Quitar" : "✅ Pegar"}
        </button>
        <button
          onClick={() => cambiarEstado(item.id, item.estado === "repetida" ? "faltante" : "repetida")}
          style={{
            background: item.estado === "repetida" ? "rgba(250,204,21,0.15)" : "transparent",
            color: "#facc15",
            border: "1px solid rgba(250,204,21,0.3)",
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 600
          }}
        >
          🔁 Repetida
        </button>
        <button
          onClick={() => setShowRegistro(!showRegistro)}
          style={{
            background: "transparent",
            color: "var(--purple)",
            border: "1px solid rgba(167,139,250,0.3)",
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 600
          }}
        >
          📝 Actividad
        </button>
        <button
          onClick={() => onEditar(item)}
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            padding: "5px 10px",
            fontSize: 11,
            marginLeft: "auto"
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => archivarItem(item.id)}
          style={{
            background: "transparent",
            color: "var(--danger)",
            border: "1px solid rgba(248,113,113,0.3)",
            padding: "5px 10px",
            fontSize: 11
          }}
        >
          📦
        </button>
      </div>
    </div>
  );
}

function badgeStyle(color) {
  return {
    fontSize: 11,
    color,
    background: `${color}15`,
    border: `1px solid ${color}30`,
    padding: "2px 8px",
    borderRadius: 10
  };
}
