console.log("editorIA.js cargado");

class EditorIA {

    constructor() {

        this.proyecto = null;
        this.expediente = null;

    }

    async analizar(proyecto) {

        this.proyecto = proyecto;

        console.log("");
        console.log("======================================");
        console.log("EDITOR IA MUBATO");
        console.log("======================================");
        console.log("");

        this.crearExpediente();

        this.mostrarResumen();

        console.log("");
        console.log("Expediente editorial preparado.");
        console.log("");

        return this.expediente;

    }

    crearExpediente() {

        this.expediente = {

            proyecto: {

                nombre: this.proyecto.nombre,

                codigo: this.proyecto.codigo,

                cliente: this.proyecto.cliente,

                ciudad: this.proyecto.ciudad,

                estado: this.proyecto.estado,

                categoria: this.proyecto.categoria,

                servicios: this.proyecto.servicios,

                espacios: this.proyecto.espacios

            },

            fotografias: []

        };

        this.proyecto.listaFotografias.forEach(foto => {

            this.expediente.fotografias.push({

                nombre: foto.nombre,

                ruta: foto.ruta,

                extension: foto.extension,

                tamano: foto.tamano,

                ancho: foto.ancho,

                alto: foto.alto,

                orientacion: foto.orientacion,

                esHero: foto.esHero,

                enGaleria: foto.enGaleria

            });

        });

    }

    mostrarResumen() {

        console.log("Proyecto");

        console.log("-------------------------");

        console.log(this.expediente.proyecto);

        console.log("");

        console.log("Fotografías");

        console.log("-------------------------");

        this.expediente.fotografias.forEach((foto, indice) => {

            console.log(

                `${indice + 1}. ${foto.nombre}`

            );

        });

        console.log("");

        console.log(

            "Total fotografías:",

            this.expediente.fotografias.length

        );

    }

}

module.exports = EditorIA;