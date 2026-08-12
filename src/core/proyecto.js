console.log("proyecto.js cargado");

class Proyecto {

    constructor() {

        //==================================================
        // Ubicación
        //==================================================

        this.rutaProyecto = "";
        this.rutaCSV = "";

        //==================================================
        // Identificación
        //==================================================

        this.codigo = "";
        this.nombre = "";
        this.slug = "";

        //==================================================
        // Información general
        //==================================================

        this.cliente = "";
        this.ciudad = "";
        this.estado = "";
        this.categoria = "";

        //==================================================
        // Clasificación
        //==================================================

        this.servicios = [];
        this.espacios = [];

        //==================================================
        // Contenido Editorial
        //==================================================

        this.hero = "";
        this.historia = "";
        this.seoTitle = "";
        this.metaDescription = "";

        //==================================================
        // Fotografías
        //==================================================

        this.heroImagen = null;
        this.galeria = [];
        this.fotografias = [];

        //==================================================
        // Expediente
        //==================================================

        this.expediente = null;

    }

    agregarFotografia(fotografia) {

        this.fotografias.push(fotografia);

    }

    definirHero(fotografia) {

        this.heroImagen = fotografia;
        fotografia.esHero = true;

    }

    agregarGaleria(fotografia) {

        this.galeria.push(fotografia);
        fotografia.enGaleria = true;

    }

    obtenerHero() {

        return this.heroImagen;

    }

    obtenerGaleria() {

        return this.galeria;

    }

    obtenerFotografias() {

        return this.fotografias;

    }

    cantidadFotografias() {

        return this.fotografias.length;

    }

}

module.exports = Proyecto;