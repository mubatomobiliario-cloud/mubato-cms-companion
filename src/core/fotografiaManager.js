console.log("fotografiaManager.js cargado");

const fs = require("fs");
const path = require("path");

const Fotografia = require("./fotografia");

class FotografiaManager {

    constructor() {

        this.carpeta = "";
        this.fotografias = [];

    }

    cargarCarpeta(carpeta) {

        this.carpeta = carpeta;

        this.fotografias = [];

        const archivos = fs.readdirSync(carpeta);

        archivos.forEach(archivo => {

            const extension = path.extname(archivo).toLowerCase();

            // Solo imágenes
            if (
                extension !== ".jpg" &&
                extension !== ".jpeg" &&
                extension !== ".png" &&
                extension !== ".webp"
            ) {
                return;
            }

            const rutaCompleta = path.join(
                carpeta,
                archivo
            );

            const estadisticas = fs.statSync(
                rutaCompleta
            );

            const foto = new Fotografia();

            foto.nombre = archivo;

            foto.ruta = rutaCompleta;

            foto.extension = extension;

            foto.tamano = estadisticas.size;

            // Se completarán más adelante
            foto.ancho = 0;
            foto.alto = 0;
            foto.orientacion = "";

            this.fotografias.push(foto);

        });

    }

    obtenerTodas() {

        return this.fotografias;

    }

    obtener(indice) {

        return this.fotografias[indice];

    }

    cantidad() {

        return this.fotografias.length;

    }

    limpiar() {

        this.fotografias = [];

    }

}

module.exports = FotografiaManager;