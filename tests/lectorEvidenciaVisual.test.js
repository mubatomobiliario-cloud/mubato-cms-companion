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
assert.notStrictEqual(observaciones[0], evidencia.observacionesVision[0]);
assert.notStrictEqual(observaciones[0].materiales, evidencia.observacionesVision[0].materiales);
assert.notStrictEqual(observaciones[0].elementos, evidencia.observacionesVision[0].elementos);

observaciones[0].espacio = "MODIFICADO_EN_PRUEBA";
observaciones[0].materiales.push("MATERIAL_INVENTADO_EN_PRUEBA");
observaciones[0].elementos.pop();

assert.strictEqual(evidencia.observacionesVision[0].espacio, "sala");
assert.deepStrictEqual(evidencia.observacionesVision[0].materiales, ["madera", "melamina"]);
assert.deepStrictEqual(evidencia.observacionesVision[0].elementos, ["televisor", "mueble bajo", "repisas"]);
assert.strictEqual(JSON.stringify(evidencia.observacionesVision), originales);

assert.throws(
    () => lector.cargar(path.join(__dirname, "fixtures", "archivo-inexistente.json")),
    /No existe el archivo/
);

console.log("✓ LectorEvidenciaVisual: contrato de aislamiento superado");
