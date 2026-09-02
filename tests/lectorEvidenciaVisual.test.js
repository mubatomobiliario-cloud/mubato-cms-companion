const assert = require("assert");
const path = require("path");
const LectorEvidenciaVisual = require("../src/core/lectorEvidenciaVisual");

const rutaFixture = path.join(__dirname, "fixtures", "evidencia-visual-v21.fixture.json");

const lector = new LectorEvidenciaVisual();
const evidencia = lector.cargar(rutaFixture);

assert.strictEqual(evidencia.version, "V2.1");
assert.ok(evidencia.proyecto);
assert.ok(Array.isArray(evidencia.observacionesVision));
assert.strictEqual(evidencia.observacionesVision.length, 2);

const originales = JSON.stringify(evidencia.observacionesVision);
const observaciones = lector.extraerObservaciones(evidencia);

assert.deepStrictEqual(observaciones, evidencia.observacionesVision);
assert.strictEqual(JSON.stringify(evidencia.observacionesVision), originales);
assert.notStrictEqual(observaciones, evidencia.observacionesVision);

observaciones[0].espacio = "MODIFICADO_EN_PRUEBA";
assert.strictEqual(evidencia.observacionesVision[0].espacio, "sala");

assert.throws(
    () => lector.cargar(path.join(__dirname, "fixtures", "archivo-inexistente.json")),
    /No existe el archivo/
);

console.log("✓ LectorEvidenciaVisual: prueba funcional aislada OK");
