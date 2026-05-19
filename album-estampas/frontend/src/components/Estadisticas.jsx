import { useStorage } from "../context/StorageContext";
import { GraficaActividad } from "../charts/GraficaActividad";
import { GraficaCategoria } from "../charts/GraficaCategoria";
import { GraficaFaltantesRepetidas } from "../charts/GraficaFaltantesRepetidas";

export function Estadisticas() {
  const { items, registros } = useStorage();
  const { total, pegadas, repetidas, faltantes, porcentaje } = useProgresoAlbum(items);

  const totalRegistros = registros.length;
  const totalActividad = registros.reduce((acc, r) => acc + r.valor, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
          📈 Estadísticas
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 14 }}>
          Análisis visual de tu álbum de estampas
        </p>
      </div>

      {/* Resumen rápido */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 12
      }}>
        {[
          { label: "Completado", valor: `${porcentaje}%`, color: "var(--cyan)" },
          { label: "Actividades", valor: totalRegistros, color: "var(--purple)" },
          { label: "Total actividad", valor: totalActividad, color: "var(--warning)" }
        ].map((s) => (
          <div key={s.label} style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "16px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "var(--font-mono)" }}>
              {s.valor}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Gráfica 1: Actividad en el tiempo */}
      <div style={cardStyle}>
        <h3 style={chartTitleStyle}>📅 Actividad diaria (últimos 14 días)</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Estampas registradas por día
        </p>
        <GraficaActividad registros={registros} />
      </div>

      {/* Gráfica 2: Distribución por categoría */}
      <div style={cardStyle}>
        <h3 style={chartTitleStyle}>📂 Distribución por categoría</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Proporción de estampas por sección
        </p>
        <GraficaCategoria items={items} />
      </div>

      {/* Gráfica 3: Faltantes vs Repetidas (ORIGINAL) */}
      <div style={cardStyle}>
        <h3 style={chartTitleStyle}>🎯 Faltantes vs Repetidas vs Pegadas por sección</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Gráfica de barras agrupadas por sección del álbum — identifica qué secciones tienen más intercambios disponibles
        </p>
        <GraficaFaltantesRepetidas items={items} />
      </div>
    </div>
  );
}

const cardStyle = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: 24
};

const chartTitleStyle = {
  fontSize: 16,
  fontWeight: 700,
  color: "var(--text-primary)",
  marginBottom: 4
};
