import { useEffect, useCallback } from "react";

/**
 * Hook que registra un atajo de teclado global y lo limpia automáticamente
 * cuando el componente se desmonta o cambian las dependencias.
 *
 * Ignora el atajo si el foco está en un input, textarea o select,
 * a menos que se pase la opción `ignorarInputs: false`.
 *
 * @param {string} tecla - La tecla a escuchar (e.g. "t", "Escape", "n").
 * @param {Function} callback - Función que se ejecuta cuando se presiona el atajo.
 * @param {Object} [opciones={}] - Opciones adicionales.
 * @param {boolean} [opciones.ctrl=false] - Requiere Ctrl presionado.
 * @param {boolean} [opciones.alt=false] - Requiere Alt presionado.
 * @param {boolean} [opciones.shift=false] - Requiere Shift presionado.
 * @param {boolean} [opciones.ignorarInputs=true] - Si true, no dispara en inputs/textareas.
 * @param {boolean} [opciones.activo=true] - Si false, desactiva el atajo sin desmontarlo.
 * @returns {void}
 *
 * @example
 * // Atajo simple: tecla "t" para cambiar tema (ignora inputs por defecto)
 * useAtajoTeclado("t", toggleTema);
 *
 * // Atajo con modificador: Alt+N para agregar
 * useAtajoTeclado("n", irAgregar, { alt: true });
 *
 * // Escape para cerrar modal
 * useAtajoTeclado("Escape", onCerrar, { ignorarInputs: false });
 */
export function useAtajoTeclado(
  tecla,
  callback,
  {
    ctrl = false,
    alt = false,
    shift = false,
    ignorarInputs = true,
    activo = true,
  } = {}
) {
  const handler = useCallback(
    (e) => {
      if (!activo) return;

      // Ignorar si estamos escribiendo en un campo de texto
      if (ignorarInputs) {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      }

      // Verificar modificadores
      if (ctrl && !e.ctrlKey) return;
      if (alt && !e.altKey) return;
      if (shift && !e.shiftKey) return;

      // Verificar la tecla (case-insensitive para letras normales)
      const teclaPresionada = e.key.toLowerCase();
      const teclaEsperada = tecla.toLowerCase();
      if (teclaPresionada !== teclaEsperada) return;

      // Prevenir comportamiento por defecto si hay modificadores
      if (ctrl || alt) e.preventDefault();

      callback(e);
    },
    [tecla, callback, ctrl, alt, shift, ignorarInputs, activo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handler]);
}