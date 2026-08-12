console.log("actualizadorCSV.js cargado");

const fs = require("fs");
const Papa = require("papaparse");

class ActualizadorCSV {

    actualizar(rutaCSV, proyecto) {

        console.log("");
        console.log("======================================");
        console.log("ACTUALIZADOR CSV");
        console.log("======================================");
        console.log("");

        const filas = this.leerCSV(rutaCSV);

        const fila = this.buscarProyectoPendiente(filas);

        if (!fila) {

            throw new Error(
                "No se encontró ningún proyecto pendiente."
            );

        }

        this.actualizarFila(fila, proyecto);

        this.guardarCSV(

            rutaCSV,

            filas

        );

        console.log("✓ CSV actualizado.");
        console.log("");

    }

    //--------------------------------------------------
    // Leer CSV
    //--------------------------------------------------

    leerCSV(rutaCSV) {

        const contenido = fs.readFileSync(

            rutaCSV,

            "utf8"

        );

        const resultado = Papa.parse(

            contenido,

            {

                header: true,

                skipEmptyLines: true

            }

        );

        return resultado.data;

    }

    //--------------------------------------------------
    // Buscar proyecto pendiente
    //--------------------------------------------------

    buscarProyectoPendiente(filas) {

        return filas.find(fila => {

            const codigo = fila["Código MUBATO"];

            return !codigo || codigo.trim() === "";

        });

    }

    //--------------------------------------------------
    // Actualizar fila
    //--------------------------------------------------

    actualizarFila(fila, proyecto) {

        fila["Proyecto"] = proyecto.nombre;

        fila["Cliente"] = proyecto.cliente;

        fila["Ciudad"] = proyecto.ciudad;

        fila["Estado"] = proyecto.estado;

        fila["Categoría"] = proyecto.categoria;

        fila["Hero"] = proyecto.hero || "";

        fila["Historia"] = proyecto.historia || "";

        fila["Slug"] = proyecto.slug || "";

        // Más adelante...
        // SEO Title
        // Meta Description
        // Keywords
        // Hero Image
        // Galería
        // etc.

    }

    //--------------------------------------------------
    // Guardar CSV
    //--------------------------------------------------

    guardarCSV(rutaCSV, filas) {

        const csv = Papa.unparse(filas);

        fs.writeFileSync(

            rutaCSV,

            csv,

            "utf8"

        );

    }

}

module.exports = ActualizadorCSV;