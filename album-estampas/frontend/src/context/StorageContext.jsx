import {
  createContext, useContext, useReducer, useEffect,
  useState, useMemo, useRef, useCallback
} from "react";
import { itemsReducer } from "./itemsReducer";
import { crearRegistro } from "../utils/itemFactory";

const API_URL = "http://localhost:3001/api/items";

const StorageContext = createContext(null);

// ─── API helpers ─────────────────────────────────────────────────────────────

async function apiFetch(path = "", options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsGetItems() {
  try {
    const g = localStorage.getItem("items");
    return g ? JSON.parse(g) : [];
  } catch { return []; }
}

function lsSetItems(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StorageProvider({ children }) {
  const [modo, _setModo] = useState(() => localStorage.getItem("modo") || "local");

  // Inicializar con datos de localStorage si estamos en modo local
  const [items, dispatch] = useReducer(itemsReducer, [], () => {
    const modoInicial = localStorage.getItem("modo") || "local";
    if (modoInicial === "local") return lsGetItems();
    return [];
  });

  const [registros, setRegistros] = useState(() => {
    try {
      const g = localStorage.getItem("registros");
      return g ? JSON.parse(g) : [];
    } catch { return []; }
  });

  const [filtros, setFiltros] = useState({ categoriaId: "", estado: "", busqueda: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // useRef: guarda el AbortController sin provocar re-render
  const fetchControllerRef = useRef(null);
  // useRef: saber si el componente sigue montado
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Si el modo inicial es "api", cargar desde la API al montar
  useEffect(() => {
    if (modo === "api") {
      obtenerItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cambio de modo ────────────────────────────────────────────────────────

  const setModo = useCallback((nuevoModo) => {
    localStorage.setItem("modo", nuevoModo);
    _setModo(nuevoModo);
    // Cargar datos del nuevo modo
    if (nuevoModo === "local") {
      dispatch({ type: "REEMPLAZAR", payload: lsGetItems() });
    } else {
      // La carga de API se hace en el useEffect de abajo
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cuando el modo cambia a "api", cargar desde la API
  useEffect(() => {
    if (modo === "api") {
      obtenerItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  // ── Obtener items ─────────────────────────────────────────────────────────

  const obtenerItems = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    setCargando(true);
    setError(null);

    try {
      let data;
      if (modo === "api") {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        data = await res.json();
      } else {
        data = lsGetItems();
      }
      if (mountedRef.current) {
        dispatch({ type: "REEMPLAZAR", payload: data });
      }
    } catch (err) {
      if (err.name !== "AbortError" && mountedRef.current) {
        setError(err.message);
        console.error("obtenerItems error:", err);
      }
    } finally {
      if (mountedRef.current) setCargando(false);
    }
  }, [modo]);

  useEffect(() => {
    localStorage.setItem("registros", JSON.stringify(registros));
  }, [registros]);

  // ── guardarItem ───────────────────────────────────────────────────────────

  const guardarItem = useCallback(async (item) => {
    if (modo === "api") {
      if (item.id) {
        const { item: actualizado } = await apiFetch(`/${item.id}`, {
          method: "PUT",
          body: JSON.stringify(item),
        });
        dispatch({ type: "EDITAR", payload: actualizado });
        return actualizado;
      } else {
        const { item: creado } = await apiFetch("", {
          method: "POST",
          body: JSON.stringify(item),
        });
        dispatch({ type: "AGREGAR", payload: creado });
        return creado;
      }
    } else {
      // modo local: persistir directamente (no depender de useEffect)
      let nuevoEstado;
      if (item.id) {
        dispatch({ type: "EDITAR", payload: item });
        // Reconstruir el estado manualmente para persistir de inmediato
        nuevoEstado = lsGetItems().map((i) =>
          i.id === item.id ? { ...i, ...item } : i
        );
      } else {
        dispatch({ type: "AGREGAR", payload: item });
        nuevoEstado = [...lsGetItems(), item];
      }
      lsSetItems(nuevoEstado);
      return item;
    }
  }, [modo]);

  // ── eliminarItem ──────────────────────────────────────────────────────────

  const eliminarItem = useCallback(async (id) => {
    if (modo === "api") {
      await apiFetch(`/${id}`, { method: "DELETE" });
    } else {
      lsSetItems(lsGetItems().filter((i) => i.id !== id));
    }
    dispatch({ type: "ELIMINAR", payload: id });
  }, [modo]);

  // ── Wrappers de compatibilidad ────────────────────────────────────────────

  const agregarItem = useCallback((item) => guardarItem(item), [guardarItem]);
  const editarItem  = useCallback((item) => guardarItem(item), [guardarItem]);

  const archivarItem = useCallback(async (id) => {
    if (modo === "api") {
      await apiFetch(`/${id}`, { method: "DELETE" });
    } else {
      const actualizados = lsGetItems().map((i) =>
        i.id === id ? { ...i, activo: false } : i
      );
      lsSetItems(actualizados);
    }
    dispatch({ type: "ARCHIVAR", payload: id });
  }, [modo]);

  const restaurarItem = useCallback(async (id) => {
    if (modo === "api") {
      await apiFetch(`/${id}`, {
        method: "PUT",
        body: JSON.stringify({ activo: true }),
      });
    } else {
      const actualizados = lsGetItems().map((i) =>
        i.id === id ? { ...i, activo: true } : i
      );
      lsSetItems(actualizados);
    }
    dispatch({ type: "RESTAURAR", payload: id });
  }, [modo]);

  const cambiarEstado = useCallback(async (id, estado) => {
    if (modo === "api") {
      await apiFetch(`/${id}`, {
        method: "PUT",
        body: JSON.stringify({ estado }),
      });
    } else {
      const actualizados = lsGetItems().map((i) =>
        i.id === id ? { ...i, estado } : i
      );
      lsSetItems(actualizados);
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

  // ── Filtros ───────────────────────────────────────────────────────────────

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