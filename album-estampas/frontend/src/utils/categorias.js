export const CATEGORIAS = [
  {
    id: "grupo-a",
    nombre: "Grupo A",
    emoji: "🏆",
    color: "#C0F5FA"
  },
  {
    id: "grupo-b",
    nombre: "Grupo B",
    emoji: "⚽",
    color: "#60A5FA"
  },
  {
    id: "argentina",
    nombre: "Argentina",
    emoji: "⭐",
    color: "#60A5FA"
  },
  {
    id: "brasil",
    nombre: "Brasil",
    emoji: "🔥",
    color: "#FACC15"
  },
  {
    id: "estrellas",
    nombre: "Estrellas",
    emoji: "💫",
    color: "#F472B6"
  },
  {
    id: "pokemon",
    nombre: "Pokémon",
    emoji: "⚡",
    color: "#A78BFA"
  },
  {
    id: "nba",
    nombre: "NBA",
    emoji: "🏀",
    color: "#FB923C"
  }
];

export const ESTADOS = [
  { id: "faltante", nombre: "Faltante", color: "#f87171", emoji: "❌" },
  { id: "pegada", nombre: "Pegada", color: "#4ade80", emoji: "✅" },
  { id: "repetida", nombre: "Repetida", color: "#facc15", emoji: "🔁" },
  { id: "archivada", nombre: "Archivada", color: "#6b7280", emoji: "📦" }
];

export const getCategoriaById = (id) =>
  CATEGORIAS.find((c) => c.id === id) || { nombre: "Sin categoría", emoji: "📁", color: "#555" };

export const getEstadoById = (id) =>
  ESTADOS.find((e) => e.id === id) || { nombre: id, color: "#555", emoji: "❓" };
