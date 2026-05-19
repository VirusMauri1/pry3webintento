import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { CATEGORIAS } from "../utils/categorias";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13
      }}>
        <p style={{ color: payload[0].payload.fill, fontWeight: 700 }}>
          {payload[0].name}: {payload[0].value} estampas
        </p>
      </div>
    );
  }
  return null;
};

export function GraficaCategoria({ items }) {
  const activos = items.filter((i) => i.activo);

  const datos = CATEGORIAS
    .map((cat) => ({
      name: `${cat.emoji} ${cat.nombre}`,
      value: activos.filter((i) => i.categoriaId === cat.id).length,
      color: cat.color
    }))
    .filter((d) => d.value > 0);

  if (datos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
        Sin datos de categorías aún
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {datos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: "#8b90b0", fontSize: 12 }}
          formatter={(value) => <span style={{ color: "#8b90b0" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
