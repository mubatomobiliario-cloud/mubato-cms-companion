console.log("salidaEditorialCSV.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

/**
 * SalidaEditorialCSV
 *
 * Contrato único de salida entre Editorial V2.2 y el CSV de Wix.
 *
 * Principios:
 * - Lee el CSV como matriz para preservar encabezados, incluidos duplicados.
 * - Localiza exactamente la fila recibida antes de escribir.
 * - Solo escribe campos explícitamente incluidos en el contrato editorial.
 * - No borra ni reconstruye contenido ajeno al Companion.
 * - Genera un archivo de salida; no modifica silenciosamente la entrada.
 */
class SalidaEditorialCSV {

    exportar({ rutaEntrada, rutaSalida, filaProyecto, editorial }) {
        console.log("");
        console.log("======================================");
        console.log("SALIDA EDITORIAL CSV V2.2");
        console.log("======================================");
        console.log("");

        if (!rutaEntrada) throw new Error("Falta rutaEntrada.");
        if (!rutaSalida) throw new Error("Falta rutaSalida.");
        if (!filaProyecto) throw new Error("Falta filaProyecto.");
        if (!editorial || typeof editorial !== "object") throw new Error("Falta contrato editorial.");

        const filas = this.leerCSV(rutaEntrada);
        if (filas.length < 2) throw new Error("El CSV no contiene filas de datos.");

        const encabezados = filas[0];
        const filasDatos = filas.slice(1);
        const indice = this.crearIndiceEncabezados(encabezados);
        const posicionFila = this.localizarFilaExacta(filasDatos, indice, filaProyecto);

        if (posicionFila === -1) {
            throw new Error(`La fila editorial de "${filaProyecto["Proyecto"] || "(sin nombre)"}" no coincide exactamente con el CSV de entrada.`);
        }

        const fila = filasDatos[posicionFila];
        const cambios = this.construirCambios(editorial);
        const camposActualizados = [];

        for (const [campo, valor] of Object.entries(cambios)) {
            if (valor === undefined || valor === null) continue;

            const posicion = indice.unicas[campo];
            if (posicion === undefined) {
                console.warn(`⚠ Campo no encontrado en CSV: ${campo}`);
                continue;
            }

            fila[posicion] = this.serializar(valor);
            camposActualizados.push(campo);
        }

        const salida = Papa.unparse([encabezados, ...filasDatos], { quotes: false });
        fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });
        fs.writeFileSync(rutaSalida, salida, "utf8");

        console.log(`✓ Fila confirmada: ${filaProyecto["Proyecto"] || "(sin nombre)"}`);
        console.log(`✓ Posición de fila: ${posicionFila + 2}`);
        console.log(`✓ Campos editoriales aplicados: ${camposActualizados.length}`);
        console.log(`✓ CSV generado: ${rutaSalida}`);
        console.log("");

        return {
            rutaEntrada,
            rutaSalida,
            proyecto: filaProyecto["Proyecto"] || "",
            posicionFila: posicionFila + 2,
            camposActualizados
        };
    }

    construirCambios(editorial) {
        return {
            "Código MUBATO": editorial.codigo,
            "Hero": editorial.heroTexto,
            "Historia": editorial.historia,
            "Descripción": editorial.descripcion,
            "Servicios": editorial.servicios,
            "Slug": editorial.slug,
            "SEO Title": editorial.seoTitle,
            "Meta Description": editorial.metaDescription
        };
    }

    serializar(valor) {
        if (Array.isArray(valor) || (valor && typeof valor === "object")) {
            return JSON.stringify(valor);
        }
        return String(valor);
    }

    leerCSV(rutaCSV) {
        const contenido = fs.readFileSync(rutaCSV, "utf8");
        const resultado = Papa.parse(contenido, {
            header: false,
            skipEmptyLines: true
        });

        if (resultado.errors.length > 0) {
            throw new Error(`Error leyendo CSV: ${JSON.stringify(resultado.errors)}`);
        }

        return resultado.data;
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

module.exports = SalidaEditorialCSV;
