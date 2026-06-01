import { useStorage } from "../context/useStorage";
import { CATEGORIAS, ESTADOS } from "../utils/categorias";

const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#555a7a",
    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em",
    };

export function FiltrosBar() {
    const { filtros, setFiltros, limpiarFiltros } = useStorage();

    const hayFiltros =
        (filtros.categoriaId && filtros.categoriaId !== "todas") ||
        (filtros.estado && filtros.estado !== "todos") ||
        filtros.busqueda;

    return (
        <div style={{
        background: "var(--color-bg-surface)", border: "1px solid var(--color-border)",
        borderRadius: 12, padding: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end",
        }}>
        <div style={{ flex: "1 1 180px", minWidth: 140 }}>
            <label style={labelStyle}> Buscar</label>
            <input type="text" value={filtros.busqueda}
            onChange={(e) => setFiltros((f) => ({ ...f, busqueda: e.target.value }))}
            placeholder="Nombre o notas..." />
        </div>
        <div style={{ flex: "1 1 140px", minWidth: 120 }}>
            <label style={labelStyle}>Categoría</label>
            <select value={filtros.categoriaId}
            onChange={(e) => setFiltros((f) => ({ ...f, categoriaId: e.target.value }))}>
            <option value="todas">Todas</option>
            {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>)}
            </select>
        </div>
        <div style={{ flex: "1 1 120px", minWidth: 110 }}>
            <label style={labelStyle}>Estado</label>
            <select value={filtros.estado}
            onChange={(e) => setFiltros((f) => ({ ...f, estado: e.target.value }))}>
            <option value="todos">Todos</option>
            {ESTADOS.map((e) => <option key={e.id} value={e.id}>{e.emoji} {e.nombre}</option>)}
            </select>
        </div>
        {hayFiltros && (
            <button onClick={limpiarFiltros} style={{
            background: "rgba(248,113,113,0.1)", color: "#f87171",
            border: "1px solid rgba(248,113,113,0.3)", padding: "9px 14px", fontSize: 12, fontWeight: 600,
            }}>✕ Limpiar</button>
        )}
        </div>
    );
}