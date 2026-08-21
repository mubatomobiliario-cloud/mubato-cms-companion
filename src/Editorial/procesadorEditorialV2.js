console.log("procesadorEditorialV2.js cargado");

const ConstructorContexto = require("../direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../direccionEditorial/openAIClient");
const ValidadorHistoriaV2 = require("../direccionEditorial/validadorHistoriaV2");
const ProcesadorEditorialV1 = require("./procesadorEditorialV1");

/**
 * Procesador Editorial V2.
 *
 * V2 mantiene la secuencia editorial de V1, pero ya no hereda de V1.
 * La implementación se compone mediante sus dependencias, permitiendo
 * sustituir contratos editoriales sin arrastrar el comportamiento de V1.
 */
class ProcesadorEditorialV2 {
    constructor({ contexto, openAI, validadorHistoria } = {}) {
        this.contexto = contexto || new ConstructorContexto();
        this.openAI = openAI || new OpenAIClient();
        this.validadorHistoria = validadorHistoria || new ValidadorHistoriaV2();
        this.procesadorV1 = new ProcesadorEditorialV1({
            contexto: this.contexto,
            openAI: this.openAI,
            validadorHistoria: this.validadorHistoria
        });
    }

    async generar(fila, opciones = {}) {
        const resultado = await this.procesadorV1.generar(fila, opciones);
        return {
            ...resultado,
            versionEditorial: "V2"
        };
    }
}

module.exports = ProcesadorEditorialV2;
