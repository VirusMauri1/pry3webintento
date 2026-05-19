import { useState } from "react";
import { useStorage } from "../context/StorageContext";
import { crearItem } from "../utils/itemFactory";
import { CATEGORIAS, ESTADOS } from "../utils/categorias";

const RAREZAS = ["común", "poco común", "rara", "épica", "legendaria"];

export function FormularioItem({ onGuardado, itemEditar = null, onCancelar }) {
  const { agregarItem, editarItem } = useStorage();

  const [form, setForm] = useState({
    nombre: itemEditar?.nombre || "",
    categoriaId: itemEditar?.categoriaId || "grupo-a",
    estado: itemEditar?.estado || "faltante",
    puntuacion: itemEditar?.puntuacion ?? "",
    notas: itemEditar?.notas || "",
    numero: itemEditar?.atributos?.numero || "",
    seccion: itemEditar?.atributos?.seccion || "",
    rareza: itemEditar?.atributos?.rareza || "común",
    repetida: itemEditar?.atributos?.repetida || false,
    pegada: itemEditar?.atributos?.pegada || false
  });

  const [error, setError] = useState("");

  const set = (campo) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError("");

    const atributos = {
      numero: form.numero,
      seccion: form.seccion,
      repetida: form.repetida,
      pegada: form.pegada,
      rareza: form.rareza
    };

    if (itemEditar) {
      editarItem({
        ...itemEditar,
        nombre: form.nombre.trim(),
        categoriaId: form.categoriaId,
        estado: form.estado,
        puntuacion: form.puntuacion !== "" ? Number(form.puntuacion) : null,
        notas: form.notas,
        atributos
      });
    } else {
      const nuevoItem = crearItem({
        nombre: form.nombre.trim(),
        categoriaId: form.categoriaId,
        estado: form.estado,
        puntuacion: form.puntuacion !== "" ? Number(form.puntuacion) : null,
        notas: form.notas,
        atributos
      });
      agregarItem(nuevoItem);
    }

    if (onGuardado) onGuardado();
    if (!itemEditar) {
      setForm({
        nombre: "", categoriaId: "grupo-a", estado: "faltante",
        puntuacion: "", notas: "", numero: "", seccion: "",
        rareza: "común", repetida: false, pegada: false
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{
        fontSize: 20,
        fontWeight: 800,
        color: "var(--cyan)",
        fontFamily: "var(--font-display)"
      }}>
        {itemEditar ? "✏️ Editar Estampa" : "➕ Nueva Estampa"}
      </h2>

      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)",
          border: "1px solid var(--danger)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          color: "var(--danger)",
          fontSize: 14
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Nombre de la estampa *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={set("nombre")}
            placeholder="Ej: Messi 10, Pikachu holo, Jordan rookie..."
          />
        </div>

        <div>
          <label style={labelStyle}>Categoría / Sección</label>
          <select value={form.categoriaId} onChange={set("categoriaId")}>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Estado</label>
          <select value={form.estado} onChange={set("estado")}>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>{e.emoji} {e.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Número de estampa</label>
          <input
            type="text"
            value={form.numero}
            onChange={set("numero")}
            placeholder="Ej: 234"
          />
        </div>

        <div>
          <label style={labelStyle}>Rareza</label>
          <select value={form.rareza} onChange={set("rareza")}>
            {RAREZAS.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Puntuación (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={form.puntuacion}
            onChange={set("puntuacion")}
            placeholder="Opcional"
          />
        </div>

        <div>
          <label style={labelStyle}>Sección del álbum</label>
          <input
            type="text"
            value={form.seccion}
            onChange={set("seccion")}
            placeholder="Ej: Portadas, Grupos, etc."
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Notas adicionales</label>
          <textarea
            value={form.notas}
            onChange={set("notas")}
            placeholder="Condición, observaciones..."
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Checkboxes */}
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={form.pegada}
              onChange={set("pegada")}
              style={{ width: "auto", accentColor: "var(--success)" }}
            />
            <span>✅ Pegada en el álbum</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={form.repetida}
              onChange={set("repetida")}
              style={{ width: "auto", accentColor: "var(--warning)" }}
            />
            <span>🔁 Repetida (para cambio)</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          style={{
            background: "var(--cyan)",
            color: "#181925",
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 0 16px rgba(192,245,250,0.2)"
          }}
        >
          {itemEditar ? "Guardar cambios" : "Agregar estampa"}
        </button>
      </div>
    </form>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--text-secondary)",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em"
};
