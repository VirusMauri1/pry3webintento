import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

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
        <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 700 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function GraficaActividad({ registros }) {
  // Agrupar por fecha
  const porFecha = registros.reduce((acc, r) => {
    const fecha = r.fecha;
    acc[fecha] = (acc[fecha] || 0) + r.valor;
    return acc;
  }, {});

  const datos = Object.entries(porFecha)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([fecha, total]) => ({
      fecha: fecha.slice(5), // MM-DD
      estampas: total
    }));

  if (datos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
        Sin datos de actividad aún
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="fecha" tick={{ fill: "#8b90b0", fontSize: 12 }} />
        <YAxis tick={{ fill: "#8b90b0", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#8b90b0", fontSize: 13 }} />
        <Line
          type="monotone"
          dataKey="estampas"
          stroke="#C0F5FA"
          strokeWidth={2.5}
          dot={{ fill: "#C0F5FA", r: 4 }}
          activeDot={{ r: 6, fill: "#7ee8f0" }}
          name="Estampas registradas"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
