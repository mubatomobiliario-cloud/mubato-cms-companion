const path = require("path");

const FotografiaManager = require("../src/core/fotografiaManager");

const manager = new FotografiaManager();

const carpeta = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Andrés Giraldo"
);

manager.cargarCarpeta(carpeta);

console.log("");

console.log("Fotografías encontradas:");

console.log(manager.cantidad());

console.log("");

manager.obtenerTodas().forEach(foto => {

    console.log("-------------------------");

    console.log("Nombre:", foto.nombre);

    console.log("Extensión:", foto.extension);

    console.log("Peso:", foto.tamano);

    console.log("Ancho:", foto.ancho);

    console.log("Alto:", foto.alto);

    console.log("Orientación:", foto.orientacion);

});