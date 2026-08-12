console.log("clasificadorFotografias.js cargado");

class ClasificadorFotografias {

    clasificar(proyecto) {

        proyecto.obtenerFotografias().forEach(foto => {

            if (foto.ancho > foto.alto) {

                foto.orientacion = "horizontal";

            } else if (foto.alto > foto.ancho) {

                foto.orientacion = "vertical";

            } else {

                foto.orientacion = "cuadrada";

            }

        });

        return proyecto;

    }

}

module.exports = ClasificadorFotografias;