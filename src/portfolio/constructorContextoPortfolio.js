/**
 * ConstructorContextoPortfolio
 *
 * Construye el contexto editorial de PORTFOLIO a partir de información
 * estructurada y evidencia visual ya persistida.
 *
 * PRINCIPIOS
 * - No ejecuta Vision.
 * - No decide qué fotografías pertenecen al Portfolio.
 * - No modifica ni reutiliza las reglas narrativas de Proyecto V2.2.
 * - Conserva la selección y el orden editorial recibidos.
 * - Reúne en un único contexto la información necesaria para la producción
 *   editorial, minimizando llamadas posteriores a IA.
 */
class ConstructorContextoPortfolio {
    construir(portfolio = {}) {
        this.validarEntrada(portfolio);

        const fotografias = Array.isArray(portfolio.fotografias)
            ? portfolio.fotografias
            : [];

        const evidencia = this.extraerEvidencia(fotografias);

        return [
            this.encabezado(),
            this.seccionPieza(portfolio),
            this.seccionEvidencia(evidencia),
            this.seccionFotografias(fotografias),
            this.seccionReglas()
        ].join("\n");
    }

    validarEntrada(portfolio) {
        if (!portfolio || typeof portfolio !== "object" || Array.isArray(portfolio)) {
            throw new Error("Falta un objeto Portfolio válido.");
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

    seccionEvidencia(evidencia) {
        return [
            "",
            "====================================================",
            "EVIDENCIA VISUAL PERSISTIDA",
            "====================================================",
            "",
            `Fotografías recibidas: ${evidencia.total}`,
            `Fotografías con evidencia: ${evidencia.conEvidencia}`,
            `Materiales observados: ${this.lista(evidencia.materiales)}`,
            `Colores observados: ${this.lista(evidencia.colores)}`,
            `Elementos observados: ${this.lista(evidencia.elementos)}`,
            `Estilos observados: ${this.lista(evidencia.estilos)}`,
            `Iluminación observada: ${this.lista(evidencia.iluminacion)}`,
            `Sensaciones observadas: ${this.lista(evidencia.sensaciones)}`
        ].join("\n");
    }

    seccionFotografias(fotografias) {
        const contenido = fotografias.length
            ? fotografias.map((fotografia, indice) => this.formatearFotografia(fotografia, indice)).join("\n\n")
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

    formatearFotografia(fotografia, indice) {
        const evidencia = fotografia && typeof fotografia.evidencia === "object"
            ? fotografia.evidencia
            : fotografia || {};

        return [
            `Fotografía ${indice + 1}`,
            `Identificador: ${this.valor(fotografia?.id || fotografia?.nombre)}`,
            `Espacio: ${this.valor(fotografia?.espacio)}`,
            `Tipo: ${this.valor(fotografia?.tipo)}`,
            `Plano: ${this.valor(fotografia?.plano)}`,
            `Materiales: ${this.lista(evidencia.materiales)}`,
            `Colores: ${this.lista(evidencia.colores)}`,
            `Elementos: ${this.lista(evidencia.elementos)}`,
            `Estilo: ${this.valor(evidencia.estilo)}`,
            `Iluminación: ${this.valor(evidencia.iluminacion)}`,
            `Sensación: ${this.valor(evidencia.sensacion)}`,
            `Confianza: ${this.valor(evidencia.confianza)}`,
            `Descripción registrada: ${this.valor(fotografia?.description || evidencia.description)}`
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

    extraerEvidencia(fotografias) {
        const unicos = valores => [...new Set(
            valores
                .flatMap(valor => Array.isArray(valor) ? valor : [valor])
                .filter(valor => valor !== undefined && valor !== null && valor !== "")
                .map(String)
        )];

        const obtener = clave => fotografias.map(fotografia => {
            const evidencia = fotografia && typeof fotografia.evidencia === "object"
                ? fotografia.evidencia
                : fotografia || {};
            return evidencia[clave];
        });

        return {
            total: fotografias.length,
            conEvidencia: fotografias.filter(fotografia => fotografia?.evidencia).length,
            materiales: unicos(obtener("materiales")),
            colores: unicos(obtener("colores")),
            elementos: unicos(obtener("elementos")),
            estilos: unicos(obtener("estilo")),
            iluminacion: unicos(obtener("iluminacion")),
            sensaciones: unicos(obtener("sensacion"))
        };
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
