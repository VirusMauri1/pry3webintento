import { useState, useRef, useEffect } from "react";
import { useStorage } from "../context/StorageContext";
import { crearItem } from "../utils/itemFactory";
import { CATEGORIAS, ESTADOS } from "../utils/categorias";

const RAREZAS = ["común", "poco común", "rara", "épica", "legendaria"];

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  color: "var(--color-text-muted)", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: "0.06em",
};

export function FormularioItem({ onGuardado, itemEditar = null, onCancelar, nombreInputRef }) {
  const { agregarItem, editarItem } = useStorage();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre:      itemEditar?.nombre              || "",
    categoriaId: itemEditar?.categoriaId         || "grupo-a",
    estado:      itemEditar?.estado              || "faltante",
    puntuacion:  itemEditar?.puntuacion != null  ? String(itemEditar.puntuacion) : "",
    notas:       itemEditar?.notas               || "",
    numero:      itemEditar?.atributos?.numero   || "",
    seccion:     itemEditar?.atributos?.seccion  || "",
    rareza:      itemEditar?.atributos?.rareza   || "común",
    repetida:    itemEditar?.atributos?.repetida || false,
    pegada:      itemEditar?.atributos?.pegada   || false,
  });

  const localInputRef = useRef(null);

  useEffect(() => {
    const ref = nombreInputRef || localInputRef;
    if (ref.current) {
      ref.current.focus();
    }
  }, []); 

  const set = (campo) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setError("");
    const atributos = {
      numero: form.numero, seccion: form.seccion,
      repetida: form.repetida, pegada: form.pegada, rareza: form.rareza,
    };
    if (itemEditar) {
      editarItem({
        ...itemEditar,
        nombre: form.nombre.trim(), categoriaId: form.categoriaId,
        estado: form.estado,
        puntuacion: form.puntuacion !== "" ? Number(form.puntuacion) : null,
        notas: form.notas, atributos,
      });
    } else {
      agregarItem(crearItem({
        nombre: form.nombre.trim(), categoriaId: form.categoriaId,
        estado: form.estado,
        puntuacion: form.puntuacion !== "" ? Number(form.puntuacion) : null,
        notas: form.notas, atributos,
      }));
      setForm({
        nombre: "", categoriaId: "grupo-a", estado: "faltante", puntuacion: "", notas: "",
        numero: "", seccion: "", rareza: "común", repetida: false, pegada: false,
      });
    }
    if (onGuardado) onGuardado();
  };

  const refToUse = nombreInputRef || localInputRef;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-accent)" }}>
        {itemEditar ? "Editar Estampa" : "Nueva Estampa"}
      </h2>

      {error && (
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid var(--color-danger)",
          borderRadius: 8, padding: "10px 14px", color: "var(--color-danger)", fontSize: 13,
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Nombre *</label>
          <input
            ref={refToUse}
            type="text"
            value={form.nombre}
            onChange={set("nombre")}
            placeholder="Ej: Messi 10, Pikachu holo..."
          />
        </div>

        <div>
          <label style={labelStyle}>Categoría</label>
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
          <label style={labelStyle}>Número</label>
          <input type="text" value={form.numero} onChange={set("numero")} placeholder="Ej: 234" />
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
            type="number" min="0" max="10" step="0.5"
            value={form.puntuacion} onChange={set("puntuacion")} placeholder="Opcional"
          />
        </div>

        <div>
          <label style={labelStyle}>Sección del álbum</label>
          <input
            type="text" value={form.seccion} onChange={set("seccion")}
            placeholder="Ej: Portadas, Grupos..."
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Notas</label>
          <textarea
            value={form.notas} onChange={set("notas")}
            placeholder="Condición, observaciones..." rows={2} style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24 }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", fontSize: 13, color: "var(--color-text-muted)",
          }}>
            <input type="checkbox" checked={form.pegada} onChange={set("pegada")}
              style={{ width: "auto", accentColor: "var(--color-success)" }} />
            ✅ Pegada en el álbum
          </label>
          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", fontSize: 13, color: "var(--color-text-muted)",
          }}>
            <input type="checkbox" checked={form.repetida} onChange={set("repetida")}
              style={{ width: "auto", accentColor: "var(--color-warning)" }} />
            🔁 Repetida (para cambio)
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        {onCancelar && (
          <button type="button" onClick={onCancelar}
            style={{
              background: "transparent", color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)", padding: "9px 18px", fontSize: 13,
            }}>
            Cancelar
          </button>
        )}
        <button type="submit"
          style={{
            background: "var(--color-accent)", color: "var(--color-bg)",
            padding: "9px 22px", fontSize: 13, fontWeight: 700,
          }}>
          {itemEditar ? "Guardar cambios" : "Agregar estampa"}
        </button>
      </div>
    </form>
  );
}