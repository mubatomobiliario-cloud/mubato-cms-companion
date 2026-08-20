console.log("adaptadorCSVEditorial.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const ContratoCSVEditorial = require("./contratoCSVEditorial");

class AdaptadorCSVEditorial {

    exportar({
        rutaEntrada,
        rutaSalida,
        filaProyecto,
        camposEditoriales = {},
        decision,
        historia,
        candidatosColumna
    }) {
        console.log("");
        console.log("======================================");
        console.log("ADAPTADOR CSV EDITORIAL V0.3");
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
        const contrato = new ContratoCSVEditorial();

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

        // La historia de transformación solo puede entrar al CSV después
        // de superar el contrato editorial. La IA nunca escribe directamente.
        let preparacionHistoria = null;
        if (historia !== undefined || decision !== undefined) {
            preparacionHistoria = contrato.prepararEscritura({
                encabezados,
                decision,
                historia,
                candidatosColumna
            });

            if (!preparacionHistoria.permitido) {
                const error = new Error(
                    `Escritura editorial bloqueada: ${preparacionHistoria.estado}. ${preparacionHistoria.errores.join(" | ")}`
                );
                error.codigo = preparacionHistoria.estado;
                error.detalleContrato = preparacionHistoria;
                throw error;
            }
        }

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

        if (preparacionHistoria) {
            fila[preparacionHistoria.columnaHistoria.posicion] = preparacionHistoria.valor;
            cambiosAplicados.push(preparacionHistoria.columnaHistoria.nombre);
        }

        const salida = Papa.unparse([encabezados, ...filasDatos], { quotes: false });
        fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });
        fs.writeFileSync(rutaSalida, salida, "utf8");

        console.log(`✓ Fila pendiente confirmada: ${nombreProyecto}`);
        console.log(`✓ Posición de fila: ${posicionFila + 2}`);
        console.log(`✓ Campos Companion actualizados: ${cambiosAplicados.length}`);
        if (preparacionHistoria) {
            console.log(`✓ Historia escrita mediante contrato: ${preparacionHistoria.columnaHistoria.nombre}`);
        }
        console.log(`✓ CSV generado: ${rutaSalida}`);
        console.log("");

        return {
            rutaSalida,
            proyecto: nombreProyecto,
            posicionFila: posicionFila + 2,
            camposActualizados: cambiosAplicados,
            contratoHistoria: preparacionHistoria
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
