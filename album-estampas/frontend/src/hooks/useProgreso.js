import { useMemo } from "react";

/**
 * Hook de dominio para el Álbum de Estampas.
 * Calcula estadísticas de progreso de la colección a partir de una lista de items.
 *
 * @param {Array<Object>} items - Lista de estampas activas del álbum.
 * @param {string} items[].estado - Estado de la estampa: "pegada" | "faltante" | "repetida".
 * @param {string} items[].categoriaId - ID de la categoría/equipo de la estampa.
 * @param {Object} items[].atributos - Atributos extras de la estampa.
 * @param {string} [items[].atributos.rareza] - Rareza de la estampa.
 * @param {boolean} [items[].atributos.repetida] - Si está marcada como repetida.
 * @returns {{
 *   total: number,
 *   pegadas: number,
 *   faltantes: number,
 *   repetidas: number,
 *   porcentaje: number,
 *   porCategoria: Object,
 *   porRareza: Object,
 *   paraIntercambio: number,
 *   completo: boolean,
 * }}
 *   - total: cantidad total de estampas activas
 *   - pegadas: cuántas están pegadas en el álbum
 *   - faltantes: cuántas aún faltan
 *   - repetidas: cuántas están marcadas como repetidas
 *   - porcentaje: porcentaje de completitud (0-100)
 *   - porCategoria: objeto con { [categoriaId]: { total, pegadas, porcentaje } }
 *   - porRareza: objeto con { [rareza]: { total, pegadas } }
 *   - paraIntercambio: cantidad de estampas repetidas disponibles para intercambio
 *   - completo: true si el álbum está completo (porcentaje === 100)
 *
 * @example
 * const { porcentaje, pegadas, faltantes, completo } = useProgreso(items);
 * // En la Navbar:
 * <span>{porcentaje}% completado</span>
 *
 * @example
 * const { porCategoria } = useProgreso(items);
 * // Para ver progreso por equipo:
 * Object.entries(porCategoria).forEach(([id, stats]) => {
 *   console.log(`${id}: ${stats.porcentaje}%`);
 * });
 */
export function useProgreso(items = []) {
  return useMemo(() => {
    const activos = items.filter((i) => i.activo !== false);

    const total     = activos.length;
    const pegadas   = activos.filter((i) => i.estado === "pegada").length;
    const faltantes = activos.filter((i) => i.estado === "faltante").length;
    const repetidas = activos.filter((i) => i.estado === "repetida").length;
    const porcentaje = total > 0 ? Math.round((pegadas / total) * 100) : 0;
    const completo = total > 0 && pegadas === total;

    // Estampas con atributo repetida=true disponibles para intercambio
    const paraIntercambio = activos.filter(
      (i) => i.atributos?.repetida === true
    ).length;

    // Progreso agrupado por categoría
    const porCategoria = activos.reduce((acc, item) => {
      const cat = item.categoriaId || "sin-categoria";
      if (!acc[cat]) acc[cat] = { total: 0, pegadas: 0, porcentaje: 0 };
      acc[cat].total++;
      if (item.estado === "pegada") acc[cat].pegadas++;
      return acc;
    }, {});

    // Calcular porcentaje por categoría
    for (const cat of Object.values(porCategoria)) {
      cat.porcentaje = cat.total > 0
        ? Math.round((cat.pegadas / cat.total) * 100)
        : 0;
    }

    // Progreso agrupado por rareza
    const porRareza = activos.reduce((acc, item) => {
      const rareza = item.atributos?.rareza || "común";
      if (!acc[rareza]) acc[rareza] = { total: 0, pegadas: 0 };
      acc[rareza].total++;
      if (item.estado === "pegada") acc[rareza].pegadas++;
      return acc;
    }, {});

    return {
      total,
      pegadas,
      faltantes,
      repetidas,
      porcentaje,
      porCategoria,
      porRareza,
      paraIntercambio,
      completo,
    };
  }, [items]);
}