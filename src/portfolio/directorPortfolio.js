const LectorEvidenciaVisual = require("../core/lectorEvidenciaVisual");
const ConstructorContextoPortfolio = require("./constructorContextoPortfolio");

/**
 * DirectorPortfolio
 *
 * Orquestador mínimo del flujo PORTFOLIO.
 *
 * PRINCIPIOS
 * - Consume evidencia visual ya persistida.
 * - No ejecuta Vision.
 * - No decide qué fotografías pertenecen al Portfolio.
 * - No depende de Proyecto V2.2.
 * - Separa lectura de evidencia y construcción de contexto.
 */
class DirectorPortfolio {
    constructor({
        lectorEvidenciaVisual = new LectorEvidenciaVisual(),
        constructorContextoPortfolio = new ConstructorContextoPortfolio()
    } = {}) {
        this.lectorEvidenciaVisual = lectorEvidenciaVisual;
        this.constructorContextoPortfolio = constructorContextoPortfolio;
    }

    construirContexto(portfolio, rutaEvidenciaVisual) {
        if (!rutaEvidenciaVisual || typeof rutaEvidenciaVisual !== "string") {
            throw new Error("DirectorPortfolio requiere la ruta de evidencia visual persistida.");
        }

        const evidencia = this.lectorEvidenciaVisual.cargar(rutaEvidenciaVisual);
        const observacionesVision = this.lectorEvidenciaVisual.extraerObservaciones(evidencia);

        return this.constructorContextoPortfolio.construir(
            portfolio,
            observacionesVision
        );
    }
}

module.exports = DirectorPortfolio;
