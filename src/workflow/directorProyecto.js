console.log("directorProyecto.js cargado");

const AnalizadorFotografias = require("../vision/analizadorFotografias");
const ExpedienteProyecto = require("../direccionEditorial/expedienteProyecto");
const DirectorEditorial = require("../direccionEditorial/directorEditorial");
const ActualizadorCSV = require("../Exportadores/actualizadorCSV");
const ExportadorEditorial = require("../Exportadores/exportadorEditorial");

class DirectorProyecto {

    constructor() {

        this.vision = new AnalizadorFotografias();

        this.expedienteProyecto = new ExpedienteProyecto();

        this.directorEditorial = new DirectorEditorial();

        this.actualizadorCSV = new ActualizadorCSV();

        this.exportadorEditorial = new ExportadorEditorial();

    }

    async ejecutar(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("DIRECTOR DEL PROYECTO");
        console.log("======================================");
        console.log("");

        //--------------------------------------------------
        // 1. Analizar fotografías
        //--------------------------------------------------

        console.log("1. Analizando fotografías...");

        proyecto = await this.vision.analizar(proyecto);

        console.log("✓ Fotografías analizadas.");
        console.log("");

        //--------------------------------------------------
        // 2. Construir expediente
        //--------------------------------------------------

        console.log("2. Construyendo expediente...");

        proyecto.expediente = this.expedienteProyecto.construir(proyecto);

        console.log("✓ Expediente construido.");
        console.log("");

        //--------------------------------------------------
        // 3. Generar Hero
        //--------------------------------------------------

        console.log("3. Generando Hero...");

        proyecto = await this.directorEditorial.generarHero(proyecto);

        console.log("✓ Hero generado.");
        console.log("");

        //--------------------------------------------------
        // 4. Actualizar CSV
        //--------------------------------------------------

        console.log("4. Actualizando CSV...");

        this.actualizadorCSV.actualizar(

            proyecto.rutaCSV,

            proyecto

        );

        console.log("✓ CSV actualizado.");
        console.log("");

        //--------------------------------------------------
        // 5. Exportar Expediente Editorial
        //--------------------------------------------------

        console.log("5. Exportando Expediente Editorial...");

        this.exportadorEditorial.exportar(

            proyecto

        );

        console.log("✓ Expediente Editorial exportado.");
        console.log("");

        //--------------------------------------------------
        // Fin
        //--------------------------------------------------

        console.log("======================================");
        console.log("PROCESO FINALIZADO");
        console.log("======================================");
        console.log("");

        return proyecto;

    }

}

module.exports = DirectorProyecto;