const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const Parser = require("../src/core/parser");

const parser = new Parser();

function probarSistemaWixDuplicado(encabezado) {
    const csv = [
        `Proyecto,${encabezado},${encabezado},Descripción,Código MUBATO,Observaciones`,
        `Centros de Entretenimiento,A,B,Descripción de prueba,,Centros de Entretenimiento`
    ].join("\n");

    const resultado = parser.prepararEncabezados(csv);

    assert.deepStrictEqual(
        [...resultado.columnasIgnoradas].sort((a, b) => a - b),
        [1, 2],
        `El campo Wix "${encabezado}" debe ignorarse en todas sus posiciones repetidas.`
    );
}

[
    "PortafolioMUBATO",
    "Created Date",
    "Updated Date",
    "Owner"
].forEach(probarSistemaWixDuplicado);

const csvSistemaWixVariantes = [
    "Proyecto,PortafolioMUBATO (Item),PortafolioMUBATO (List),Descripción,Código MUBATO,Observaciones",
    "Centros de Entretenimiento,/item/1,/list/1,Descripción de prueba,,Centros de Entretenimiento"
].join("\n");

const variantes = parser.prepararEncabezados(csvSistemaWixVariantes);
assert.deepStrictEqual(
    variantes.columnasIgnoradas,
    new Set(),
    "Las variantes Item/List son campos de sistema conocidos, pero no son duplicados entre sí."
);

const csvHistoriasProtegidas = [
    "Proyecto,Historias de Transformación,Descripción,Historias de Transformación,Código MUBATO,Observaciones",
    "Centros de Entretenimiento,Historia A,Descripción de prueba,Historia B,,"
].join("\n");

const historias = parser.prepararEncabezados(csvHistoriasProtegidas);

assert.deepStrictEqual(
    historias.columnasIgnoradas,
    new Set(),
    "Historias de Transformación no debe ignorarse aunque aparezca dos veces."
);

assert.strictEqual(
    historias.encabezados.filter(encabezado => encabezado === "Historias de Transformación").length,
    2,
    "Las dos columnas protegidas deben permanecer presentes en la matriz original."
);

const csvHistoriasTriplicadas = [
    "Proyecto,Historias de Transformación,Descripción,Historias de Transformación,Código MUBATO,Historias de Transformación,Observaciones",
    "Centros de Entretenimiento,Historia A,Descripción de prueba,Historia B,,Historia C,"
].join("\n");

assert.throws(
    () => parser.prepararEncabezados(csvHistoriasTriplicadas),
    /debe aparecer exactamente 2 veces/i
);

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

const csvProteccionLectura = [
    "Proyecto,Historias de Transformación,Descripción,Historias de Transformación,Código MUBATO,Observaciones",
    "Centros de Entretenimiento,Historia A,Descripción de prueba,Historia B,,"
].join("\n");

const rutaTemporal = path.join(
    os.tmpdir(),
    `mubato-parser-historias-${Date.now()}.csv`
);

fs.writeFileSync(rutaTemporal, csvProteccionLectura, "utf8");

try {
    const filas = parser.leerCSV(rutaTemporal);

    assert.strictEqual(filas.length, 1);
    assert.strictEqual(
        filas[0]["Historias de Transformación"],
        "Historia B",
        "El Parser no debe alterar silenciosamente la semántica existente de objeto para encabezados duplicados protegidos."
    );
} finally {
    fs.unlinkSync(rutaTemporal);
}

console.log("✓ Parser: Created Date / Updated Date / Owner duplicados tolerados");
console.log("✓ Parser: PortafolioMUBATO duplicado tolerado");
console.log("✓ Parser: variantes Item/List reconocidas");
console.log("✓ Parser: Historias de Transformación ×2 protegidas");
console.log("✓ Parser: Historias de Transformación ×3 rechazadas");
console.log("✓ Parser: duplicado editorial no protegido rechazado");
console.log("✓ Parser: CSV normal preservado");
