export function itemsReducer(state, action) {
  const now = new Date().toISOString();
  switch (action.type) {
    case "REEMPLAZAR":
      return action.payload;
    case "AGREGAR":
      return [...state, action.payload];
    case "EDITAR":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload, fechaActividad: now }
          : item
      );
    case "ELIMINAR":
      return state.filter((item) => item.id !== action.payload);
    case "ARCHIVAR":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, activo: false, fechaActividad: now }
          : item
      );
    case "RESTAURAR":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, activo: true, fechaActividad: now }
          : item
      );
    case "CAMBIAR_ESTADO":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, estado: action.payload.estado, fechaActividad: now }
          : item
      );
    default:
      return state;
  }
}