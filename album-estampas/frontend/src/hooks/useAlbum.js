/**
 * Barrel de hooks del Álbum de Estampas.
 * Re-exporta todos los custom hooks del proyecto para importarlos
 * desde un solo lugar.
 *
 * @module hooks/useAlbum
 *
 * @example
 * import { useLocalStorage, useFetch, useAtajoTeclado, useProgreso } from "./hooks/useAlbum";
 */

export { useLocalStorage } from "./useLocalStorage";
export { useFetch }        from "./useFetch";
export { useAtajoTeclado } from "./useAtajoTeclado";
export { useProgreso }     from "./useProgreso";