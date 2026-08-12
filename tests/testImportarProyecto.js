const path = require("path");

const Parser = require("../src/core/parser");

const parser = new Parser();

const carpetaProyecto = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Andrés Giraldo"
);

console.log("================================");
console.log("IMPORTANDO PROYECTO...");
console.log("================================");

const proyecto = parser.importarCarpeta(
    carpetaProyecto
);

console.log("");

console.log("Proyecto:");
console.log(proyecto.nombre);

console.log("");

console.log("Código:");
console.log(proyecto.codigo);

console.log("");

console.log("Fotografías:");
console.log(proyecto.cantidadFotografias());

console.log("");

console.log("================================");
console.log("PROYECTO IMPORTADO");
console.log("================================");