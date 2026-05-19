import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { itemsReducer } from "./itemsReducer";
import { crearRegistro } from "../utils/itemFactory";

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [items, dispatch] = useReducer(itemsReducer, [], () => {
    try {
      const guardado = localStorage.getItem("items");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [registros, setRegistros] = useState(() => {
    try {
      const guardado = localStorage.getItem("registros");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [filtros, setFiltros] = useState({
    categoriaId: "",
    estado: "",
    busqueda: ""
  });

  // Sincronizar items con localStorage
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // Sincronizar registros con localStorage
  useEffect(() => {
    localStorage.setItem("registros", JSON.stringify(registros));
  }, [registros]);

  // CRUD items
  const agregarItem = (item) => dispatch({ type: "AGREGAR", payload: item });

  const editarItem = (item) => dispatch({ type: "EDITAR", payload: item });

  const eliminarItem = (id) => dispatch({ type: "ELIMINAR", payload: id });

  const archivarItem = (id) => dispatch({ type: "ARCHIVAR", payload: id });

  const restaurarItem = (id) => dispatch({ type: "RESTAURAR", payload: id });

  const cambiarEstado = (id, estado) =>
    dispatch({ type: "CAMBIAR_ESTADO", payload: { id, estado } });

  const toggleAtributo = (id, campo) =>
    dispatch({ type: "TOGGLE_ATRIBUTO", payload: { id, campo } });

  const toggleCampo = (id, campo) =>
    dispatch({ type: "TOGGLE", payload: { id, campo } });

  // Registros
  const agregarRegistro = (datos) => {
    const registro = crearRegistro(datos);
    setRegistros((prev) => [...prev, registro]);
    // Actualizar fechaActividad del item
    dispatch({
      type: "EDITAR",
      payload: { id: datos.itemId, fechaActividad: new Date().toISOString() }
    });
    return registro;
  };

  const getRegistrosDeItem = (itemId) =>
    registros.filter((r) => r.itemId === itemId);

  // Items filtrados
  const itemsFiltrados = items.filter((item) => {
    if (!item.activo) return false;
    if (filtros.categoriaId && item.categoriaId !== filtros.categoriaId) return false;
    if (filtros.estado && item.estado !== filtros.estado) return false;
    if (filtros.busqueda) {
      const b = filtros.busqueda.toLowerCase();
      if (!item.nombre.toLowerCase().includes(b) && !item.notas?.toLowerCase().includes(b))
        return false;
    }
    return true;
  });

  const itemsArchivados = items.filter((i) => !i.activo);

  return (
    <StorageContext.Provider
      value={{
        items,
        itemsFiltrados,
        itemsArchivados,
        registros,
        filtros,
        setFiltros,
        agregarItem,
        editarItem,
        eliminarItem,
        archivarItem,
        restaurarItem,
        cambiarEstado,
        toggleAtributo,
        toggleCampo,
        agregarRegistro,
        getRegistrosDeItem,
        dispatch
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage debe usarse dentro de StorageProvider");
  return ctx;
}
