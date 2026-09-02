console.log("lectorEvidenciaVisual.js cargado");

const fs = require("fs");

/**
 * LectorEvidenciaVisual
 *
 * Infraestructura compartida para rehidratar evidencia visual ya persistida.
 *
 * Responsabilidades:
 * - Leer un archivo .evidencia-visual.json existente.
 * - Parsear y validar su estructura mínima.
 * - No ejecutar Vision.
 * - No modificar la evidencia.
 * - Entregar la misma evidencia a cualquier flujo editorial que la necesite.
 *
 * Este módulo no contiene reglas de Proyecto ni de Portfolio.
 */
class LectorEvidenciaVisual {

    cargar(rutaArchivo) {
        if (!rutaArchivo || typeof rutaArchivo !== "string") {
            throw new Error("Se requiere la ruta del archivo de evidencia visual.");
        }

        if (!fs.existsSync(rutaArchivo)) {
            throw new Error(`No existe el archivo de evidencia visual: ${rutaArchivo}`);
        }

        let contenido;

        try {
            contenido = fs.readFileSync(rutaArchivo, "utf8");
        } catch (error) {
            throw new Error(
                `No fue posible leer la evidencia visual: ${error.message}`
            );
        }

        let evidencia;

        try {
            evidencia = JSON.parse(contenido);
        } catch (error) {
            throw new Error(
                `El archivo de evidencia visual no contiene JSON válido: ${error.message}`
            );
        }

        this.validar(evidencia);

        return evidencia;
    }

    validar(evidencia) {
        if (!evidencia || typeof evidencia !== "object" || Array.isArray(evidencia)) {
            throw new Error("La evidencia visual debe ser un objeto JSON.");
        }

        if (!evidencia.version) {
            throw new Error("La evidencia visual no tiene versión.");
        }

        if (!evidencia.proyecto || typeof evidencia.proyecto !== "object") {
            throw new Error("La evidencia visual no contiene el objeto proyecto.");
        }

        if (!Array.isArray(evidencia.observacionesVision)) {
            throw new Error(
                "La evidencia visual no contiene observacionesVision como arreglo."
            );
        }

        return true;
    }

    extraerObservaciones(evidencia) {
        this.validar(evidencia);
        return evidencia.observacionesVision.map(observacion => ({ ...observacion }));
    }
}

module.exports = LectorEvidenciaVisual;
