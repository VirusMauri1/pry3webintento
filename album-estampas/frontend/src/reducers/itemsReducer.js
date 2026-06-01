export const initialState = {
  lista: [],                
  filtroCategoria: "todas", 
  filtroEstado: "todos",     
  busqueda: "",              
};

export function itemsReducer(state, action) {
  switch (action.type) {
    // Carga inicial del array de Items (desde API o LocalStorage)
    case "HIDRATAR":
      return { ...state, lista: action.payload };

    // Añade un nuevo Item al array
    case "AGREGAR":
      return { ...state, lista: [...state.lista, action.payload] };

    // Archiva el Item (activo = false).
    case "ELIMINAR":
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, activo: false, fechaActividad: action.payload.fechaActividad }
            : item
        ),
      };

    // Actualiza el estado de un la estampa (faltante / pegada / repetida)
    case "CAMBIAR_ESTADO":
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, estado: action.payload.estado, fechaActividad: action.payload.fechaActividad }
            : item
        ),
      };

    case "FILTRAR":
      return { ...state, ...action.payload };

    // Resetea todos los filtros a su valor inicial
    case "LIMPIAR_FILTROS":
      return {
        ...state,
        filtroCategoria: "todas",
        filtroEstado: "todos",
        busqueda: "",
      };
    //    El historial de registros se guarda fuera del reducer.
    case "REGISTRAR_ACTIVIDAD":
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, fechaActividad: action.payload.fechaActividad }
            : item
        ),
      };

    // Edita un Item existente
    case "EDITAR":
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload }
            : item
        ),
      };

    // Restaura un Item archivado (activo = true)
    case "RESTAURAR":
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, activo: true, fechaActividad: action.payload.fechaActividad }
            : item
        ),
      };

    // Borra definitivamente un Item del array
    case "BORRAR":
      return {
        ...state,
        lista: state.lista.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
}