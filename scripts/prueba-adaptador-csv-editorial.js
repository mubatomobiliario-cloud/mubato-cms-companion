const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const AdaptadorCSVEditorial = require("../src/Exportadores/adaptadorCSVEditorial");

console.log("======================================");
console.log("PRUEBA CONTROLADA — ADAPTADOR CSV");
console.log("FILA PENDIENTE REAL");
console.log("======================================");
console.log("");

const rutaEntrada = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Araque",
    "Historias+de+Transformación (10).csv"
);

const rutaSalida = path.join(
    __dirname,
    "..",
    "Proyectos",
    "Araque",
    "salida",
    "Hogar_Araque_EDITORIAL.csv"
);

const contenido = fs.readFileSync(rutaEntrada, "utf8");
const parsed = Papa.parse(contenido, {
    header: true,
    skipEmptyLines: true
});

if (parsed.errors.length > 0) {
    throw new Error(`Error leyendo CSV: ${JSON.stringify(parsed.errors)}`);
}

const filaPendiente = parsed.data.find(fila => {
    const codigo = fila["Código MUBATO"] || "";
    return String(codigo).trim() === "";
});

if (!filaPendiente) {
    throw new Error("No se encontró ninguna fila pendiente (Código MUBATO vacío).");
}

console.log(`✓ Fila pendiente encontrada: ${filaPendiente["Proyecto"] || "(sin nombre)"}`);
console.log(`✓ Código MUBATO antes: ${filaPendiente["Código MUBATO"] || "(vacío)"}`);
console.log("");

const adaptador = new AdaptadorCSVEditorial();

const resultado = adaptador.exportar({
    rutaEntrada,
    rutaSalida,
    filaProyecto: filaPendiente,
    camposEditoriales: {
        codigo: "MUB-PRUEBA-001",
        seoTitle: "Prueba editorial controlada | MUBATO",
        metaDescription: "Prueba controlada del adaptador CSV editorial de MUBATO.",
        slug: "prueba-editorial-controlada"
    }
});

console.log("======================================");
console.log("RESULTADO");
console.log("======================================");
console.log("");
console.log(JSON.stringify(resultado, null, 2));
console.log("");
console.log("NOTA: esta prueba no llama a IA.");
console.log("La fila se selecciona por Código MUBATO vacío.");
console.log("El CSV original no se modifica.");
console.log("");
