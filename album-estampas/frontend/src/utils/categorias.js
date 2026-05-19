export const CATEGORIAS = [
  { id: "especiales", nombre: "Especiales", emoji: "⭐", color: "#FACC15" },
  { id: "argentina", nombre: "Argentina", emoji: "🔵", color: "#60A5FA" },
  { id: "brasil", nombre: "Brasil", emoji: "🟡", color: "#FACC15" },
  { id: "francia", nombre: "Francia", emoji: "🔵", color: "#2563EB" },
  { id: "alemania", nombre: "Alemania", emoji: "⚫", color: "#111827" },
  { id: "espana", nombre: "España", emoji: "🔴", color: "#DC2626" },
  { id: "portugal", nombre: "Portugal", emoji: "🟢", color: "#16A34A" },
  { id: "inglaterra", nombre: "Inglaterra", emoji: "⚪", color: "#E5E7EB" },
  { id: "uruguay", nombre: "Uruguay", emoji: "🔵", color: "#38BDF8" },
  { id: "mexico", nombre: "México", emoji: "🟢", color: "#22C55E" },
  { id: "estados-unidos", nombre: "Estados Unidos", emoji: "🔴", color: "#3B82F6" },
  { id: "japon", nombre: "Japón", emoji: "🔴", color: "#F43F5E" },
  { id: "corea", nombre: "Corea del Sur", emoji: "⚪", color: "#FB7185" },
  { id: "croacia", nombre: "Croacia", emoji: "🔴", color: "#EF4444" },
  { id: "belgica", nombre: "Bélgica", emoji: "🟡", color: "#FACC15" },
  { id: "holanda", nombre: "Países Bajos", emoji: "🟠", color: "#F97316" },
  { id: "marruecos", nombre: "Marruecos", emoji: "🔴", color: "#DC2626" },
  { id: "suiza", nombre: "Suiza", emoji: "🔴", color: "#EF4444" },
  { id: "senegal", nombre: "Senegal", emoji: "🟢", color: "#22C55E" },
  { id: "camerun", nombre: "Camerún", emoji: "🟢", color: "#16A34A" },
  { id: "canada", nombre: "Canadá", emoji: "🔴", color: "#DC2626" },
  { id: "australia", nombre: "Australia", emoji: "🔵", color: "#2563EB" },
  { id: "serbia", nombre: "Serbia", emoji: "🔴", color: "#DC2626" },
  { id: "dinamarca", nombre: "Dinamarca", emoji: "🔴", color: "#EF4444" },
  { id: "polonia", nombre: "Polonia", emoji: "⚪", color: "#F472B6" },
  { id: "ecuador", nombre: "Ecuador", emoji: "🟡", color: "#FACC15" },
  { id: "ghana", nombre: "Ghana", emoji: "🟡", color: "#F59E0B" },
  { id: "qatar", nombre: "Qatar", emoji: "🟣", color: "#9333EA" },
  { id: "tunisia", nombre: "Túnez", emoji: "🔴", color: "#DC2626" },
  { id: "arabia", nombre: "Arabia Saudita", emoji: "🟢", color: "#16A34A" },
  { id: "iran", nombre: "Irán", emoji: "🟢", color: "#22C55E" },
  { id: "gales", nombre: "Gales", emoji: "🔴", color: "#DC2626" },
  { id: "costa-rica", nombre: "Costa Rica", emoji: "🔴", color: "#EF4444" }
];

export const ESTADOS = [
  { id: "faltante", nombre: "Faltante", color: "#f87171", emoji: "❌" },
  { id: "pegada", nombre: "Pegada", color: "#4ade80", emoji: "✅" },
  { id: "repetida", nombre: "Repetida", color: "#facc15", emoji: "🔁" }
];

export const getCategoriaById = (id) =>
  CATEGORIAS.find((c) => c.id === id) || {
    nombre: "Sin categoría",
    emoji: "⚪",
    color: "#555"
  };

export const getEstadoById = (id) =>
  ESTADOS.find((e) => e.id === id) || {
    nombre: id,
    color: "#555",
    emoji: "❓"
  };