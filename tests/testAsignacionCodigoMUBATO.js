console.log("======================================");
console.log("MUBATO — TEST ASIGNACIÓN CÓDIGO");
console.log("======================================");

const assert = require("assert");

const Parser = require("../src/core/parser");

console.log("");
console.log("1. CREANDO FILA PENDIENTE...");

const parser = new Parser();

const fila = {
    "Proyecto": "Hogar Araque",
    "Código MUBATO": "",
    "Cliente": "Cliente de control",
    "Ciudad": "Bogotá"
};

assert.strictEqual(
    fila["Código MUBATO"],
    "",
    "La fila de prueba debe comenzar sin Código MUBATO."
);

console.log("✓ Fila inicialmente pendiente.");

console.log("");
console.log("2. ASIGNANDO CÓDIGO...");

const codigo = parser.asignarCodigoMUBATO(fila);

console.log(`✓ Código recibido: ${codigo}`);

console.log("");
console.log("3. VALIDANDO FORMATO...");

assert.match(
    codigo,
    /^MUB-\d{8}-\d{6}$/,
    `Formato de Código MUBATO inválido: ${codigo}`
);

console.log("✓ Formato válido: MUB-YYYYMMDD-HHMMSS.");

console.log("");
console.log("4. VALIDANDO ESCRITURA EN LA FILA...");

assert.strictEqual(
    fila["Código MUBATO"],
    codigo,
    "El código no fue escrito en la fila."
);

console.log("✓ Código escrito en la fila.");

console.log("");
console.log("5. VALIDANDO NO REGENERACIÓN...");

const segundoCodigo =
    parser.asignarCodigoMUBATO(fila);

assert.strictEqual(
    segundoCodigo,
    codigo,
    "Un código existente no debe ser reemplazado."
);

assert.strictEqual(
    fila["Código MUBATO"],
    codigo,
    "La fila no conservó el código existente."
);

console.log("✓ Código existente conservado.");

console.log("");
console.log("======================================");
console.log("PRUEBA SUPERADA");
console.log("======================================");

console.log("");
console.log("✓ Fila pendiente identificable.");
console.log("✓ Código generado por la App.");
console.log("✓ Sin IA.");
console.log("✓ Código escrito en la fila.");
console.log("✓ Formato MUB-YYYYMMDD-HHMMSS.");
console.log("✓ Código existente no se sobrescribe.");
console.log("");
