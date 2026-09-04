const LectorEvidenciaVisual = require("../core/lectorEvidenciaVisual");
const ConstructorContextoPortfolio = require("./constructorContextoPortfolio");
const ComprensorEditorialPortfolio = require("./comprensorEditorialPortfolio");

class DirectorComprensionPortfolio {
    constructor({
        lectorEvidenciaVisual = new LectorEvidenciaVisual(),
        constructorContextoPortfolio = new ConstructorContextoPortfolio(),
        comprensorEditorialPortfolio
    } = {}) {
        this.lectorEvidenciaVisual = lectorEvidenciaVisual;
        this.constructorContextoPortfolio = constructorContextoPortfolio;
        this.comprensorEditorialPortfolio = comprensorEditorialPortfolio;
    }

    async comprender(portfolio, rutaEvidenciaVisual) {
        if (!rutaEvidenciaVisual || typeof rutaEvidenciaVisual !== "string") {
            throw new Error("DirectorComprensionPortfolio requiere la ruta de evidencia visual persistida.");
        }

        if (!this.comprensorEditorialPortfolio ||
            typeof this.comprensorEditorialPortfolio.comprender !== "function") {
            throw new Error("DirectorComprensionPortfolio requiere un ComprensorEditorialPortfolio válido.");
        }

        const evidencia = this.lectorEvidenciaVisual.cargar(rutaEvidenciaVisual);
        const observacionesVision = this.lectorEvidenciaVisual.extraerObservaciones(evidencia);
        const idsFotografias = observacionesVision.map(observacion => observacion.fotografia);

        const contexto = this.constructorContextoPortfolio.construir(
            portfolio,
            observacionesVision
        );

        return this.comprensorEditorialPortfolio.comprender(
            contexto,
            idsFotografias
        );
    }
}

module.exports = DirectorComprensionPortfolio;
