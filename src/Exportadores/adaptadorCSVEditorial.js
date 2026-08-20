console.log("adaptadorCSVEditorial.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

class AdaptadorCSVEditorial {

    exportar({ rutaEntrada, rutaSalida, proyecto, camposEditoriales = {} }) {

        console.log("");
        console.log("======================================");
        console.log("ADAPTADOR CSV EDITORIAL V0.1");
        console.log("======================================");
        console.log("");

        if (!rutaEntrada) {
            throw new Error("Falta rutaEntrada.");
        }

        if (!rutaSalida) {
            throw new Error("Falta rutaSalida.");
        }

        if (!proyecto) {
            throw new Error("Falta proyecto.");
        }

        const contenido = fs.readFileSync(rutaEntrada, "utf8");
        const parsed = Papa.parse(contenido, {
            header: false,
            skipEmptyLines: true
        });

        if (parsed.errors.length > 0) {
            throw new Error(`Error leyendo CSV: ${JSON.stringify(parsed.errors)}`);
        }

        const filas = parsed.data;
        if (filas.length < 2) {
            throw new Error("El CSV no contiene filas de datos.");
        }

        const encabezados = filas[0];
        const filasDatos = filas.slice(1);

        const indice = this.crearIndiceEncabezados(encabezados);
        const nombreProyecto = proyecto.nombre || proyecto["Proyecto"];

        const fila = filasDatos.find(f => {
            const valor = this.valorPorCampo(f, indice, "Proyecto");
            return valor === nombreProyecto;
        });

        if (!fila) {
            throw new Error(`No se encontró el proyecto "${nombreProyecto}" en el CSV.`);
        }

        const cambiosPermitidos = {
            "Código MUBATO": camposEditoriales.codigo,
            "Hero Texto": camposEditoriales.heroTexto,
            "Descripción": camposEditoriales.descripcion,
            "SEO Title": camposEditoriales.seoTitle,
            "Meta Description": camposEditoriales.metaDescription,
            "Slug": camposEditoriales.slug
        };

        const cambiosAplicados = [];

        for (const [campo, valor] of Object.entries(cambiosPermitidos)) {
            if (valor === undefined || valor === null) continue;

            const posicion = indice.unicas[campo];
            if (posicion === undefined) {
                console.warn(`⚠ Campo no encontrado en CSV: ${campo}`);
                continue;
            }

            fila[posicion] = String(valor);
            cambiosAplicados.push(campo);
        }

        const salida = Papa.unparse([encabezados, ...filasDatos], {
            quotes: false
        });

        fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });
        fs.writeFileSync(rutaSalida, salida, "utf8");

        console.log(`✓ Proyecto localizado: ${nombreProyecto}`);
        console.log(`✓ Campos Companion actualizados: ${cambiosAplicados.length}`);
        console.log(`✓ CSV generado: ${rutaSalida}`);
        console.log("");

        return {
            rutaSalida,
            proyecto: nombreProyecto,
            camposActualizados: cambiosAplicados
        };
    }

    crearIndiceEncabezados(encabezados) {
        const todas = {};
        const unicas = {};

        encabezados.forEach((encabezado, posicion) => {
            if (!todas[encabezado]) todas[encabezado] = [];
            todas[encabezado].push(posicion);
        });

        for (const [encabezado, posiciones] of Object.entries(todas)) {
            if (posiciones.length === 1) {
                unicas[encabezado] = posiciones[0];
            }
        }

        return { todas, unicas };
    }

    valorPorCampo(fila, indice, campo) {
        const posicion = indice.unicas[campo];
        if (posicion === undefined) return "";
        return fila[posicion] || "";
    }
}

module.exports = AdaptadorCSVEditorial;
