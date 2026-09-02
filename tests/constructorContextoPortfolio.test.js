const assert = require("assert");
const path = require("path");
const LectorEvidenciaVisual = require("../src/core/lectorEvidenciaVisual");
const ConstructorContextoPortfolio = require("../src/portfolio/constructorContextoPortfolio");

const rutaFixture = path.join(__dirname, "fixtures", "evidencia-visual-v21.fixture.json");
const lector = new LectorEvidenciaVisual();
const evidencia = lector.cargar(rutaFixture);
const observaciones = lector.extraerObservaciones(evidencia);

const constructor = new ConstructorContextoPortfolio();
const contexto = constructor.construir({
    nombre: "Centros de entretenimiento",
    codigo: "PortafolioMUBATO_001",
    categoria: "Centros de Entretenimiento",
    descripcion: "Soluciones de mobiliario para integrar entretenimiento, almacenamiento y composición visual.",
    ciudad: "Bogotá",
    servicios: ["Diseño", "Fabricación", "Instalación"]
}, observaciones);

assert.ok(contexto.includes("EVIDENCIA VISUAL PERSISTIDA"));
assert.ok(contexto.includes("Fotografías recibidas: 2"));
assert.ok(contexto.includes("Fotografía 1"));
assert.ok(contexto.includes("Fotografía 2"));
assert.ok(contexto.includes("Identificador: foto-001"));
assert.ok(contexto.includes("Material: madera"));
assert.ok(contexto.includes("REGLAS DE INTERPRETACIÓN"));
assert.ok(contexto.includes("Hero Texto: 22–27 palabras."));

assert.throws(
    () => constructor.construir({}, null),
    /observacionesVision deben recibirse como arreglo/
);

console.log("✓ ConstructorContextoPortfolio: contrato de evidencia aislado definido");
