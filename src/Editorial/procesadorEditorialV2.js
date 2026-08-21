console.log("procesadorEditorialV2.js cargado");

const ProcesadorEditorialV1 = require("./procesadorEditorialV1");
const ValidadorHistoriaV2 = require("../direccionEditorial/validadorHistoriaV2");

/**
 * Procesador Editorial V2.
 *
 * Reutiliza la tubería de generación de V1 y sustituye el contrato de
 * validación de Historia mediante inyección de dependencia.
 */
class ProcesadorEditorialV2 extends ProcesadorEditorialV1 {
    constructor() {
        super({ validadorHistoria: new ValidadorHistoriaV2() });
    }

    async generar(fila, opciones = {}) {
        const resultado = await super.generar(fila, opciones);
        return {
            ...resultado,
            versionEditorial: "V2"
        };
    }
}

module.exports = ProcesadorEditorialV2;
