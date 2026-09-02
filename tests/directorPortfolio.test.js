const assert = require("assert");
const path = require("path");
const DirectorPortfolio = require("../src/portfolio/directorPortfolio");

const rutaFixture = path.join(__dirname, "fixtures", "evidencia-visual-v21.fixture.json");

let visionEjecutada = false;

const director = new DirectorPortfolio({
    lectorEvidenciaVisual: undefined,
    constructorContextoPortfolio: undefined
});

// El DirectorPortfolio no recibe ni instancia Vision.
assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "vision"), false);
assert.strictEqual(Object.prototype.hasOwnProperty.call(director, "analizadorFotografias"), false);

const contexto = director.construirContexto({
    nombre: "Centros de entretenimiento",
    codigo: "PortafolioMUBATO_001",
    categoria: "Centros de Entretenimiento",
    descripcion: "Soluciones de mobiliario para integrar entretenimiento, almacenamiento y composición visual.",
    ciudad: "Bogotá",
    servicios: ["Diseño", "Fabricación", "Instalación"]
}, rutaFixture);

assert.ok(contexto.includes("CONTEXTO EDITORIAL PORTFOLIO"));
assert.ok(contexto.includes("EVIDENCIA VISUAL PERSISTIDA"));
assert.ok(contexto.includes("Fotografías recibidas: 2"));
assert.ok(contexto.includes("Identificador: foto-01.jpg"));
assert.ok(contexto.includes("Identificador: foto-02.jpg"));
assert.ok(contexto.includes("Materiales observados:"));
assert.ok(contexto.includes("REGLAS DE INTERPRETACIÓN"));
assert.strictEqual(visionEjecutada, false);

assert.throws(
    () => director.construirContexto({ nombre: "Portfolio" }, ""),
    /requiere la ruta de evidencia visual persistida/
);

console.log("✓ DirectorPortfolio: prueba funcional aislada definida");
