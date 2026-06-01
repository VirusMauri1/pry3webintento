import { useState, useEffect } from "react";

/**
 * Hook que sincroniza un valor de estado con localStorage.
 * Si la clave ya existe en localStorage, se usa ese valor como estado inicial.
 * Cualquier cambio al estado se persiste automáticamente.
 *
 * @param {string} key - La clave bajo la cual se guarda el valor en localStorage.
 * @param {*} valorInicial - Valor inicial si la clave no existe en localStorage.
 * @returns {[*, Function]} - Tupla con [valorActual, setValor], igual que useState.
 *
 * @example
 * const [items, setItems] = useLocalStorage("items", []);
 * const [tema, setTema] = useLocalStorage("tema", "oscuro");
 */
export function useLocalStorage(key, valorInicial) {
    const [valor, setValor] = useState(() => {
        try {
        const guardado = localStorage.getItem(key);
        return guardado !== null ? JSON.parse(guardado) : valorInicial;
        } catch (error) {
        console.warn(`useLocalStorage: error leyendo clave "${key}"`, error);
        return valorInicial;
        }
    });

    useEffect(() => {
        try {
        localStorage.setItem(key, JSON.stringify(valor));
        } catch (error) {
        console.warn(`useLocalStorage: error guardando clave "${key}"`, error);
        }
    }, [key, valor]);

    return [valor, setValor];
    }