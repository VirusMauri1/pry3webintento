import { useState, useEffect, useCallback } from "react";

/**
 * Hook para realizar peticiones HTTP con manejo de estados de carga y error.
 * Usa AbortController para cancelar la petición si el componente se desmonta
 * o si se lanza una nueva petición antes de que termine la anterior.
 *
 * @param {string|null} url - URL a la que se hace el fetch. Si es null, no se ejecuta.
 * @param {RequestInit} [opciones={}] - Opciones adicionales para el fetch (method, headers, body, etc.).
 * @returns {{ data: *, loading: boolean, error: string|null, refetch: Function }}
 *   - data: respuesta parseada como JSON (null si aún no hay datos)
 *   - loading: true mientras la petición está en curso
 *   - error: mensaje de error si la petición falló, null si no hay error
 *   - refetch: función para volver a ejecutar la petición manualmente
 *
 * @example
 * // Fetch básico
 * const { data, loading, error } = useFetch("http://localhost:3001/api/items");
 *
 * // Con refetch manual
 * const { data, loading, refetch } = useFetch(url);
 * <button onClick={refetch}>Recargar</button>
 */
export function useFetch(url, opciones = {}) {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const [contador, setContador] = useState(0); // para forzar refetch

    const refetch = useCallback(() => {
        setContador((c) => c + 1);
    }, []);

    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();
        const signal = controller.signal;

        async function ejecutarFetch() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, { ...opciones, signal });
            if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            const json = await res.json();
            if (!signal.aborted) {
            setData(json);
            }
        } catch (err) {
            if (err.name !== "AbortError" && !signal.aborted) {
            setError(err.message);
            }
        } finally {
            if (!signal.aborted) {
            setLoading(false);
            }
        }
        }

        ejecutarFetch();

        // cleanup: cancela la petición si el componente se desmonta o cambia la URL
        return () => {
        controller.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, contador]);

    return { data, loading, error, refetch };
}