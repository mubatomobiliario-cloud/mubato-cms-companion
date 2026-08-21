console.log("procesadorEditorialV2.js cargado");

const ProcesadorEditorialV1 = require("./procesadorEditorialV1");
const ValidadorHistoriaV2 = require("../direccionEditorial/validadorHistoriaV2");

/**
 * Procesador Editorial V2.
 *
 * Reutiliza la tubería de generación de V1 y sustituye únicamente el
 * contrato de validación de Historia por el motor de reglas V2.
 * Esto permite evolucionar el criterio editorial sin duplicar la generación
 * de Hero, SEO y Galería.
 */
class ProcesadorEditorialV2 extends ProcesadorEditorialV1 {
    constructor() {
        super();
        this.validadorHistoria = new ValidadorHistoriaV2();
    }

    async generar(fila, opciones = {}) {
        const resultado = await super.generar(fila, opciones);
        const validacion = this.validadorHistoria.validar(resultado.historia, resultado.proyecto);

        if (!validacion.aprobado) {
            const detalle = validacion.errores
                .map(error => `${error.regla}: ${error.mensaje}`)
                .join(" | ");
            throw new Error(`Historia V2 rechazada: ${detalle}`);
        }

        return {
            ...resultado,
            validacionHistoria: validacion,
            versionEditorial: "V2"
        };
    }
}

module.exports = ProcesadorEditorialV2;
