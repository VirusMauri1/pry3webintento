export function crearItem({ nombre, categoriaId, estado, puntuacion, notas, atributos }) {
  return {
    id: crypto.randomUUID(),
    nombre: nombre || "",
    categoriaId: categoriaId || "grupo-a",
    estado: estado || "faltante",
    puntuacion: puntuacion !== undefined && puntuacion !== "" ? Number(puntuacion) : null,
    fechaRegistro: new Date().toISOString(),
    fechaActividad: new Date().toISOString(),
    notas: notas || "",
    atributos: atributos || { numero: "", seccion: "", repetida: false, pegada: false, rareza: "común" },
    activo: true,
  };
}

export function crearRegistro({ itemId, valor, notas }) {
  return {
    id: crypto.randomUUID(),
    itemId,
    fecha: new Date().toISOString().split("T")[0],
    valor: Number(valor) || 1,
    notas: notas || "",
  };
}

// Evento de progreso de colección: +1 al pegar una estampa, -1 al despegarla.
// La fecha (día) se guarda para poder reconstruir la evolución acumulada.
export function crearEventoProgreso({ itemId, delta }) {
  return {
    id: crypto.randomUUID(),
    tipo: "progreso",
    itemId,
    delta,                                       // +1 o -1
    fecha: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  };
}