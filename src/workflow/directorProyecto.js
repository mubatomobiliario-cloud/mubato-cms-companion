console.log("directorProyecto.js cargado");

const AnalizadorFotografias = require("../vision/analizadorFotografias");
const ExpedienteProyecto = require("../direccionEditorial/expedienteProyecto");
const DirectorEditorial = require("../direccionEditorial/directorEditorial");
const ExportadorEditorial = require("../Exportadores/exportadorEditorial");

class DirectorProyecto {

    constructor() {

        this.vision = new AnalizadorFotografias();

        this.expedienteProyecto = new ExpedienteProyecto();

        this.directorEditorial = new DirectorEditorial();

        this.exportadorEditorial = new ExportadorEditorial();

    }

    async analizar(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("ANÁLISIS DEL PROYECTO");
        console.log("======================================");
        console.log("");

        console.log("1. Analizando fotografías...");

        proyecto = await this.vision.analizar(proyecto);

        console.log("✓ Fotografías analizadas.");
        console.log("");

        console.log("2. Construyendo expediente...");

        proyecto.expediente = this.expedienteProyecto.construir(proyecto);

        console.log("✓ Expediente construido.");
        console.log("");

        console.log("3. Persistiendo evidencia visual...");

        this.exportadorEditorial.persistirEvidenciaVisual(proyecto);

        console.log("✓ Evidencia visual disponible para Editorial V2.1.");
        console.log("");

        console.log("======================================");
        console.log("ANÁLISIS DEL PROYECTO FINALIZADO");
        console.log("======================================");
        console.log("");

        return proyecto;

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
        // 4. Exportar Expediente Editorial
        //--------------------------------------------------

        console.log("4. Exportando Expediente Editorial...");

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