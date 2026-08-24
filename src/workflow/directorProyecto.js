console.log("directorProyecto.js cargado");

const path = require("path");

const AnalizadorFotografias = require("../vision/analizadorFotografias");
const ExpedienteProyecto = require("../direccionEditorial/expedienteProyecto");
const ExportadorEditorial = require("../Exportadores/exportadorEditorial");
const ProcesadorEditorialV2 = require("../Editorial/procesadorEditorialV2");
const SalidaEditorialCSV = require("../Exportadores/salidaEditorialCSV");

class DirectorProyecto {

    constructor({
        vision = new AnalizadorFotografias(),
        expedienteProyecto = new ExpedienteProyecto(),
        exportadorEditorial = new ExportadorEditorial(),
        procesadorEditorialProyecto = new ProcesadorEditorialV2(),
        salidaEditorialCSV = new SalidaEditorialCSV()
    } = {}) {
        this.vision = vision;
        this.expedienteProyecto = expedienteProyecto;
        this.exportadorEditorial = exportadorEditorial;
        this.procesadorEditorialProyecto = procesadorEditorialProyecto;
        this.salidaEditorialCSV = salidaEditorialCSV;
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
        console.log("✓ Evidencia visual disponible para Editorial Proyecto V2.2.");
        console.log("");

        console.log("======================================");
        console.log("ANÁLISIS DEL PROYECTO FINALIZADO");
        console.log("======================================");
        console.log("");

        return proyecto;
    }

    seleccionarEjecutorEditorial(proyecto) {
        if (proyecto.flujoEditorial === "EDITORIAL_PROYECTO_V2.2") {
            return "PROYECTO";
        }

        if (proyecto.flujoEditorial === "EDITORIAL_PORTFOLIO") {
            return "PORTFOLIO";
        }

        throw new Error(
            `Flujo editorial desconocido: ${proyecto.flujoEditorial || "(sin definir)"}.`
        );
    }

    construirRutaSalidaEditorial(proyecto) {
        if (!proyecto.rutaCSV) {
            throw new Error("El proyecto no tiene rutaCSV para generar la salida editorial.");
        }

        const extension = path.extname(proyecto.rutaCSV);
        const base = proyecto.rutaCSV.slice(0, -extension.length);
        return `${base}.salida-editorial-proyecto-v2.csv`;
    }

    async ejecutar(proyecto) {
        console.log("");
        console.log("======================================");
        console.log("DIRECTOR DEL PROYECTO");
        console.log("======================================");
        console.log("");

        const ejecutor = this.seleccionarEjecutorEditorial(proyecto);
        console.log(`✓ Flujo editorial recibido: ${proyecto.flujoEditorial}`);
        console.log(`✓ Ejecutor seleccionado: ${ejecutor}`);
        console.log("");

        if (ejecutor === "PORTFOLIO") {
            throw new Error(
                "EDITORIAL_PORTFOLIO está seleccionado correctamente, pero su pipeline todavía no está conectado. No se ejecutará Editorial Proyecto V2.2 por esta rama."
            );
        }

        //--------------------------------------------------
        // 1. Analizar fotografías y construir evidencia
        //--------------------------------------------------
        proyecto = await this.analizar(proyecto);

        //--------------------------------------------------
        // 2. Editorial Proyecto V2.2
        //--------------------------------------------------
        console.log("4. Ejecutando Editorial Proyecto V2.2...");

        if (!proyecto.filaCSV) {
            throw new Error("El proyecto no conserva la fila CSV original necesaria para Editorial Proyecto V2.2.");
        }

        const resultadoEditorial = await this.procesadorEditorialProyecto.generar(
            proyecto.filaCSV,
            {
                evidenciaVisual: proyecto.expediente.observacionesVision
            }
        );

        console.log("✓ Editorial Proyecto V2.2 completada.");
        console.log("");

        //--------------------------------------------------
        // 3. Salida Editorial CSV
        //--------------------------------------------------
        console.log("5. Generando salida editorial CSV...");

        const rutaSalida = this.construirRutaSalidaEditorial(proyecto);
        const salida = this.salidaEditorialCSV.exportar({
            rutaEntrada: proyecto.rutaCSV,
            rutaSalida,
            filaProyecto: proyecto.filaCSV,
            editorial: {
                codigo: resultadoEditorial.codigo,
                heroTexto: resultadoEditorial.heroTexto,
                historia: resultadoEditorial.historia,
                descripcion: resultadoEditorial.descripcion,
                servicios: resultadoEditorial.servicios,
                slug: resultadoEditorial.slug,
                seoTitle: resultadoEditorial.seo.seoTitle,
                metaDescription: resultadoEditorial.seo.metaDescription
            }
        });

        console.log("✓ Salida Editorial CSV generada.");
        console.log(`✓ Archivo: ${salida.rutaSalida}`);
        console.log("");

        return {
            ...proyecto,
            resultadoEditorial,
            salidaEditorialCSV: salida
        };
    }
}

module.exports = DirectorProyecto;
