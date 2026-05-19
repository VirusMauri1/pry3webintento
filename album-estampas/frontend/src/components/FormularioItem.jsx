import { useState } from "react";
import { useStorage } from "../context/StorageContext";
import { crearItem } from "../utils/itemFactory";
import { CATEGORIAS, ESTADOS } from "../utils/categorias";

const RAREZAS = ["común", "poco común", "rara", "épica", "legendaria"];

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  color: "#8b90b0", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: "0.06em",
};

export function FormularioItem({ onGuardado, itemEditar = null, onCancelar }) {
  const { agregarItem, editarItem } = useStorage();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre:    itemEditar?.nombre              || "",
    categoriaId: itemEditar?.categoriaId      || "grupo-a",
    estado:    itemEditar?.estado             || "faltante",
    puntuacion: itemEditar?.puntuacion != null ? String(itemEditar.puntuacion) : "",
    notas:     itemEditar?.notas              || "",
    numero:    itemEditar?.atributos?.numero  || "",
    seccion:   itemEditar?.atributos?.seccion || "",
    rareza:    itemEditar?.atributos?.rareza  || "común",
    repetida:  itemEditar?.atributos?.repetida || false,
    pegada:    itemEditar?.atributos?.pegada  || false,
  });

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
      setForm({ nombre: "", categoriaId: "grupo-a", estado: "faltante", puntuacion: "", notas: "",
                numero: "", seccion: "", rareza: "común", repetida: false, pegada: false });
    }
    if (onGuardado) onGuardado();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#C0F5FA" }}>
        {itemEditar ? "Editar Estampa" : " Nueva Estampa"}
      </h2>

      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid #f87171",
          borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Nombre *</label>
          <input type="text" value={form.nombre} onChange={set("nombre")}
            placeholder="Ej: Messi 10, Pikachu holo..." />
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
            {RAREZAS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Puntuación (0-10)</label>
          <input type="number" min="0" max="10" step="0.5"
            value={form.puntuacion} onChange={set("puntuacion")} placeholder="Opcional" />
        </div>

        <div>
          <label style={labelStyle}>Sección del álbum</label>
          <input type="text" value={form.seccion} onChange={set("seccion")}
            placeholder="Ej: Portadas, Grupos..." />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Notas</label>
          <textarea value={form.notas} onChange={set("notas")}
            placeholder="Condición, observaciones..." rows={2} style={{ resize: "vertical" }} />
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#8b90b0" }}>
            <input type="checkbox" checked={form.pegada} onChange={set("pegada")}
              style={{ width: "auto", accentColor: "#4ade80" }} />
            ✅ Pegada en el álbum
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#8b90b0" }}>
            <input type="checkbox" checked={form.repetida} onChange={set("repetida")}
              style={{ width: "auto", accentColor: "#facc15" }} />
            🔁 Repetida (para cambio)
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        {onCancelar && (
          <button type="button" onClick={onCancelar}
            style={{ background: "transparent", color: "#8b90b0",
              border: "1px solid rgba(192,245,250,0.1)", padding: "9px 18px", fontSize: 13 }}>
            Cancelar
          </button>
        )}
        <button type="submit"
          style={{ background: "#C0F5FA", color: "#181925", padding: "9px 22px", fontSize: 13, fontWeight: 700 }}>
          {itemEditar ? "Guardar cambios" : "Agregar estampa"}
        </button>
      </div>
    </form>
  );
}