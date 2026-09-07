const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ExpedienteProyecto = require("../src/direccionEditorial/expedienteProyecto");
const ExportadorEditorial = require("../src/Exportadores/exportadorEditorial");
const LectorEvidenciaVisual = require("../src/core/lectorEvidenciaVisual");

const directorio = fs.mkdtempSync(
    path.join(os.tmpdir(), "mubato-evidencia-")
);

const proyecto = {
    nombre: "Fixture Transporte Evidencia",
    codigo: "MUBATO-TEST",
    slug: "fixture-transporte-evidencia",
    cliente: "Cliente Fixture",
    ciudad: "Bogotá",
    categoria: ["Residencial"],
    rutaProyecto: directorio,
    fotografias: [
        {
            nombre: "foto-001.JPG",
            ruta: "/tmp/foto-001.JPG",
            analizada: true,
            espacio: "Sala",
            tipo: "",
            plano: "General",
            estilo: "Contemporáneo",
            materiales: ["madera", "vidrio"],
            colores: ["blanco", "gris"],
            elementos: ["televisor", "mueble"],
            iluminacion: "Natural",
            sensacion: "Calma",
            observaciones: "Mueble de madera bajo con televisor y panel vertical.",
            confianza: 91
        }
    ],
    galeria: []
};

const observacionOriginal =
    proyecto.fotografias[0].observaciones;

const expedienteProyecto = new ExpedienteProyecto();
proyecto.expediente = expedienteProyecto.construir(proyecto);

assert.strictEqual(
    proyecto.expediente.observacionesVision.length,
    1,
    "El expediente no contiene la observación visual."
);

assert.strictEqual(
    proyecto.expediente.observacionesVision[0].observaciones,
    observacionOriginal,
    "Las observaciones no sobrevivieron al paso Vision → ExpedienteProyecto."
);

const exportadorEditorial = new ExportadorEditorial();

const rutaEvidencia =
    exportadorEditorial.persistirEvidenciaVisual(proyecto);

assert.ok(
    fs.existsSync(rutaEvidencia),
    "No se creó el archivo de evidencia visual."
);

const evidenciaPersistida =
    JSON.parse(fs.readFileSync(rutaEvidencia, "utf8"));

assert.strictEqual(
    evidenciaPersistida.observacionesVision[0].observaciones,
    observacionOriginal,
    "Las observaciones no sobrevivieron a la persistencia JSON."
);

const lectorEvidenciaVisual =
    new LectorEvidenciaVisual();

const evidenciaRehidratada =
    lectorEvidenciaVisual.cargar(rutaEvidencia);

const observacionesRehidratadas =
    lectorEvidenciaVisual.extraerObservaciones(evidenciaRehidratada);

assert.strictEqual(
    observacionesRehidratadas[0].observaciones,
    observacionOriginal,
    "Las observaciones no sobrevivieron a LectorEvidenciaVisual."
);

console.log(
    "✓ Evidencia visual: observaciones transportadas y rehidratadas correctamente"
);

fs.rmSync(directorio, { recursive: true, force: true });
