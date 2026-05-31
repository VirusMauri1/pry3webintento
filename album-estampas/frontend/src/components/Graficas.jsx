import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useStorage } from "../context/StorageContext";
import { getCategoriaById } from "../utils/categorias";
import { FiltrosBar } from "./FiltrosBar";

// mismos colores de rareza que usa ItemCard
const RAREZA_COLOR = {
  "común": "#8b90b0",
  "poco común": "#4ade80",
  "rara": "#60a5fa",
  "épica": "#a78bfa",
  "legendaria": "#facc15",
};
const RAREZAS_ORDEN = ["común", "poco común", "rara", "épica", "legendaria"];

const card = {
  background: "var(--color-bg-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: 18,
};

const titulo = {
  fontSize: 13,
  fontWeight: 700,
  color: "var(--color-accent)",
  marginBottom: 14,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function tooltipStyle() {
  return {
    background: "var(--color-bg-elevated)",
    border: "1px solid var(--color-accent-border)",
    borderRadius: 8,
    fontSize: 12,
    color: "var(--color-text)",
  };
}

export function Graficas() {
  // itemsFiltrados respeta categoría + estado + búsqueda => las 3 gráficas reaccionan a filtros
  const { itemsFiltrados, registros } = useStorage();

  // --- Gráfica 1: progreso acumulado de pegadas a lo largo del tiempo (LineChart) ---
  // Versión robusta: el total de HOY = nº de estampas pegadas ahora (siempre existe).
  // Con los eventos (+1 pegar / -1 despegar) se reconstruyen los días anteriores
  // hacia atrás. Si no hay eventos, igual se muestra el punto de hoy.
  const dataProgreso = useMemo(() => {
    const idsVisibles = new Set(itemsFiltrados.map((i) => i.id));
    const hoyClave = new Date().toISOString().split("T")[0];

    // total real de pegadas hoy (entre las visibles)
    const pegadasHoy = itemsFiltrados.filter((i) => i.estado === "pegada").length;

    // eventos de progreso de las estampas visibles, ordenados por día
    const eventos = registros
      .filter((r) => r.tipo === "progreso" && idsVisibles.has(r.itemId))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // neto de cambios por día
    const netoPorDia = {};
    for (const ev of eventos) {
      netoPorDia[ev.fecha] = (netoPorDia[ev.fecha] || 0) + ev.delta;
    }

    // días con actividad + el día de hoy (para anclar el total real)
    const dias = new Set(Object.keys(netoPorDia));
    dias.add(hoyClave);
    const diasOrdenados = [...dias].sort();

    // Reconstrucción hacia atrás: el acumulado del último día es pegadasHoy,
    // y cada día anterior se obtiene restando el neto del día siguiente.
    const acumPorDia = {};
    let acum = pegadasHoy;
    for (let i = diasOrdenados.length - 1; i >= 0; i--) {
      const dia = diasOrdenados[i];
      acumPorDia[dia] = acum;
      acum -= (netoPorDia[dia] || 0); // quitar lo que pasó ese día para obtener el día previo
    }

    return diasOrdenados.map((fecha) => {
      const d = new Date(fecha + "T00:00:00");
      const etiqueta = d.toLocaleDateString("es", { day: "numeric", month: "short" });
      return { dia: etiqueta, pegadas: Math.max(0, acumPorDia[fecha]) };
    });
  }, [itemsFiltrados, registros]);

  // --- Gráfica 2: distribución de Items por categoría (PieChart) ---
  const dataCategorias = useMemo(() => {
    const conteo = itemsFiltrados.reduce((acc, item) => {
      acc[item.categoriaId] = (acc[item.categoriaId] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(conteo)
      .map(([id, valor]) => {
        const cat = getCategoriaById(id);
        return { nombre: cat.nombre, valor, color: cat.color };
      })
      .sort((a, b) => b.valor - a.valor);
  }, [itemsFiltrados]);

  // --- Gráfica 3 (LIBRE): distribución por rareza (BarChart) ---
  const dataRareza = useMemo(() => {
    const conteo = itemsFiltrados.reduce((acc, item) => {
      const r = item.atributos?.rareza || "común";
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});
    return RAREZAS_ORDEN.map((r) => ({
      rareza: r,
      cantidad: conteo[r] || 0,
      color: RAREZA_COLOR[r],
    }));
  }, [itemsFiltrados]);

  const hayDatos = itemsFiltrados.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filtros propios de la vista de gráficas (compartidos vía reducer) */}
      <FiltrosBar />

      <div style={{ fontSize: 13, color: "var(--color-text-subtle)" }}>
        Graficando <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>{itemsFiltrados.length}</span> estampas
      </div>

      {!hayDatos ? (
        <div style={{ ...card, textAlign: "center", padding: "40px 20px", color: "var(--color-text-subtle)" }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>📊</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>No hay datos para graficar con los filtros actuales</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>

          {/* Gráfica 1 */}
          <div style={card}>
            <h3 style={titulo}>Progreso de pegadas · en el tiempo</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dataProgreso}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="dia" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis allowDecimals={false} stroke="var(--color-text-muted)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle()} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="pegadas" name="Pegadas acumuladas"
                  stroke="var(--color-success)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica 2 */}
          <div style={card}>
            <h3 style={titulo}>Distribución por categoría</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={dataCategorias} dataKey="valor" nameKey="nombre"
                  cx="50%" cy="50%" outerRadius={80} label={(e) => e.nombre} fontSize={11}>
                  {dataCategorias.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle()} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica 3 (libre) */}
          <div style={card}>
            <h3 style={titulo}>Distribución por rareza</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dataRareza}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="rareza" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis allowDecimals={false} stroke="var(--color-text-muted)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "var(--color-accent-dim)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="cantidad" name="Estampas" radius={[6, 6, 0, 0]}>
                  {dataRareza.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}