import { createContext, useContext, useReducer, useEffect, useState, useMemo } from "react";
import { itemsReducer } from "./itemsReducer";
import { crearRegistro } from "../utils/itemFactory";

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [items, dispatch] = useReducer(itemsReducer, [], () => {
    try {
      const g = localStorage.getItem("items");
      return g ? JSON.parse(g) : [];
    } catch { return []; }
  });

  const [registros, setRegistros] = useState(() => {
    try {
      const g = localStorage.getItem("registros");
      return g ? JSON.parse(g) : [];
    } catch { return []; }
  });

  const [filtros, setFiltros] = useState({ categoriaId: "", estado: "", busqueda: "" });

  useEffect(() => { localStorage.setItem("items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("registros", JSON.stringify(registros)); }, [registros]);

  const agregarItem   = (item)         => dispatch({ type: "AGREGAR",       payload: item });
  const editarItem    = (item)         => dispatch({ type: "EDITAR",        payload: item });
  const eliminarItem  = (id)           => dispatch({ type: "ELIMINAR",      payload: id });
  const archivarItem  = (id)           => dispatch({ type: "ARCHIVAR",      payload: id });
  const restaurarItem = (id)           => dispatch({ type: "RESTAURAR",     payload: id });
  const cambiarEstado = (id, estado)   => dispatch({ type: "CAMBIAR_ESTADO", payload: { id, estado } });

  const agregarRegistro = (datos) => {
    const r = crearRegistro(datos);
    setRegistros((prev) => [...prev, r]);
    dispatch({ type: "EDITAR", payload: { id: datos.itemId, fechaActividad: new Date().toISOString() } });
    return r;
  };

  const itemsFiltrados = useMemo(() =>
    items.filter((item) => {
      if (!item.activo) return false;
      if (filtros.categoriaId && item.categoriaId !== filtros.categoriaId) return false;
      if (filtros.estado && item.estado !== filtros.estado) return false;
      if (filtros.busqueda) {
        const b = filtros.busqueda.toLowerCase();
        if (!item.nombre.toLowerCase().includes(b) && !(item.notas || "").toLowerCase().includes(b)) return false;
      }
      return true;
    }), [items, filtros]);

  const itemsArchivados = useMemo(() => items.filter((i) => !i.activo), [items]);

  return (
    <StorageContext.Provider value={{
      items, itemsFiltrados, itemsArchivados, registros,
      filtros, setFiltros,
      agregarItem, editarItem, eliminarItem, archivarItem, restaurarItem,
      cambiarEstado, agregarRegistro,
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage debe usarse dentro de StorageProvider");
  return ctx;
}
