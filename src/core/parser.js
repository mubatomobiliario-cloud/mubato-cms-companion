console.log("parser.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const ProyectoManager = require("./proyectoManager");

class Parser {

    constructor() {
        this.proyectoManager = new ProyectoManager();
    }

    normalizarEncabezado(encabezado) {
        return String(encabezado || "")
            .replace(/^\uFEFF/, "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "");
    }

    esCampoSistemaWix(encabezado) {
        const normalizado = this.normalizarEncabezado(encabezado);

        return [
            "portafoliomubato",
            "portafoliomubatoitem",
            "portafoliomubatolist",
            "createddate",
            "updateddate",
            "owner"
        ].includes(normalizado);
    }

    esCampoEditorialProtegido(encabezado) {
        return this.normalizarEncabezado(encabezado) ===
            "historiasdetransformacion";
    }

    prepararEncabezados(contenido) {
        const resultado = Papa.parse(contenido, {
            header: false,
            skipEmptyLines: true
        });

        if (resultado.errors && resultado.errors.length > 0) {
            throw new Error(
                `Error al leer el CSV: ${resultado.errors[0].message}`
            );
        }

        const filas = resultado.data;

        if (!Array.isArray(filas) || filas.length === 0) {
            throw new Error("El CSV está vacío.");
        }

        const encabezados = filas[0].map(encabezado =>
            String(encabezado || "").replace(/^\uFEFF/, "").trim()
        );

        const posicionesPorEncabezado = new Map();

        encabezados.forEach((encabezado, indice) => {
            const clave = this.normalizarEncabezado(encabezado);

            if (!clave) {
                throw new Error(
                    `El CSV contiene un encabezado vacío en la columna ${indice + 1}.`
                );
            }

            if (!posicionesPorEncabezado.has(clave)) {
                posicionesPorEncabezado.set(clave, []);
            }

            posicionesPorEncabezado.get(clave).push(indice);
        });

        const columnasIgnoradas = new Set();

        for (const [clave, posiciones] of posicionesPorEncabezado.entries()) {
            if (posiciones.length <= 1) {
                continue;
            }

            const encabezado = encabezados[posiciones[0]];

            if (this.esCampoSistemaWix(encabezado)) {
                posiciones.forEach(indice => columnasIgnoradas.add(indice));

                console.warn(
                    `⚠ Campo de sistema Wix repetido: "${encabezado}" (${posiciones.length} columnas). Se ignorará y el Parser continuará.`
                );

                continue;
            }

            if (this.esCampoEditorialProtegido(encabezado)) {
                if (posiciones.length !== 2) {
                    throw new Error(
                        `El campo editorial protegido "${encabezado}" debe aparecer exactamente 2 veces. Se encontraron ${posiciones.length}.`
                    );
                }

                console.warn(
                    `⚠ Campo editorial protegido repetido: "${encabezado}" (2 columnas). No se ignorará ni reinterpretará.`
                );

                continue;
            }

            throw new Error(
                `El CSV contiene un encabezado editorial duplicado: "${encabezado}". No se puede continuar de forma segura.`
            );
        }

        return {
            filas,
            encabezados,
            columnasIgnoradas
        };
    }

    leerCSV(rutaCSV) {
        const contenido = fs.readFileSync(rutaCSV, "utf8");
        const { filas, encabezados, columnasIgnoradas } =
            this.prepararEncabezados(contenido);

        const datos = filas.slice(1);

        return datos.map(fila => {
            const objeto = {};

            encabezados.forEach((encabezado, indice) => {
                if (columnasIgnoradas.has(indice)) {
                    return;
                }

                objeto[encabezado] =
                    fila[indice] === undefined ? "" : fila[indice];
            });

            return objeto;
        });
    }

    buscarCSV(rutaCarpeta) {
        const archivos = fs.readdirSync(rutaCarpeta);

        const archivosCSV = archivos.filter(archivo =>
            archivo.toLowerCase().endsWith(".csv")
        );

        const archivosEntrada = archivosCSV.filter(archivo =>
            !/_Editorial_\d+\.csv$/i.test(archivo)
        );

        if (archivosEntrada.length === 0) {
            throw new Error(
                "No se encontró un CSV fuente de Wix en la carpeta del proyecto."
            );
        }

        if (archivosEntrada.length > 1) {
            throw new Error(
                `Se encontraron varios CSV fuente posibles: ${archivosEntrada.join(", ")}. Selecciona el CSV de origen explícitamente.`
            );
        }

        return path.join(rutaCarpeta, archivosEntrada[0]);
    }

    validarRutaCSV(rutaCSV, rutaCarpeta) {
        if (!rutaCSV) {
            throw new Error("No se recibió un CSV fuente.");
        }

        const csv = path.resolve(rutaCSV);
        const carpeta = path.resolve(rutaCarpeta);

        if (path.dirname(csv) !== carpeta) {
            throw new Error(
                "El CSV seleccionado debe estar dentro de la carpeta del proyecto."
            );
        }

        if (!csv.toLowerCase().endsWith(".csv")) {
            throw new Error("El archivo seleccionado no es un CSV.");
        }
    }

    buscarProyectoPendiente(filas) {
        return filas.find(fila => {
            const codigo = fila["Código MUBATO"];

            return !codigo ||
                String(codigo).trim() === "";
        });
    }

    generarCodigoMUBATO() {
        const ahora = new Date();

        const yyyy = ahora.getFullYear();
        const mm = String(ahora.getMonth() + 1).padStart(2, "0");
        const dd = String(ahora.getDate()).padStart(2, "0");
        const hh = String(ahora.getHours()).padStart(2, "0");
        const mi = String(ahora.getMinutes()).padStart(2, "0");
        const ss = String(ahora.getSeconds()).padStart(2, "0");

        return `MUB-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
    }

    asignarCodigoMUBATO(filaProyecto) {
        const codigoExistente =
            String(filaProyecto["Código MUBATO"] || "").trim();

        if (codigoExistente) {
            return codigoExistente;
        }

        const codigo = this.generarCodigoMUBATO();

        filaProyecto["Código MUBATO"] = codigo;

        console.log(
            `✓ Código MUBATO asignado automáticamente: ${codigo}`
        );

        return codigo;
    }

    determinarTipoEditorial(fila) {
        const observaciones = fila["Observaciones"];

        return String(observaciones || "") === ""
            ? "PROYECTO"
            : "PORTFOLIO";
    }

    seleccionarFlujoEditorial(fila) {
        const tipoEditorial =
            this.determinarTipoEditorial(fila);

        return {
            tipoEditorial,

            flujoEditorial:
                tipoEditorial === "PROYECTO"
                    ? "EDITORIAL_PROYECTO_V2.2"
                    : "EDITORIAL_PORTFOLIO"
        };
    }

    importarProyecto(rutaCSV, carpetaProyecto) {
        this.validarRutaCSV(rutaCSV, carpetaProyecto);

        const filas = this.leerCSV(rutaCSV);

        if (filas.length === 0) {
            throw new Error("El CSV está vacío.");
        }

        const filaProyecto =
            this.buscarProyectoPendiente(filas);

        if (!filaProyecto) {
            throw new Error(
                "No se encontró ningún proyecto pendiente."
            );
        }

        /*
         * REGLA DE PRODUCCIÓN MUBATO
         *
         * La fila cuyo Código MUBATO está vacío
         * es el proyecto pendiente de procesamiento.
         *
         * La App es responsable de asignarle
         * automáticamente el Código MUBATO.
         *
         * El código no se genera mediante IA.
         */
        this.asignarCodigoMUBATO(filaProyecto);

        const seleccionEditorial =
            this.seleccionarFlujoEditorial(filaProyecto);

        console.log(
            `✓ Tipo editorial determinado: ${seleccionEditorial.tipoEditorial}`
        );

        console.log(
            `✓ Flujo editorial seleccionado: ${seleccionEditorial.flujoEditorial}`
        );

        const proyecto =
            this.proyectoManager.importarProyecto(
                filaProyecto,
                carpetaProyecto,
                rutaCSV
            );

        proyecto.tipoEditorial =
            seleccionEditorial.tipoEditorial;

        proyecto.flujoEditorial =
            seleccionEditorial.flujoEditorial;

        proyecto.observaciones =
            String(filaProyecto["Observaciones"] || "");

        proyecto.filaCSV = {
            ...filaProyecto
        };

        if (!String(proyecto.codigo || "").trim()) {
            throw new Error(
                "Error interno: el Código MUBATO fue asignado en la fila pero no llegó al proyecto."
            );
        }

        return proyecto;
    }

    importarCarpeta(rutaCarpeta, rutaCSV = null) {
        const csvFuente = rutaCSV || this.buscarCSV(rutaCarpeta);

        return this.importarProyecto(
            csvFuente,
            rutaCarpeta
        );
    }
}

module.exports = Parser;
