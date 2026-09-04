/**
 * ConstructorContextoExpresionIndividualPortfolio
 *
 * Construye el contexto editorial mínimo para expresar una fotografía
 * individual de PORTFOLIO.
 *
 * PRINCIPIOS
 * - No ejecuta Vision.
 * - No ejecuta comprensión central.
 * - No decide inclusión ni orden de fotografías.
 * - Consume una única observación visual ya persistida.
 * - Usa la comprensión central como contexto editorial, no como evidencia
 *   fotográfica de la imagen individual.
 * - Conserva el identificador de la fotografía para trazabilidad.
 * - No modifica las entradas recibidas.
 */
class ConstructorContextoExpresionIndividualPortfolio {
    construir(comprension = {}, observacionFotografia = {}, portfolio = {}) {
        this.validarComprension(comprension);
        this.validarObservacion(observacionFotografia);
        this.validarPortfolio(portfolio);

        return [
            this.encabezado(),
            this.seccionPieza(portfolio),
            this.seccionComprension(comprension),
            this.seccionFotografia(observacionFotografia),
            this.seccionReglas()
        ].join("\n");
    }

    validarComprension(comprension) {
        if (!comprension || typeof comprension !== "object" || Array.isArray(comprension)) {
            throw new Error("La comprensión central Portfolio debe ser un objeto válido.");
        }
    }

    validarObservacion(observacionFotografia) {
        if (!observacionFotografia || typeof observacionFotografia !== "object" || Array.isArray(observacionFotografia)) {
            throw new Error("La observación de fotografía Portfolio debe ser un objeto válido.");
        }

        if (typeof observacionFotografia.fotografia !== "string" || !observacionFotografia.fotografia.trim()) {
            throw new Error("La expresión individual Portfolio requiere un identificador de fotografía.");
        }
    }

    validarPortfolio(portfolio) {
        if (!portfolio || typeof portfolio !== "object" || Array.isArray(portfolio)) {
            throw new Error("El contexto Portfolio debe ser un objeto válido.");
        }
    }

    encabezado() {
        return [
            "====================================================",
            "CONTEXTO DE EXPRESIÓN INDIVIDUAL PORTFOLIO",
            "====================================================",
            "",
            "La fotografía ya fue curada y evaluada por Vision.",
            "Este módulo no ejecuta Vision ni decide inclusión u orden.",
            "La expresión debe caracterizar esta fotografía a partir",
            "de su evidencia y del contexto editorial central."
        ].join("\n");
    }

    seccionPieza(portfolio) {
        return [
            "",
            "====================================================",
            "PIEZA / COLECCIÓN",
            "====================================================",
            "",
            `Nombre: ${this.valor(portfolio.nombre)}`,
            `Categoría: ${this.valor(portfolio.categoria)}`,
            `Ciudad: ${this.valor(portfolio.ciudad)}`,
            `Espacios registrados: ${this.lista(portfolio.espacios)}`,
            `Cliente: ${this.valor(portfolio.cliente)}`
        ].join("\n");
    }

    seccionComprension(comprension) {
        return [
            "",
            "====================================================",
            "COMPRENSIÓN EDITORIAL CENTRAL",
            "====================================================",
            "",
            `Núcleo: ${this.valor(comprension.nucleo)}`,
            `Carácter: ${this.valor(comprension.caracter)}`,
            `Materialidad: ${this.valor(comprension.materialidad)}`,
            `Funcionalidad: ${this.valor(comprension.funcionalidad)}`,
            `Relaciones espaciales: ${this.valor(comprension.relacionesEspaciales)}`,
            `Experiencia: ${this.valor(comprension.experiencia)}`,
            `Rasgos diferenciales: ${this.valor(comprension.rasgosDiferenciales)}`,
            `Enfoque narrativo: ${this.valor(comprension.enfoqueNarrativo)}`
        ].join("\n");
    }

    seccionFotografia(observacion) {
        return [
            "",
            "====================================================",
            "EVIDENCIA DE LA FOTOGRAFÍA",
            "====================================================",
            "",
            `Identificador: ${this.valor(observacion.fotografia)}`,
            `Espacio: ${this.valor(observacion.espacio)}`,
            `Tipo: ${this.valor(observacion.tipo)}`,
            `Plano: ${this.valor(observacion.plano)}`,
            `Materiales: ${this.lista(observacion.materiales)}`,
            `Colores: ${this.lista(observacion.colores)}`,
            `Elementos: ${this.lista(observacion.elementos)}`,
            `Estilo: ${this.valor(observacion.estilo)}`,
            `Iluminación: ${this.valor(observacion.iluminacion)}`,
            `Sensación: ${this.valor(observacion.sensacion)}`,
            `Observación: ${this.valor(observacion.observaciones)}`,
            `Confianza: ${this.valor(observacion.confianza)}`
        ].join("\n");
    }

    seccionReglas() {
        return [
            "",
            "====================================================",
            "REGLAS DE EXPRESIÓN INDIVIDUAL",
            "====================================================",
            "",
            "• Expresar únicamente lo sustentado por la evidencia de esta fotografía.",
            "• Usar la comprensión central para mantener coherencia, no para inventar detalles de la imagen.",
            "• La fotografía debe conservar su propia especificidad dentro de la colección.",
            "• No inventar personas, necesidades, usos, materiales, espacios o circunstancias no observados.",
            "• No decidir inclusión, selección ni orden de fotografías.",
            "• No modificar la evidencia visual ni la comprensión central.",
            "• Producir title, description, alt, keywords y nombreSEO para esta fotografía."
        ].join("\n");
    }

    lista(valores) {
        if (!Array.isArray(valores)) {
            return this.valor(valores);
        }

        const filtrados = valores.filter(valor => valor !== undefined && valor !== null && valor !== "");
        return filtrados.length ? filtrados.map(valor => `• ${valor}`).join("\n") : "Sin información";
    }

    valor(valor) {
        if (valor === undefined || valor === null || valor === "") {
            return "Sin información";
        }

        return String(valor);
    }
}

module.exports = ConstructorContextoExpresionIndividualPortfolio;
