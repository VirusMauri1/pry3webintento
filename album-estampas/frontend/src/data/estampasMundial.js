const ESTAMPAS_POR_EQUIPO = 20;
const NUM_ESCUDO = 1;
const NUM_FOTO = 13;

// Version del set — cambia este número para forzar un reset del localStorage
const SET_VERSION = "wc2026-v2";

export const EQUIPOS_MUNDIAL = [
  // CONMEBOL
  { sigla: "ARG", categoriaId: "argentina" },
  { sigla: "BRA", categoriaId: "brasil" },
  { sigla: "URU", categoriaId: "uruguay" },
  { sigla: "COL", categoriaId: "colombia" },
  { sigla: "ECU", categoriaId: "ecuador" },
  { sigla: "PAR", categoriaId: "paraguay" },
  { sigla: "CHI", categoriaId: "chile" },
  { sigla: "BOL", categoriaId: "bolivia" },
  { sigla: "VEN", categoriaId: "venezuela" },
  { sigla: "PER", categoriaId: "peru" },

  // CONCACAF
  { sigla: "MEX", categoriaId: "mexico" },
  { sigla: "USA", categoriaId: "estados-unidos" },
  { sigla: "CAN", categoriaId: "canada" },
  { sigla: "CRC", categoriaId: "costa-rica" },
  { sigla: "JAM", categoriaId: "jamaica" },
  { sigla: "PAN", categoriaId: "panama" },

  // UEFA
  { sigla: "ESP", categoriaId: "espana" },
  { sigla: "FRA", categoriaId: "francia" },
  { sigla: "ENG", categoriaId: "inglaterra" },
  { sigla: "GER", categoriaId: "alemania" },
  { sigla: "POR", categoriaId: "portugal" },
  { sigla: "NED", categoriaId: "holanda" },
  { sigla: "BEL", categoriaId: "belgica" },
  { sigla: "ITA", categoriaId: "italia" },
  { sigla: "CRO", categoriaId: "croacia" },
  { sigla: "SUI", categoriaId: "suiza" },
  { sigla: "DEN", categoriaId: "dinamarca" },
  { sigla: "AUT", categoriaId: "austria" },
  { sigla: "SCO", categoriaId: "escocia" },
  { sigla: "HUN", categoriaId: "hungria" },
  { sigla: "SRB", categoriaId: "serbia" },
  { sigla: "POL", categoriaId: "polonia" },
  { sigla: "UKR", categoriaId: "ucrania" },
  { sigla: "TUR", categoriaId: "turquia" },
  { sigla: "SVK", categoriaId: "eslovaquia" },
  { sigla: "SVN", categoriaId: "eslovenia" },
  { sigla: "GRE", categoriaId: "grecia" },
  { sigla: "ALB", categoriaId: "albania" },
  { sigla: "ROU", categoriaId: "rumania" },
  { sigla: "CZE", categoriaId: "republica-checa" },
  { sigla: "GEO", categoriaId: "georgia" },

  // CAF
  { sigla: "MAR", categoriaId: "marruecos" },
  { sigla: "SEN", categoriaId: "senegal" },
  { sigla: "CMR", categoriaId: "camerun" },
  { sigla: "EGY", categoriaId: "egipto" },
  { sigla: "NGA", categoriaId: "nigeria" },
  { sigla: "CIV", categoriaId: "costa-marfil" },
  { sigla: "GHA", categoriaId: "ghana" },
  { sigla: "TUN", categoriaId: "tunisia" },
  { sigla: "MLI", categoriaId: "mali" },

  // AFC
  { sigla: "JPN", categoriaId: "japon" },
  { sigla: "KOR", categoriaId: "corea" },
  { sigla: "AUS", categoriaId: "australia" },
  { sigla: "IRN", categoriaId: "iran" },
  { sigla: "SAU", categoriaId: "arabia" },
  { sigla: "QAT", categoriaId: "qatar" },
  { sigla: "IRQ", categoriaId: "irak" },
  { sigla: "JOR", categoriaId: "jordania" },
  { sigla: "UZB", categoriaId: "uzbekistan" },

  // OFC
  { sigla: "NZL", categoriaId: "nueva-zelanda" },
];

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
  // Si la versión guardada es distinta, limpia el localStorage y regenera
  const versionGuardada = localStorage.getItem("set_version");
  if (versionGuardada !== SET_VERSION) {
    localStorage.removeItem("items");
    localStorage.removeItem("registros");
    localStorage.setItem("set_version", SET_VERSION);
  }
  return EQUIPOS_MUNDIAL.flatMap(generarEquipo);
}