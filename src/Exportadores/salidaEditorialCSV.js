console.log("salidaEditorialCSV.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

/**
 * SalidaEditorialCSV
 *
 * Contrato único de salida entre Editorial Proyecto V2.2 y el CSV de Wix.
 *
 * Principios:
 * - Lee el CSV como matriz para preservar encabezados, incluidos duplicados.
 * - Localiza exactamente la fila recibida mediante identidad estable.
 * - Solo escribe campos explícitamente autorizados por el contrato editorial.
 * - Nunca usa como identidad un campo que Editorial vaya a modificar.
 * - Las dos columnas originales "Historias de Transformación" son SIEMPRE protegidas.
 * - "Hero Imágen" es SIEMPRE protegida y nunca es escrita por Editorial.
 * - "Historia" es un campo Companion nuevo; nunca sustituye ni toca las columnas originales.
 * - "Hero Texto" es el campo Wix real para heroTexto.
 * - Verifica que los campos protegidos permanezcan intactos.
 * - No modifica silenciosamente el CSV de entrada.
 * - Genera un archivo de salida separado.
 */
class SalidaEditorialCSV {

    static CAMPOS_WIX_EDITABLES = Object.freeze([
        "Código MUBATO",
        "Hero Texto",
        "Descripción",
        "Servicios",
        "Slug",
        "SEO Title",
        "Meta Description"
    ]);

    static CAMPO_HISTORIA_COMPANION = "Historia";
    static CAMPOS_IDENTIDAD = Object.freeze(["ID", "Proyecto"]);
    static CAMPOS_PROTEGIDOS_POR_REGLA = Object.freeze([
        "Historias de Transformación",
        "Hero Imágen"
    ]);

    exportar({ rutaEntrada, rutaSalida, filaProyecto, editorial }) {
        console.log("");
        console.log("======================================");
        console.log("SALIDA EDITORIAL CSV V2.2");
        console.log("======================================");
        console.log("");

        this.validarEntrada({ rutaEntrada, rutaSalida, filaProyecto, editorial });

        const filas = this.leerCSV(rutaEntrada);
        if (filas.length < 2) throw new Error("El CSV no contiene filas de datos.");

        const encabezados = [...filas[0]];
        const filasDatos = filas.slice(1).map(fila => [...fila]);
        const indice = this.crearIndiceEncabezados(encabezados);
        this.validarContratoCSV(indice, editorial);
        this.validarIdentidadDisponible(indice, filaProyecto);

        const posicionFila = this.localizarFilaExacta(filasDatos, indice, filaProyecto);
        if (posicionFila === -1) {
            throw new Error(`La fila editorial de "${filaProyecto["Proyecto"] || "(sin nombre)"}" no coincide exactamente con el CSV de entrada.`);
        }

        const fila = filasDatos[posicionFila];
        const protegidosAntes = this.capturarCamposProtegidos(encabezados, fila);
        const cambios = this.construirCambios(editorial);
        const camposActualizados = [];

        for (const [campo, valor] of Object.entries(cambios)) {
            if (valor === undefined || valor === null) continue;

            if (campo === SalidaEditorialCSV.CAMPO_HISTORIA_COMPANION && indice.unicas[campo] === undefined) {
                encabezados.push(campo);
                filasDatos.forEach((filaExistente, indiceFila) => {
                    filaExistente.push(indiceFila === posicionFila ? this.serializar(valor) : "");
                });
                camposActualizados.push(campo);
                continue;
            }

            const posicion = indice.unicas[campo];
            if (posicion === undefined) {
                throw new Error(`El contrato editorial exige el campo "${campo}", pero no existe como cabecera única en el CSV.`);
            }
            fila[posicion] = this.serializar(valor);
            camposActualizados.push(campo);
        }

        this.verificarCamposProtegidos(encabezados, filasDatos[posicionFila], protegidosAntes);
        this.verificarEstructuraCSV(encabezados, filasDatos);

        const salida = Papa.unparse([encabezados, ...filasDatos], { quotes: false });
        fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });
        fs.writeFileSync(rutaSalida, salida, "utf8");

        console.log(`✓ Fila confirmada: ${filaProyecto["Proyecto"] || "(sin nombre)"}`);
        console.log(`✓ Posición de fila: ${posicionFila + 2}`);
        console.log(`✓ Campos editoriales aplicados: ${camposActualizados.length}`);
        console.log(`✓ Campos protegidos verificados: ${Object.keys(protegidosAntes).length}`);
        console.log(`✓ CSV generado: ${rutaSalida}`);
        console.log("");

        return {
            rutaEntrada,
            rutaSalida,
            proyecto: filaProyecto["Proyecto"] || "",
            posicionFila: posicionFila + 2,
            camposActualizados,
            camposProtegidosVerificados: Object.keys(protegidosAntes),
            cabecerasPreservadas: encabezados.length
        };
    }

    validarEntrada({ rutaEntrada, rutaSalida, filaProyecto, editorial }) {
        if (!rutaEntrada) throw new Error("Falta rutaEntrada.");
        if (!rutaSalida) throw new Error("Falta rutaSalida.");
        if (path.resolve(rutaEntrada) === path.resolve(rutaSalida)) {
            throw new Error("rutaEntrada y rutaSalida deben ser archivos diferentes.");
        }
        if (!filaProyecto || typeof filaProyecto !== "object") throw new Error("Falta filaProyecto.");
        if (!editorial || typeof editorial !== "object" || Array.isArray(editorial)) {
            throw new Error("Falta contrato editorial válido.");
        }
    }

    validarContratoCSV(indice, editorial) {
        for (const campo of SalidaEditorialCSV.CAMPOS_WIX_EDITABLES) {
            if (indice.unicas[campo] === undefined) {
                throw new Error(`El contrato editorial exige el campo Wix "${campo}", pero no existe como cabecera única en el CSV.`);
            }
        }

        const historiaOriginal = indice.todas[SalidaEditorialCSV.CAMPO_HISTORIA_COMPANION];
        if (historiaOriginal && historiaOriginal.length > 0) {
            throw new Error(`El campo Companion "${SalidaEditorialCSV.CAMPO_HISTORIA_COMPANION}" ya existe en el CSV; se requiere una columna nueva inequívoca para evitar colisión con campos originales.`);
        }

        for (const campo of SalidaEditorialCSV.CAMPOS_PROTEGIDOS_POR_REGLA) {
            const apariciones = indice.todas[campo] || [];
            if (campo === "Historias de Transformación") {
                if (apariciones.length !== 2) {
                    throw new Error(`El contrato Wix exige exactamente 2 columnas originales "${campo}"; se encontraron ${apariciones.length}.`);
                }
            } else if (apariciones.length !== 1) {
                throw new Error(`El contrato Wix exige exactamente 1 columna protegida "${campo}"; se encontraron ${apariciones.length}.`);
            }
        }

        if (editorial.historia === undefined || editorial.historia === null || !String(editorial.historia).trim()) {
            throw new Error("El contrato editorial exige una Historia válida.");
        }
    }

    construirCambios(editorial) {
        return {
            "Código MUBATO": editorial.codigo,
            "Hero Texto": editorial.heroTexto,
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
        const resultado = Papa.parse(contenido, { header: false, skipEmptyLines: true });
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

    validarIdentidadDisponible(indice, filaProyecto) {
        const disponibles = SalidaEditorialCSV.CAMPOS_IDENTIDAD.filter(campo =>
            indice.unicas[campo] !== undefined && String(filaProyecto[campo] || "").trim() !== ""
        );
        if (disponibles.length === 0) {
            throw new Error("No existe una identidad estable suficiente para localizar la fila editorial: se requiere ID o Proyecto.");
        }
    }

    localizarFilaExacta(filasDatos, indice, filaProyecto) {
        const camposDisponibles = SalidaEditorialCSV.CAMPOS_IDENTIDAD.filter(campo =>
            indice.unicas[campo] !== undefined && String(filaProyecto[campo] || "").trim() !== ""
        );
        return filasDatos.findIndex(fila => camposDisponibles.every(campo => {
            const posicion = indice.unicas[campo];
            return String(fila[posicion] || "") === String(filaProyecto[campo] || "");
        }));
    }

    capturarCamposProtegidos(encabezados, fila) {
        const editables = new Set(SalidaEditorialCSV.CAMPOS_WIX_EDITABLES);
        const protegidos = [];
        encabezados.forEach((encabezado, posicion) => {
            if (!editables.has(encabezado)) {
                protegidos.push({ posicion, encabezado, valor: fila[posicion] ?? "" });
            }
        });
        return protegidos;
    }

    verificarCamposProtegidos(encabezados, fila, protegidosAntes) {
        for (const protegido of protegidosAntes) {
            if (encabezados[protegido.posicion] !== protegido.encabezado) {
                throw new Error(`El encabezado protegido en posición ${protegido.posicion + 1} cambió durante la operación.`);
            }
            const valorDespues = fila[protegido.posicion] ?? "";
            if (String(valorDespues) !== String(protegido.valor)) {
                throw new Error(`Protección de integridad violada en el campo "${protegido.encabezado}" en posición ${protegido.posicion + 1}.`);
            }
        }
    }

    verificarEstructuraCSV(encabezados, filasDatos) {
        const ancho = encabezados.length;
        if (!ancho) throw new Error("El CSV no contiene cabeceras.");
        filasDatos.forEach((fila, indiceFila) => {
            if (fila.length !== ancho) {
                throw new Error(`La fila ${indiceFila + 2} cambió su estructura: esperaba ${ancho} columnas y contiene ${fila.length}.`);
            }
        });
    }
}

module.exports = SalidaEditorialCSV;
