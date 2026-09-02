const assert = require("assert");
const fs = require("fs");
const path = require("path");
const LectorEvidenciaVisual = require("../src/core/lectorEvidenciaVisual");
const ConstructorContextoPortfolio = require("../src/portfolio/constructorContextoPortfolio");
const ContratoPortfolio = require("../src/portfolio/contratos/contratoPortfolio");

const rutaFixture = path.join(__dirname, "fixtures", "evidencia-visual-v21.fixture.json");
const contenidoOriginal = fs.readFileSync(rutaFixture, "utf8");

const lector = new LectorEvidenciaVisual();
const evidencia = lector.cargar(rutaFixture);
const observaciones = lector.extraerObservaciones(evidencia);

const portfolio = {
    nombre: evidencia.proyecto.nombre,
    codigo: evidencia.proyecto.codigo,
    categoria: evidencia.proyecto.categoria,
    ciudad: evidencia.proyecto.ciudad,
    cliente: evidencia.proyecto.cliente,
    descripcion: "Centros de entretenimiento",
    espacios: ["sala"],
    servicios: ["diseño de mobiliario"],
    anio: "2026"
};

const contexto = new ConstructorContextoPortfolio().construir(portfolio, observaciones);

assert.ok(contexto.includes("CONTEXTO EDITORIAL PORTFOLIO"));
assert.ok(contexto.includes("EVIDENCIA VISUAL PERSISTIDA"));
assert.ok(contexto.includes("Fotografías recibidas: 2"));
assert.ok(contexto.includes("Identificador: foto-01.jpg"));
assert.ok(contexto.includes("Identificador: foto-02.jpg"));
assert.ok(contexto.includes("La selección de fotografías no es una decisión de IA."));
assert.ok(contexto.includes("Hero Texto: 22–27 palabras."));

// Construcción de una muestra de comprensión basada exclusivamente en la evidencia fixture.
// El test no evalúa calidad literaria: verifica que el contrato puede recibir la
// estructura semántica que el contexto visual permite construir.
const comprension = {
    nucleo: "Sistema de entretenimiento integrado que articula pantalla, almacenamiento y composición de muro.",
    caracter: "Contemporáneo, ordenado y cálido.",
    materialidad: ["madera", "melamina", "vidrio"],
    funcionalidad: ["entretenimiento", "almacenamiento"],
    relacionesEspaciales: ["muro principal", "sala"],
    experiencia: "Integra tecnología y almacenamiento dentro de una composición visual limpia y amplia.",
    rasgosDiferenciales: ["integración", "continuidad visual", "combinación de materiales"],
    enfoqueNarrativo: "Contar cómo el centro de entretenimiento organiza la tecnología y el almacenamiento dentro del espacio."
};

assert.deepStrictEqual(
    comprension.materialidad.sort(),
    ["madera", "melamina", "vidrio"].sort()
);
assert.deepStrictEqual(
    comprension.funcionalidad.sort(),
    ["entretenimiento", "almacenamiento"].sort()
);

assert.doesNotThrow(() => ContratoPortfolio.validar(comprension));
const normalizada = ContratoPortfolio.normalizar(comprension);
assert.deepStrictEqual(normalizada, comprension);

// El contrato de comprensión no puede alterar la evidencia persistida.
assert.strictEqual(fs.readFileSync(rutaFixture, "utf8"), contenidoOriginal);
assert.deepStrictEqual(lector.extraerObservaciones(evidencia), observaciones);

console.log("✓ ContratoPortfolio: prueba contra evidencia visual fixture superada");
