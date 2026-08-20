const path = require("path");
const AdaptadorCSVEditorial = require("../src/Exportadores/adaptadorCSVEditorial");

console.log("======================================");
console.log("PRUEBA CONTROLADA — ADAPTADOR CSV");
console.log("HOGAR ARAQUE");
console.log("======================================");

const rutaEntrada = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Araque",
    "Historias+de+Transformación (10).csv"
);

const rutaSalida = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Araque",
    "salida",
    "Hogar_Araque_EDITORIAL.csv"
);

const adaptador = new AdaptadorCSVEditorial();

const resultado = adaptador.exportar({
    rutaEntrada,
    rutaSalida,
    proyecto: {
        nombre: "Hogar Araque"
    },
    camposEditoriales: {
        codigo: "MUB-HA-001",
        seoTitle: "Hogar Araque: diseño residencial en Bogotá",
        metaDescription: "Intervención residencial en Bogotá con diseño contemporáneo, madera natural e iluminación mixta para un ambiente de calma, orden y calidez.",
        slug: "hogar-araque"
    }
});

console.log("======================================");
console.log("RESULTADO");
console.log("======================================");
console.log(JSON.stringify(resultado, null, 2));
console.log("");
console.log("NOTA: esta prueba no llama a IA.");
console.log("Historia, Hero Texto y Descripción quedan fuera hasta cerrar su contrato semántico.");
console.log("El CSV original no se modifica.");
