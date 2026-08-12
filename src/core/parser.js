console.log("parser.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const ProyectoManager = require("./proyectoManager");

class Parser {

    constructor() {

        this.proyectoManager = new ProyectoManager();

    }

    leerCSV(rutaCSV) {

        const contenido = fs.readFileSync(
            rutaCSV,
            "utf8"
        );

        const resultado = Papa.parse(
            contenido,
            {
                header: true,
                skipEmptyLines: true
            }
        );

        return resultado.data;

    }

    buscarCSV(rutaCarpeta) {

        const archivos = fs.readdirSync(rutaCarpeta);

        const archivoCSV = archivos.find(archivo =>
            archivo.toLowerCase().endsWith(".csv")
        );

        if (!archivoCSV) {

            throw new Error(
                "No se encontró ningún archivo CSV en la carpeta."
            );

        }

        return path.join(
            rutaCarpeta,
            archivoCSV
        );

    }

    buscarProyectoPendiente(filas) {

        return filas.find(fila => {

            const codigo = fila["Código MUBATO"];

            return !codigo || codigo.trim() === "";

        });

    }

    importarProyecto(rutaCSV, carpetaProyecto) {

        const filas = this.leerCSV(rutaCSV);

        if (filas.length === 0) {

            throw new Error("El CSV está vacío.");

        }

        const filaProyecto =
            this.buscarProyectoPendiente(filas);

        if (!filaProyecto) {

            throw new Error(
                "No se encontró ningún proyecto pendiente."
            );

        }

        return this.proyectoManager.importarProyecto(

            filaProyecto,

            carpetaProyecto,

            rutaCSV

        );

    }

    importarCarpeta(rutaCarpeta) {

        const rutaCSV = this.buscarCSV(
            rutaCarpeta
        );

        return this.importarProyecto(

            rutaCSV,

            rutaCarpeta

        );

    }

}

module.exports = Parser;