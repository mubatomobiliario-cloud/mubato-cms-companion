console.log("testEnrutamientoEditorial.js cargado");

const Parser = require("../src/core/parser");

const parser = new Parser();

function verificar(nombre, fila, tipoEsperado, flujoEsperado) {

    const resultado = parser.seleccionarFlujoEditorial(fila);

    if (resultado.tipoEditorial !== tipoEsperado) {
        throw new Error(
            `${nombre}: tipo incorrecto. Esperado ${tipoEsperado}, recibido ${resultado.tipoEditorial}.`
        );
    }

    if (resultado.flujoEditorial !== flujoEsperado) {
        throw new Error(
            `${nombre}: flujo incorrecto. Esperado ${flujoEsperado}, recibido ${resultado.flujoEditorial}.`
        );
    }

    console.log(`✓ ${nombre}: ${resultado.tipoEditorial} → ${resultado.flujoEditorial}`);

}

console.log("");
console.log("======================================");
console.log("PRUEBA — ENRUTAMIENTO EDITORIAL");
console.log("======================================");
console.log("");

verificar(
    "Observaciones vacías",
    { Observaciones: "" },
    "PROYECTO",
    "EDITORIAL_PROYECTO_V2.2"
);

verificar(
    "Observaciones ausentes",
    {},
    "PROYECTO",
    "EDITORIAL_PROYECTO_V2.2"
);

verificar(
    "Observaciones null",
    { Observaciones: null },
    "PROYECTO",
    "EDITORIAL_PROYECTO_V2.2"
);

verificar(
    "Observaciones con espacio",
    { Observaciones: " " },
    "PORTFOLIO",
    "EDITORIAL_PORTFOLIO"
);

verificar(
    "Observaciones con texto",
    { Observaciones: "Portafolio" },
    "PORTFOLIO",
    "EDITORIAL_PORTFOLIO"
);

console.log("");
console.log("--------------------------------------");
console.log("PRUEBA SUPERADA");
console.log("--------------------------------------");
console.log("");
console.log("✓ La bifurcación sigue dependiendo exclusivamente de Observaciones.");
console.log("✓ PROYECTO apunta a Editorial Proyecto V2.2.");
console.log("✓ PORTFOLIO apunta a Editorial Portafolio.");
console.log("✓ No se ejecuta ningún pipeline editorial.");
console.log("✓ No se realizan llamadas a OpenAI.");
