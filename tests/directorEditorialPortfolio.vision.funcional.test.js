const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const DirectorEditorialPortfolio = require("../src/portfolio/directorEditorialPortfolio");

class VisionStub {
    constructor() { this.llamadas = []; }
    async analizarFotografia(foto) {
        this.llamadas.push(foto.nombre);
        foto.analizada = true;
        foto.espacio = "Sala";
        foto.tipo = "Mueble";
        foto.plano = "General";
        foto.estilo = "Contemporáneo";
        foto.materiales = ["Madera"];
        foto.colores = ["Blanco"];
        foto.elementos = ["Panel"];
        foto.iluminacion = "Natural";
        foto.sensacion = "Orden";
        foto.observaciones = "Observación de prueba";
        foto.confianza = 90;
    }
}

const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-portfolio-"));
const proyecto = {
    flujoEditorial: "EDITORIAL_PORTFOLIO",
    filaCSV: { Proyecto: "Prueba Portfolio" },
    rutaCSV: path.join(carpeta, "fuente.csv"),
    rutaProyecto: carpeta,
    nombre: "Prueba Portfolio",
    codigo: "MUB-TEST",
    galeria: [],
    obtenerGaleria() {
        return this.galeria;
    }
};
proyecto.galeria = [
    { nombre: "foto-001.JPG", ruta: "/tmp/foto-001.JPG" },
    { nombre: "foto-002.JPG", ruta: "/tmp/foto-002.JPG" }
];

(async () => {
    try {
        const vision = new VisionStub();
        const director = new DirectorEditorialPortfolio({ vision });
        const ruta = await director.analizarYPersistirEvidencia(proyecto);
        assert.strictEqual(vision.llamadas.length, 2);
        assert.deepStrictEqual(vision.llamadas, ["foto-001.JPG", "foto-002.JPG"]);
        assert.strictEqual(fs.existsSync(ruta), true);

        const evidencia = JSON.parse(fs.readFileSync(ruta, "utf8"));
        assert.strictEqual(evidencia.version, "PORTFOLIO-V1");
        assert.deepStrictEqual(
            evidencia.observacionesVision.map(item => item.fotografia),
            ["foto-001.JPG", "foto-002.JPG"]
        );
        assert.strictEqual(evidencia.observacionesVision.length, 2);

        console.log("✓ DirectorEditorialPortfolio: Vision productiva de galería y persistencia superadas");
    } finally {
        fs.rmSync(carpeta, { recursive: true, force: true });
    }
})().catch(error => {
    console.error(error);
    process.exit(1);
});
