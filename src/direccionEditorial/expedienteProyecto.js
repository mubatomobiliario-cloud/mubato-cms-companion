console.log("expedienteProyecto.js cargado");

class ExpedienteProyecto {

    construir(proyecto) {

        console.log("");
        console.log("======================================");
        console.log("EXPEDIENTE DEL PROYECTO");
        console.log("======================================");
        console.log("");

        const expediente = {

            proyecto: proyecto.nombre,

            cliente: proyecto.cliente,

            ciudad: proyecto.ciudad,

            categoria: proyecto.categoria,

            espacios: this.obtenerEspacios(proyecto),

            materiales: this.obtenerMateriales(proyecto),

            colores: this.obtenerColores(proyecto),

            elementos: this.obtenerElementos(proyecto),

            estilos: this.obtenerEstilos(proyecto),

            iluminacion: this.obtenerIluminacion(proyecto),

            sensaciones: this.obtenerSensaciones(proyecto)

        };

        console.log("✓ Expediente construido.");
        console.log("");

        return expediente;

    }

    obtenerEspacios(proyecto) {

        return this.unicos(

            proyecto.fotografias.map(f => f.espacio)

        );

    }

    obtenerMateriales(proyecto) {

        return this.unicos(

            proyecto.fotografias.flatMap(f => f.materiales || [])

        );

    }

    obtenerColores(proyecto) {

        return this.unicos(

            proyecto.fotografias.flatMap(f => f.colores || [])

        );

    }

    obtenerElementos(proyecto) {

        return this.unicos(

            proyecto.fotografias.flatMap(f => f.elementos || [])

        );

    }

    obtenerEstilos(proyecto) {

        return this.unicos(

            proyecto.fotografias.map(f => f.estilo)

        );

    }

    obtenerIluminacion(proyecto) {

        return this.unicos(

            proyecto.fotografias.map(f => f.iluminacion)

        );

    }

    obtenerSensaciones(proyecto) {

        return this.unicos(

            proyecto.fotografias.map(f => f.sensacion)

        );

    }

    unicos(lista) {

        return [...new Set(

            lista
                .filter(Boolean)
                .map(item => String(item).trim())

        )];

    }

}

module.exports = ExpedienteProyecto;