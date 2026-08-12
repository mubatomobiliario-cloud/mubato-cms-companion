console.log("fotografia.js cargado");

class Fotografia {

    constructor() {

        // Archivo
        this.nombre = "";
        this.ruta = "";
        this.extension = "";
        this.tamano = 0;
        this.ancho = 0;
        this.alto = 0;
        this.orientacion = "";

        // Organización
        this.tipo = "desconocido";
        this.esHero = false;
        this.enGaleria = false;

        // Análisis IA
        this.espacio = "";
        this.estilo = "";
        this.materiales = [];
        this.colores = [];
        this.elementos = [];
        this.iluminacion = "";
        this.calidad = "";

        // Contenido editorial
        this.titulo = "";
        this.alt = "";
        this.descripcion = "";
        this.palabrasClave = [];
        this.nombreSEO = "";

        // Estado
        this.estado = "pendiente";
        this.analizada = false;
        this.aprobada = false;

    }

}

module.exports = Fotografia;