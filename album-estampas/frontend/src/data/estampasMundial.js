const ESTAMPAS_POR_EQUIPO = 20;
const NUM_ESCUDO = 1;
const NUM_FOTO = 13;

// se usara el las siglas de cada pais por el momento seran pocos por motivos de prueba 
export const EQUIPOS_MUNDIAL = [
    { sigla: "MEX", categoriaId: "mexico" },
    { sigla: "ARG", categoriaId: "argentina" },
    { sigla: "BRA", categoriaId: "brasil" },
    { sigla: "ESP", categoriaId: "espana" },
];

// Devuelve la sección de una estampa según su número
function seccionDe(numero) {
    if (numero === NUM_ESCUDO) return "Escudo";
    if (numero === NUM_FOTO) return "Foto de equipo";
    return "Jugador";
}

function generarEquipo({ sigla, categoriaId }) {
    const estampas = [];
    for (let numero = 1; numero <= ESTAMPAS_POR_EQUIPO; numero++) {
    const seccion = seccionDe(numero);
    estampas.push({
        id: `wc2026-${sigla}-${numero}`,
        nombre: `${sigla} ${numero}`,   
        categoriaId,
        estado: "faltante",
        puntuacion: null,
        notas: "",
        atributos: {
        numero,
        seccion,
        sigla,
        rareza: seccion === "Escudo" ? "rara" : "común",
        repetida: false,
        pegada: false,
        },
        activo: true,
    });
    }
    return estampas;
}

export function generarSetMundial() {
    return EQUIPOS_MUNDIAL.flatMap(generarEquipo);
}