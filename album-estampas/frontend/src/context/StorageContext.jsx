import {
  createContext, useContext, useReducer, useEffect,
  useState, useMemo, useRef, useCallback
} from "react";
import { itemsReducer } from "./itemsReducer";
import { crearRegistro } from "../utils/itemFactory";

const API_URL = "http://localhost:3001/api/items";
const StorageContext = createContext(null);

async function apiFetch(path = "", options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function StorageProvider({ children }) {
  const [modo, _setModo] = useState(() => lsGet("modo") || "local");

  // empezar siempre en modo local 
  const [items, dispatch] = useReducer(itemsReducer, [], () => {
    const modoInicial = lsGet("modo") || "local";
    if (modoInicial === "local") return lsGet("items") || [];
    return [];
  });

  const [registros, setRegistros] = useState(() => lsGet("registros") || []);
  const [filtros, setFiltros] = useState({ categoriaId: "", estado: "", busqueda: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (modo === "local") {
      lsSet("items", items);
    }
  }, [items, modo]);

  useEffect(() => {
    lsSet("registros", registros);
  }, [registros]);

  useEffect(() => {
    if (modo === "api") obtenerItems();
  }, []);

  // Cambio de modo
  const setModo = useCallback((nuevoModo) => {
    lsSet("modo", nuevoModo);
    _setModo(nuevoModo);
    if (nuevoModo === "local") {
      const saved = lsGet("items") || [];
      dispatch({ type: "REEMPLAZAR", payload: saved });
    }
  }, []);

  useEffect(() => {
    if (modo === "api") obtenerItems();
  }, [modo]);

  // Obtener items
  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (modo === "api") {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        if (mountedRef.current) dispatch({ type: "REEMPLAZAR", payload: data });
      } else {
        const data = lsGet("items") || [];
        dispatch({ type: "REEMPLAZAR", payload: data });
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setCargando(false);
    }
  }, [modo]);

  // Agregar y editar item
  const agregarItem = useCallback(async (item) => {
    if (modo === "api") {
      try {
        const { item: creado } = await apiFetch("", {
          method: "POST",
          body: JSON.stringify(item),
        });
        dispatch({ type: "AGREGAR", payload: creado });
        return creado;
      } catch (err) {
        setError(err.message);
        return null;
      }
    } else {
      dispatch({ type: "AGREGAR", payload: item });
      return item;
    }
  }, [modo]);

  const editarItem = useCallback(async (item) => {
    if (modo === "api") {
      try {
        const { item: actualizado } = await apiFetch(`/${item.id}`, {
          method: "PUT",
          body: JSON.stringify(item),
        });
        dispatch({ type: "EDITAR", payload: actualizado });
        return actualizado;
      } catch (err) {
        setError(err.message);
        return null;
      }
    } else {
      dispatch({ type: "EDITAR", payload: item });
      return item;
    }
  }, [modo]);

  const archivarItem = useCallback(async (id) => {
    if (modo === "api") {
      try { await apiFetch(`/${id}`, { method: "DELETE" }); }
      catch (err) { setError(err.message); return; }
    }
    dispatch({ type: "ARCHIVAR", payload: id });
  }, [modo]);

  const restaurarItem = useCallback(async (id) => {
    if (modo === "api") {
      try {
        await apiFetch(`/${id}`, {
          method: "PUT",
          body: JSON.stringify({ activo: true }),
        });
      } catch (err) { setError(err.message); return; }
    }
    dispatch({ type: "RESTAURAR", payload: id });
  }, [modo]);

  const eliminarItem = useCallback(async (id) => {
    if (modo === "api") {
      try { await apiFetch(`/${id}`, { method: "DELETE" }); }
      catch (err) { setError(err.message); return; }
    }
    dispatch({ type: "ELIMINAR", payload: id });
  }, [modo]);

  const cambiarEstado = useCallback(async (id, estado) => {
    if (modo === "api") {
      try {
        await apiFetch(`/${id}`, {
          method: "PUT",
          body: JSON.stringify({ estado }),
        });
      } catch (err) { setError(err.message); return; }
    }
    dispatch({ type: "CAMBIAR_ESTADO", payload: { id, estado } });
  }, [modo]);

  const agregarRegistro = useCallback(async (datos) => {
    const r = crearRegistro(datos);
    if (modo === "api") {
      try {
        await apiFetch(`/${datos.itemId}/registro`, {
          method: "POST",
          body: JSON.stringify({ valor: datos.valor, notas: datos.notas }),
        });
      } catch (err) {
        console.error("agregarRegistro API error:", err);
      }
    }
    setRegistros((prev) => [...prev, r]);
    dispatch({ type: "EDITAR", payload: { id: datos.itemId, fechaActividad: new Date().toISOString() } });
    return r;
  }, [modo]);

  // Filtros
  const itemsFiltrados = useMemo(() =>
    items.filter((item) => {
      if (!item.activo) return false;
      if (filtros.categoriaId && item.categoriaId !== filtros.categoriaId) return false;
      if (filtros.estado && item.estado !== filtros.estado) return false;
      if (filtros.busqueda) {
        const b = filtros.busqueda.toLowerCase();
        if (
          !item.nombre.toLowerCase().includes(b) &&
          !(item.notas || "").toLowerCase().includes(b)
        ) return false;
      }
      return true;
    }), [items, filtros]);

  const itemsArchivados = useMemo(() => items.filter((i) => !i.activo), [items]);

  const guardarItem = useCallback((item) =>
    item.id ? editarItem(item) : agregarItem(item), [agregarItem, editarItem]);

  return (
    <StorageContext.Provider value={{
      items, itemsFiltrados, itemsArchivados, registros,
      filtros, setFiltros,
      cargando, error,
      modo, setModo,
      obtenerItems,
      guardarItem,
      eliminarItem,
      agregarItem, editarItem, archivarItem, restaurarItem,
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