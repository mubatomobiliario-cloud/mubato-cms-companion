console.log("constructorContextoPortfolio.js cargado");

const contextoMarca = require("./contextoMarca");

/**
 * ConstructorContextoPortfolio
 *
 * Construye exclusivamente el contexto editorial de PORTFOLIO.
 * No modifica ni reutiliza las reglas narrativas específicas de Proyecto V2.2.
 *
 * Principio:
 * Portfolio describe una pieza o colección de mobiliario a partir de la
 * evidencia disponible; no fuerza un arco de transformación de Proyecto.
 */
class ConstructorContextoPortfolio {
    construirHistoria(portfolio) {
        return this.construirPortfolio(portfolio, "HISTORIA_PORTFOLIO");
    }

    construirHero(portfolio) {
        return this.construirPortfolio(portfolio, "HERO_PORTFOLIO");
    }

    construirDescripcion(portfolio) {
        return this.construirPortfolio(portfolio, "DESCRIPCION_PORTFOLIO");
    }

    construirSEO(portfolio, historia = "") {
        return this.construirPortfolio(
            portfolio,
            "SEO_PORTFOLIO",
            historia ? `\nHISTORIA PORTFOLIO\n${historia}\n` : ""
        );
    }

    construirPortfolio(portfolio, contrato, adicional = "") {
        if (!portfolio || typeof portfolio !== "object" || Array.isArray(portfolio)) {
            throw new Error("Falta un objeto Portfolio válido.");
        }

        return this.encabezado(contrato)
            + this.seccionMarca()
            + this.seccionPieza(portfolio)
            + this.seccionEvidencia(portfolio.expediente || {})
            + this.seccionFotografias(portfolio)
            + adicional;
    }

    encabezado(nombre) {
        return `\n====================================================\nCONTRATO EDITORIAL PORTFOLIO: ${nombre}\n====================================================\n`;
    }

    seccionMarca() {
        return `\n====================================================\nCONTEXTO DE MARCA MUBATO\n====================================================\n\n${JSON.stringify(contextoMarca, null, 2)}\n`;
    }

    seccionPieza(portfolio) {
        return `\n====================================================\nPIEZA / COLECCIÓN\n====================================================\n\nNombre\n${this.valor(portfolio.nombre)}\n\nCódigo\n${this.valor(portfolio.codigo || "Pendiente")}\n\nCategoría\n${this.lista(portfolio.categoria)}\n\nDescripción registrada\n${this.valor(portfolio.descripcion)}\n\nMateriales registrados\n${this.lista(portfolio.materiales)}\n\nColores registrados\n${this.lista(portfolio.colores)}\n\nElementos registrados\n${this.lista(portfolio.elementos)}\n\nEspacios registrados\n${this.lista(portfolio.espacios)}\n`;
    }

    seccionEvidencia(expediente) {
        const observaciones = Array.isArray(expediente.observacionesVision)
            ? expediente.observacionesVision
            : [];

        const agregados = this.agregarObservaciones(observaciones);

        return `\n====================================================\nEVIDENCIA VISUAL DISPONIBLE\n====================================================\n\nVersión\n${this.valor(expediente.version)}\n\nMateriales observados\n${this.lista(agregados.materiales)}\n\nColores observados\n${this.lista(agregados.colores)}\n\nElementos observados\n${this.lista(agregados.elementos)}\n\nEstilos observados\n${this.lista(agregados.estilos)}\n\nIluminación observada\n${this.lista(agregados.iluminacion)}\n\nSensaciones observadas\n${this.lista(agregados.sensaciones)}\n\nFotografías analizadas\n${observaciones.filter(f => f.analizada).length} de ${observaciones.length}\n`;
    }

    seccionFotografias(portfolio) {
        const fotografias = Array.isArray(portfolio.fotografias)
            ? portfolio.fotografias
            : [];

        return `\n====================================================\nFOTOGRAFÍAS\n====================================================\n\n${fotografias.length ? fotografias.map((foto, indice) => this.fotografia(foto, indice)).join("\n") : "Sin fotografías disponibles."}\n`;
    }

    fotografia(fotografia, indice) {
        return `Fotografía ${indice + 1}\nNombre: ${this.valor(fotografia?.nombre)}\nEspacio: ${this.valor(fotografia?.espacio)}\nTipo: ${this.valor(fotografia?.tipo)}\nPlano: ${this.valor(fotografia?.plano)}\nMateriales: ${this.lista(fotografia?.materiales)}\nColores: ${this.lista(fotografia?.colores)}\nElementos: ${this.lista(fotografia?.elementos)}\nEstilo: ${this.valor(fotografia?.estilo)}\nIluminación: ${this.valor(fotografia?.iluminacion)}\nSensación: ${this.valor(fotografia?.sensacion)}\nConfianza Vision: ${this.valor(fotografia?.confianza)}\nDescripción registrada: ${this.valor(fotografia?.description)}\n`;
    }

    agregarObservaciones(observaciones) {
        const unicos = valores => [...new Set(valores.filter(Boolean))];

        return {
            materiales: unicos(observaciones.flatMap(o => Array.isArray(o.materiales) ? o.materiales : [])),
            colores: unicos(observaciones.flatMap(o => Array.isArray(o.colores) ? o.colores : [])),
            elementos: unicos(observaciones.flatMap(o => Array.isArray(o.elementos) ? o.elementos : [])),
            estilos: unicos(observaciones.map(o => o.estilo)),
            iluminacion: unicos(observaciones.map(o => o.iluminacion)),
            sensaciones: unicos(observaciones.map(o => o.sensacion))
        };
    }

    lista(valores) {
        if (!Array.isArray(valores) || valores.length === 0) return "Sin información";
        return valores.filter(Boolean).map(item => `• ${item}`).join("\n");
    }

    valor(valor) {
        if (valor === undefined || valor === null || valor === "") return "Sin información";
        return String(valor);
    }
}

module.exports = ConstructorContextoPortfolio;
