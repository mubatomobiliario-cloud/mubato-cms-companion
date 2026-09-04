const ConstructorContextoExpresionIndividualPortfolio = require("../src/portfolio/constructorContextoExpresionIndividualPortfolio");

const constructor = new ConstructorContextoExpresionIndividualPortfolio();

const comprension = {
    nucleo: "Colección residencial que integra entretenimiento, almacenamiento y vida cotidiana.",
    caracter: "Contemporáneo, cálido y sereno.",
    materialidad: "Madera y vidrio con acentos oscuros.",
    funcionalidad: "Organización de tecnología, almacenamiento y exhibición.",
    relacionesEspaciales: "Mobiliario integrado a muros, ventanas y mobiliario existente.",
    experiencia: "Orden, luminosidad, calma y lectura limpia.",
    rasgosDiferenciales: "Adaptabilidad residencial y equilibrio entre entretenimiento, almacenamiento y exhibición.",
    enfoqueNarrativo: "Mostrar soluciones de entretenimiento residenciales desde su relación con el espacio."
};

const observacion = {
    fotografia: "CentrosEntretenimiento_002.JPG",
    analizada: true,
    espacio: "Alcoba Infantil",
    tipo: "",
    plano: "General",
    estilo: "Contemporáneo",
    materiales: ["madera", "vidrio"],
    colores: ["blanco", "gris", "negro"],
    elementos: ["televisor", "escritorio", "silla", "máquina arcade", "estantería"],
    iluminacion: "Natural",
    sensacion: "Dinámica",
    observaciones: "Mueble de entretenimiento integrado con área de trabajo y elementos lúdicos.",
    confianza: 90
};

const portfolio = {
    nombre: "Centros de Entretenimiento",
    categoria: ["Residencial"],
    ciudad: "Bogotá",
    espacios: ["Sala", "Cocina", "Alcoba Principal", "Alcoba Infantil", "Estudio"],
    cliente: "Varios"
};

const contexto = constructor.construir(comprension, observacion, portfolio);

if (typeof contexto !== "string" || !contexto.trim()) {
    throw new Error("El constructor debe producir un contexto textual no vacío.");
}

const fragmentosRequeridos = [
    "CONTEXTO DE EXPRESIÓN INDIVIDUAL PORTFOLIO",
    "PIEZA / COLECCIÓN",
    "Centros de Entretenimiento",
    "Bogotá",
    "COMPRENSIÓN EDITORIAL CENTRAL",
    "Colección residencial que integra entretenimiento, almacenamiento y vida cotidiana.",
    "EVIDENCIA DE LA FOTOGRAFÍA",
    "CentrosEntretenimiento_002.JPG",
    "televisor",
    "máquina arcade",
    "REGLAS DE EXPRESIÓN INDIVIDUAL",
    "No decidir inclusión, selección ni orden de fotografías."
];

for (const fragmento of fragmentosRequeridos) {
    if (!contexto.includes(fragmento)) {
        throw new Error(`El contexto no contiene el fragmento requerido: ${fragmento}`);
    }
}

// Debe conservar la especificidad de la fotografía individual.
if (!contexto.includes("área de trabajo y elementos lúdicos")) {
    throw new Error("El contexto no conserva la observación específica de la fotografía.");
}

// Debe ser puro: no mutar entradas.
if (comprension.nucleo !== "Colección residencial que integra entretenimiento, almacenamiento y vida cotidiana.") {
    throw new Error("La comprensión central fue modificada.");
}
if (observacion.fotografia !== "CentrosEntretenimiento_002.JPG") {
    throw new Error("La observación fotográfica fue modificada.");
}
if (portfolio.nombre !== "Centros de Entretenimiento") {
    throw new Error("El Portfolio fue modificado.");
}

// La fotografía es obligatoria para trazabilidad.
let errorFotografia = false;
try {
    constructor.construir(comprension, { ...observacion, fotografia: "" }, portfolio);
} catch (error) {
    errorFotografia = true;
}
if (!errorFotografia) {
    throw new Error("El constructor debe rechazar una observación sin identificador de fotografía.");
}

console.log("✓ ConstructorContextoExpresionIndividualPortfolio: prueba estructural superada");
