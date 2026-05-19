export const itemsReducer = (state, action) => {
  switch (action.type) {
    case "HIDRATAR":
      return action.payload;

    case "AGREGAR":
      return [...state, action.payload];

    case "EDITAR":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload, fechaActividad: new Date().toISOString() }
          : item
      );

    case "ELIMINAR":
      return state.filter((item) => item.id !== action.payload);

    case "CAMBIAR_ESTADO":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, estado: action.payload.estado, fechaActividad: new Date().toISOString() }
          : item
      );

    case "TOGGLE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, [action.payload.campo]: !item[action.payload.campo], fechaActividad: new Date().toISOString() }
          : item
      );

    case "TOGGLE_ATRIBUTO":
      return state.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              atributos: {
                ...item.atributos,
                [action.payload.campo]: !item.atributos?.[action.payload.campo]
              },
              fechaActividad: new Date().toISOString()
            }
          : item
      );

    case "ARCHIVAR":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, activo: false, fechaActividad: new Date().toISOString() }
          : item
      );

    case "RESTAURAR":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, activo: true, fechaActividad: new Date().toISOString() }
          : item
      );

    case "FILTRAR":
      return state;

    default:
      return state;
  }
};
