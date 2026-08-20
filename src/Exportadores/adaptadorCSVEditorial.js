console.log("adaptadorCSVEditorial.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

class AdaptadorCSVEditorial {

    exportar({ rutaEntrada, rutaSalida, filaProyecto, camposEditoriales = {} }) {
        console.log("");
        console.log("======================================");
        console.log("ADAPTADOR CSV EDITORIAL V0.2");
        console.log("======================================");
        console.log("");

        if (!rutaEntrada) throw new Error("Falta rutaEntrada.");
        if (!rutaSalida) throw new Error("Falta rutaSalida.");
        if (!filaProyecto) throw new Error("Falta filaProyecto.");

        const contenido = fs.readFileSync(rutaEntrada, "utf8");
        const parsed = Papa.parse(contenido, { header: false, skipEmptyLines: true });
        if (parsed.errors.length > 0) {
            throw new Error(`Error leyendo CSV: ${JSON.stringify(parsed.errors)}`);
        }

        const filas = parsed.data;
        if (filas.length < 2) throw new Error("El CSV no contiene filas de datos.");

        const encabezados = filas[0];
        const filasDatos = filas.slice(1);
        const indice = this.crearIndiceEncabezados(encabezados);

        const nombreProyecto = filaProyecto["Proyecto"] || "(sin nombre)";
        const codigoAntes = filaProyecto["Código MUBATO"] || "";

        if (String(codigoAntes).trim() !== "") {
            throw new Error(`La fila recibida no es pendiente: "Código MUBATO" ya contiene "${codigoAntes}".`);
        }

        const posicionFila = this.localizarFilaExacta(filasDatos, indice, filaProyecto);
        if (posicionFila === -1) {
            throw new Error(`La fila pendiente recibida para "${nombreProyecto}" no coincide con ninguna fila del CSV.`);
        }

        const fila = filasDatos[posicionFila];
        const cambiosPermitidos = {
            "Código MUBATO": camposEditoriales.codigo,
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

        const salida = Papa.unparse([encabezados, ...filasDatos], { quotes: false });
        fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });
        fs.writeFileSync(rutaSalida, salida, "utf8");

        console.log(`✓ Fila pendiente confirmada: ${nombreProyecto}`);
        console.log(`✓ Posición de fila: ${posicionFila + 2}`);
        console.log(`✓ Campos Companion actualizados: ${cambiosAplicados.length}`);
        console.log(`✓ CSV generado: ${rutaSalida}`);
        console.log("");

        return {
            rutaSalida,
            proyecto: nombreProyecto,
            posicionFila: posicionFila + 2,
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
            if (posiciones.length === 1) unicas[encabezado] = posiciones[0];
        }
        return { todas, unicas };
    }

    localizarFilaExacta(filasDatos, indice, filaProyecto) {
        const camposClave = ["ID", "Proyecto", "Slug"];
        return filasDatos.findIndex(fila => camposClave.every(campo => {
            const posicion = indice.unicas[campo];
            if (posicion === undefined) return true;
            return String(fila[posicion] || "") === String(filaProyecto[campo] || "");
        }));
    }
}

module.exports = AdaptadorCSVEditorial;
