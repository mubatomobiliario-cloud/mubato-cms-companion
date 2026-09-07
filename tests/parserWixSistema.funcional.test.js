const assert = require("assert");
const Parser = require("../src/core/parser");

const parser = new Parser();

const csvWix = [
    "Proyecto,PortafolioMUBATO,PortafolioMUBATO,Descripción,Código MUBATO,Observaciones",
    "Centros de Entretenimiento,/item/1,/list/1,Descripción de prueba,,Centros de Entretenimiento"
].join("\n");

const resultado = parser.prepararEncabezados(csvWix);

assert.deepStrictEqual(
    resultado.encabezados,
    ["Proyecto", "PortafolioMUBATO", "PortafolioMUBATO", "Descripción", "Código MUBATO", "Observaciones"]
);

assert.deepStrictEqual(
    [...resultado.columnasIgnoradas].sort((a, b) => a - b),
    [1, 2]
);

const filas = parser.leerCSV;
assert.strictEqual(typeof filas, "function");

const csvEditorialDuplicado = [
    "Proyecto,Descripción,Descripción,Código MUBATO,Observaciones",
    "Centros de Entretenimiento,A,B,,Centros de Entretenimiento"
].join("\n");

assert.throws(
    () => parser.prepararEncabezados(csvEditorialDuplicado),
    /encabezado editorial duplicado/i
);

const csvSinDuplicados = [
    "Proyecto,Descripción,Código MUBATO,Observaciones",
    "Centros de Entretenimiento,Descripción,,Centros de Entretenimiento"
].join("\n");

const limpio = parser.prepararEncabezados(csvSinDuplicados);
assert.deepStrictEqual(limpio.columnasIgnoradas, new Set());

console.log("✓ Parser: campos sistema Wix duplicados tolerados");
console.log("✓ Parser: duplicado editorial rechazado");
console.log("✓ Parser: CSV normal preservado");
