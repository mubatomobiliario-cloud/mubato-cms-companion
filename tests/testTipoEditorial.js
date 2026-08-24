console.log("testTipoEditorial.js cargado");

const Parser = require("../src/core/parser");

const parser = new Parser();

const casos = [
    {
        nombre: "Observaciones vacías",
        fila: { Observaciones: "" },
        esperado: "PROYECTO"
    },
    {
        nombre: "Observaciones ausentes",
        fila: {},
        esperado: "PROYECTO"
    },
    {
        nombre: "Observaciones null",
        fila: { Observaciones: null },
        esperado: "PROYECTO"
    },
    {
        nombre: "Observaciones con un espacio",
        fila: { Observaciones: " " },
        esperado: "PORTFOLIO"
    },
    {
        nombre: "Observaciones con texto en español",
        fila: { Observaciones: "Portafolio" },
        esperado: "PORTFOLIO"
    },
    {
        nombre: "Observaciones con texto en inglés",
        fila: { Observaciones: "Portfolio" },
        esperado: "PORTFOLIO"
    },
    {
        nombre: "Observaciones con mayúsculas",
        fila: { Observaciones: "PORTAFOLIO" },
        esperado: "PORTFOLIO"
    }
];

console.log("");
console.log("======================================");
console.log("PRUEBA — BIFURCACIÓN TIPO EDITORIAL");
console.log("======================================");
console.log("");

for (const caso of casos) {
    const resultado = parser.determinarTipoEditorial(caso.fila);

    if (resultado !== caso.esperado) {
        throw new Error(
            `${caso.nombre}: esperado ${caso.esperado}, obtenido ${resultado}.`
        );
    }

    console.log(`✓ ${caso.nombre}: ${resultado}`);
}

console.log("");
console.log("--------------------------------------");
console.log("PRUEBA SUPERADA");
console.log("--------------------------------------");
console.log("");
console.log("✓ Regla única verificada:");
console.log("  Observaciones vacía → PROYECTO");
console.log("  Observaciones no vacía → PORTFOLIO");
console.log("✓ No se interpreta el contenido de Observaciones.");
console.log("✓ No se normalizan mayúsculas, idioma ni espacios.");
console.log("");
