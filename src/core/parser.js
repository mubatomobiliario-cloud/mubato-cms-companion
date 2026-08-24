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

    determinarTipoEditorial(fila) {

        const observaciones = fila["Observaciones"];

        return String(observaciones || "") === ""
            ? "PROYECTO"
            : "PORTFOLIO";

    }

    seleccionarFlujoEditorial(fila) {

        const tipoEditorial = this.determinarTipoEditorial(fila);

        return {
            tipoEditorial,
            flujoEditorial: tipoEditorial === "PROYECTO"
                ? "EDITORIAL_PROYECTO_V2.2"
                : "EDITORIAL_PORTFOLIO"
        };

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

        const seleccionEditorial =
            this.seleccionarFlujoEditorial(filaProyecto);

        console.log(`✓ Tipo editorial determinado: ${seleccionEditorial.tipoEditorial}`);
        console.log(`✓ Flujo editorial seleccionado: ${seleccionEditorial.flujoEditorial}`);

        const proyecto = this.proyectoManager.importarProyecto(

            filaProyecto,

            carpetaProyecto,

            rutaCSV

        );

        proyecto.tipoEditorial = seleccionEditorial.tipoEditorial;
        proyecto.flujoEditorial = seleccionEditorial.flujoEditorial;
        proyecto.observaciones = String(filaProyecto["Observaciones"] || "");

        return proyecto;

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
