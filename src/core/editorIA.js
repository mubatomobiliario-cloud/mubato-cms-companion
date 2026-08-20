console.log("editorIA.js cargado");

const ExpedienteProyecto = require("../direccionEditorial/expedienteProyecto");

class EditorIA {

    constructor() {
        this.proyecto = null;
        this.expediente = null;
        this.expedienteProyecto = new ExpedienteProyecto();
    }

    async analizar(proyecto) {

        this.proyecto = proyecto;

        console.log("");
        console.log("======================================");
        console.log("EXPEDIENTE EDITORIAL MUBATO");
        console.log("======================================");
        console.log("");

        this.expediente = this.expedienteProyecto.construir(proyecto);

        this.mostrarResumen();

        console.log("");
        console.log("Expediente editorial preparado.");
        console.log("");

        return this.expediente;
    }

    crearExpediente() {
        if (!this.proyecto) {
            throw new Error("No hay proyecto cargado.");
        }

        this.expediente = this.expedienteProyecto.construir(this.proyecto);
        return this.expediente;
    }

    mostrarResumen() {

        if (!this.expediente) {
            return;
        }

        console.log("Hechos del proyecto");
        console.log("-------------------------");
        console.log(this.expediente.proyecto);

        console.log("");
        console.log("Selección editorial");
        console.log("-------------------------");
        console.log(
            "Hero:",
            this.expediente.seleccionEditorial.hero
                ? this.expediente.seleccionEditorial.hero.nombre
                : "NO"
        );
        console.log(
            "Galería:",
            this.expediente.seleccionEditorial.galeria.map(f => f.nombre)
        );

        console.log("");
        console.log("Observaciones Vision");
        console.log("-------------------------");
        console.log(
            "Fotografías observadas:",
            this.expediente.observacionesVision.filter(f => f.analizada).length,
            "/",
            this.expediente.observacionesVision.length
        );

    }

}

module.exports = EditorIA;
