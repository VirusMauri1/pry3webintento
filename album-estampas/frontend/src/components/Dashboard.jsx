import { useStorage } from "../context/StorageContext";
import { CATEGORIAS } from "../utils/categorias";

export function Dashboard({ setVista }) {
  const { items, registros } = useStorage();
  const { total, pegadas, repetidas, faltantes, porcentaje, porCategoria } = useProgresoAlbum(items);

  const stats = [
    { label: "Total", valor: total, color: "var(--cyan)", emoji: "📒" },
    { label: "Pegadas", valor: pegadas, color: "var(--success)", emoji: "✅" },
    { label: "Repetidas", valor: repetidas, color: "var(--warning)", emoji: "🔁" },
    { label: "Faltantes", valor: faltantes, color: "var(--danger)", emoji: "❌" }
  ];

  // Actividad reciente (últimos 5 registros)
  const actividadReciente = [...registros]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  const getItemNombre = (itemId) => items.find((i) => i.id === itemId)?.nombre || "Desconocido";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Hero progress */}
      <div style={{
        background: "linear-gradient(135deg, var(--bg-card) 0%, #1a1f35 100%)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius)",
        padding: 32,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: -40, right: -40,
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(192,245,250,0.05) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
              PROGRESO DEL ÁLBUM
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: "var(--cyan)", lineHeight: 1, fontFamily: "var(--font-display)" }}>
              {porcentaje}%
            </div>
            <div style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 8 }}>
              {pegadas} de {total} estampas pegadas
            </div>
          </div>
          <div style={{ flex: "0 0 300px" }}>
            <div style={{ height: 12, background: "var(--bg-secondary)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{
                width: `${porcentaje}%`,
                height: "100%",
                background: "linear-gradient(90deg, #7ee8f0, var(--cyan))",
                borderRadius: 6,
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
              <span>{faltantes} faltantes</span>
              <span>{repetidas} repetidas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            textAlign: "center",
            transition: "transform 0.2s"
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.emoji}</div>
            <div style={{
              fontSize: 32,
              fontWeight: 800,
              color: s.color,
              fontFamily: "var(--font-mono)"
            }}>
              {s.valor}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Por categoría */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
            📂 Por sección
          </h3>
          {porCategoria.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sin datos aún</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {porCategoria.map((cat) => (
                <div key={cat.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {cat.emoji} {cat.nombre}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {cat.pegadas}/{cat.total}
                    </span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${cat.porcentaje}%`,
                      height: "100%",
                      background: cat.color,
                      borderRadius: 3,
                      transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
            📝 Actividad reciente
          </h3>
          {actividadReciente.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sin registros aún</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {actividadReciente.map((r) => (
                <div key={r.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13
                }}>
                  <div>
                    <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {getItemNombre(r.itemId)}
                    </div>
                    {r.notas && (
                      <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{r.notas}</div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--cyan)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                      +{r.valor}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{r.fecha}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => setVista("agregar")}
          style={{
            background: "var(--cyan)",
            color: "#181925",
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 0 20px rgba(192,245,250,0.2)"
          }}
        >
          ➕ Agregar estampa
        </button>
        <button
          onClick={() => setVista("estadisticas")}
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            padding: "12px 24px",
            fontSize: 14
          }}
        >
          📈 Ver estadísticas
        </button>
      </div>
    </div>
  );
}
