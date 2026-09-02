/**
 * ConstructorContextoPortfolio
 *
 * Construye el contexto editorial de PORTFOLIO a partir de información
 * estructurada y evidencia visual previamente persistida.
 *
 * PRINCIPIOS
 * - No ejecuta Vision.
 * - No decide qué fotografías pertenecen al Portfolio.
 * - No modifica ni reutiliza las reglas narrativas de Proyecto V2.2.
 * - Conserva la selección y el orden editorial recibidos.
 * - Consume la evidencia en el contrato persistido de observacionesVision.
 * - La lectura del archivo de evidencia pertenece a infraestructura compartida.
 */
class ConstructorContextoPortfolio {
    construir(portfolio = {}, observacionesVision = []) {
        this.validarEntrada(portfolio);
        this.validarEvidencia(observacionesVision);

        return [
            this.encabezado(),
            this.seccionPieza(portfolio),
            this.seccionEvidencia(observacionesVision),
            this.seccionFotografias(observacionesVision),
            this.seccionReglas()
        ].join("\n");
    }

    validarEntrada(portfolio) {
        if (!portfolio || typeof portfolio !== "object" || Array.isArray(portfolio)) {
            throw new Error("Falta un objeto Portfolio válido.");
        }
    }

    validarEvidencia(observacionesVision) {
        if (!Array.isArray(observacionesVision)) {
            throw new Error("Las observacionesVision deben recibirse como arreglo.");
        }
    }

    encabezado() {
        return [
            "====================================================",
            "CONTEXTO EDITORIAL PORTFOLIO",
            "====================================================",
            "",
            "La información visual que aparece a continuación",
            "proviene de fotografías previamente curadas y",
            "evaluadas. Este módulo no ejecuta Vision."
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
            `Código: ${this.valor(portfolio.codigo)}`,
            `Categoría: ${this.valor(portfolio.categoria)}`,
            `Descripción registrada: ${this.valor(portfolio.descripcion)}`,
            `Ciudad: ${this.valor(portfolio.ciudad)}`,
            `Espacios registrados: ${this.lista(portfolio.espacios)}`,
            `Servicios: ${this.lista(portfolio.servicios)}`,
            `Año: ${this.valor(portfolio.anio)}`,
            `Cliente: ${this.valor(portfolio.cliente)}`
        ].join("\n");
    }

    seccionEvidencia(observacionesVision) {
        return [
            "",
            "====================================================",
            "EVIDENCIA VISUAL PERSISTIDA",
            "====================================================",
            "",
            `Fotografías recibidas: ${observacionesVision.length}`,
            `Fotografías con evidencia: ${observacionesVision.filter(observacion => observacion && observacion.analizada).length}`,
            `Materiales observados: ${this.lista(this.unicos(observacionesVision, "materiales"))}`,
            `Colores observados: ${this.lista(this.unicos(observacionesVision, "colores"))}`,
            `Elementos observados: ${this.lista(this.unicos(observacionesVision, "elementos"))}`,
            `Estilos observados: ${this.lista(this.unicos(observacionesVision, "estilo"))}`,
            `Iluminación observada: ${this.lista(this.unicos(observacionesVision, "iluminacion"))}`,
            `Sensaciones observadas: ${this.lista(this.unicos(observacionesVision, "sensacion"))}`
        ].join("\n");
    }

    seccionFotografias(observacionesVision) {
        const contenido = observacionesVision.length
            ? observacionesVision.map((observacion, indice) => this.formatearFotografia(observacion, indice)).join("\n\n")
            : "Sin fotografías disponibles.";

        return [
            "",
            "====================================================",
            "FOTOGRAFÍAS CURADAS",
            "====================================================",
            "",
            "Se conserva exactamente el orden recibido.",
            "La selección de fotografías no es una decisión de IA.",
            "",
            contenido
        ].join("\n");
    }

    formatearFotografia(observacion, indice) {
        const fotografia = observacion || {};

        return [
            `Fotografía ${indice + 1}`,
            `Identificador: ${this.valor(fotografia.fotografia)}`,
            `Espacio: ${this.valor(fotografia.espacio)}`,
            `Tipo: ${this.valor(fotografia.tipo)}`,
            `Plano: ${this.valor(fotografia.plano)}`,
            `Materiales: ${this.lista(fotografia.materiales)}`,
            `Colores: ${this.lista(fotografia.colores)}`,
            `Elementos: ${this.lista(fotografia.elementos)}`,
            `Estilo: ${this.valor(fotografia.estilo)}`,
            `Iluminación: ${this.valor(fotografia.iluminacion)}`,
            `Sensación: ${this.valor(fotografia.sensacion)}`,
            `Confianza: ${this.valor(fotografia.confianza)}`
        ].join("\n");
    }

    seccionReglas() {
        return [
            "",
            "====================================================",
            "REGLAS DE INTERPRETACIÓN",
            "====================================================",
            "",
            "• Observar e interpretar a partir de evidencia disponible.",
            "• No inventar personas, necesidades, usos o circunstancias.",
            "• No decidir inclusión ni orden de fotografías.",
            "• La Historia funciona como núcleo semántico editorial.",
            "• Hero Texto: 22–27 palabras.",
            "• Descripción: más breve que la de Proyecto y centrada en la pieza o colección.",
            "• SEO se produce en el mismo ciclo editorial, adaptando las reglas SEO de Proyecto al contexto Portfolio.",
            "• Servicios y Código son determinísticos y no requieren IA."
        ].join("\n");
    }

    unicos(observacionesVision, clave) {
        return [...new Set(
            observacionesVision
                .map(observacion => observacion && observacion[clave])
                .flatMap(valor => Array.isArray(valor) ? valor : [valor])
                .filter(valor => valor !== undefined && valor !== null && valor !== "")
                .map(String)
        )];
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

module.exports = ConstructorContextoPortfolio;
