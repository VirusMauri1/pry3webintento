import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { CATEGORIAS } from "../utils/categorias";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13
      }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 6, fontWeight: 700 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill, marginTop: 2 }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function GraficaFaltantesRepetidas({ items }) {
  const activos = items.filter((i) => i.activo);

  const datos = CATEGORIAS
    .map((cat) => {
      const catItems = activos.filter((i) => i.categoriaId === cat.id);
      return {
        seccion: cat.nombre,
        Faltantes: catItems.filter((i) => i.estado === "faltante").length,
        Repetidas: catItems.filter((i) => i.estado === "repetida").length,
        Pegadas: catItems.filter((i) => i.estado === "pegada").length
      };
    })
    .filter((d) => d.Faltantes > 0 || d.Repetidas > 0 || d.Pegadas > 0);

  if (datos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
        Agrega estampas para ver esta gráfica
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="seccion"
          tick={{ fill: "#8b90b0", fontSize: 11 }}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fill: "#8b90b0", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: "#8b90b0" }}>{value}</span>}
        />
        <Bar dataKey="Pegadas" fill="#4ade80" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Repetidas" fill="#facc15" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Faltantes" fill="#f87171" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
