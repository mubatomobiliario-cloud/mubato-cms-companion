console.log("testIntegridadEvidenciaVisual.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const PROJECT_DIR = path.resolve(__dirname, "../Proyectos/Andrés Giraldo");
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif)$/i;

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exitCode = 1;
}

function normalize(value) {
  return String(value || "").trim();
}

function extractImageNames(value, output = new Set()) {
  if (value === null || value === undefined) return output;

  if (Array.isArray(value)) {
    value.forEach(item => extractImageNames(item, output));
    return output;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (IMAGE_EXTENSIONS.test(key)) output.add(path.basename(key));
      extractImageNames(item, output);
    });
    return output;
  }

  const text = String(value);

  try {
    const parsed = JSON.parse(text);
    return extractImageNames(parsed, output);
  } catch (_) {
    // Not JSON: continue with filename extraction.
  }

  const matches = text.match(/[^\\/\"'\[\],;]+\.(?:jpe?g|png|webp|heic|heif)/gi) || [];
  matches.forEach(match => output.add(path.basename(match.trim())));

  return output;
}

function readFirstCsv(projectDir) {
  const csv = fs.readdirSync(projectDir)
    .filter(name => /\.csv$/i.test(name))
    .map(name => path.join(projectDir, name))
    .find(file => !/salida-editorial|salida/i.test(path.basename(file)));

  if (!csv) throw new Error("No se encontró CSV de entrada en el proyecto.");
  return csv;
}

function readEvidence(projectDir) {
  const evidenceFile = fs.readdirSync(projectDir)
    .filter(name => /evidencia-visual\.json$/i.test(name))
    .map(name => path.join(projectDir, name))[0];

  if (!evidenceFile) throw new Error("No se encontró archivo de evidencia visual.");

  return {
    file: evidenceFile,
    data: JSON.parse(fs.readFileSync(evidenceFile, "utf8"))
  };
}

console.log("");
console.log("======================================");
console.log("PRUEBA — INTEGRIDAD EVIDENCIA VISUAL");
console.log("======================================");
console.log("");

try {
  if (!fs.existsSync(PROJECT_DIR)) {
    throw new Error(`No existe el proyecto: ${PROJECT_DIR}`);
  }

  console.log(`Proyecto: ${path.basename(PROJECT_DIR)}`);

  // 1. Fotografías físicas realmente disponibles.
  const physicalFiles = fs.readdirSync(PROJECT_DIR)
    .filter(name => IMAGE_EXTENSIONS.test(name));
  const physicalSet = new Set(physicalFiles);

  console.log("");
  console.log("1. FOTOGRAFÍAS FÍSICAS");
  console.log(`✓ Fotografías encontradas en disco: ${physicalFiles.length}`);
  physicalFiles.forEach((name, index) => console.log(`  ${String(index + 1).padStart(2, "0")} | ${name}`));

  // 2. Identidad declarada por Galería General en el CSV.
  const csvFile = readFirstCsv(PROJECT_DIR);
  const rows = Papa.parse(fs.readFileSync(csvFile, "utf8"), {
    header: true,
    skipEmptyLines: true
  }).data;

  if (!rows.length) throw new Error("El CSV no contiene filas de datos.");

  const galleryValues = rows.map(row => row["Galería General"]).filter(value => normalize(value) !== "");
  const csvGallerySet = extractImageNames(galleryValues);

  console.log("");
  console.log("2. GALERÍA GENERAL — CSV");
  console.log(`✓ Archivo: ${path.basename(csvFile)}`);
  console.log(`✓ Filas con Galería General: ${galleryValues.length}`);
  console.log(`✓ Identidades fotográficas detectadas: ${csvGallerySet.size}`);
  csvGallerySet.forEach(name => console.log(`  • ${name}`));

  // 3. Identidad almacenada en evidencia visual.
  const evidence = readEvidence(PROJECT_DIR);
  const evidenceSet = extractImageNames(evidence.data);

  console.log("");
  console.log("3. EVIDENCIA VISUAL");
  console.log(`✓ Archivo: ${path.basename(evidence.file)}`);
  console.log(`✓ Identidades fotográficas detectadas: ${evidenceSet.size}`);
  evidenceSet.forEach(name => console.log(`  • ${name}`));

  // 4. Reconciliación.
  const missingFromDisk = [...csvGallerySet].filter(name => !physicalSet.has(name));
  const galleryWithoutEvidence = [...csvGallerySet].filter(name => !evidenceSet.has(name));
  const evidenceWithoutPhysical = [...evidenceSet].filter(name => !physicalSet.has(name));
  const evidenceNotInGallery = [...evidenceSet].filter(name => !csvGallerySet.has(name));

  console.log("");
  console.log("4. RECONCILIACIÓN DE IDENTIDADES");

  console.log(`✓ Galería → disco: ${missingFromDisk.length === 0 ? "OK" : "INCONSISTENCIA"}`);
  if (missingFromDisk.length) missingFromDisk.forEach(name => console.log(`  ✗ En Galería pero NO en disco: ${name}`));

  console.log(`✓ Galería → evidencia: ${galleryWithoutEvidence.length === 0 ? "OK" : "INCONSISTENCIA"}`);
  if (galleryWithoutEvidence.length) galleryWithoutEvidence.forEach(name => console.log(`  ✗ En Galería pero SIN evidencia Vision: ${name}`));

  console.log(`✓ Evidencia → disco: ${evidenceWithoutPhysical.length === 0 ? "OK" : "INCONSISTENCIA"}`);
  if (evidenceWithoutPhysical.length) evidenceWithoutPhysical.forEach(name => console.log(`  ✗ En evidencia pero NO en disco: ${name}`));

  console.log(`✓ Evidencia → Galería: ${evidenceNotInGallery.length === 0 ? "OK" : "ADVERTENCIA"}`);
  if (evidenceNotInGallery.length) evidenceNotInGallery.forEach(name => console.log(`  • Evidencia no declarada en Galería: ${name}`));

  console.log("");
  console.log("======================================");

  if (missingFromDisk.length || galleryWithoutEvidence.length || evidenceWithoutPhysical.length) {
    console.log("DIAGNÓSTICO — INTEGRIDAD FALLIDA");
    console.log("======================================");
    console.log("");
    console.log("Existe una desalineación entre las identidades de las fotografías.");
    console.log("No se ejecutó ninguna llamada a OpenAI.");
    process.exitCode = 1;
  } else {
    console.log("PRUEBA SUPERADA");
    console.log("======================================");
    console.log("");
    console.log("✓ Las identidades de Galería, disco y evidencia son reconciliables.");
    console.log("✓ No se ejecutó ninguna llamada a OpenAI.");
  }
} catch (error) {
  console.log("");
  console.log("======================================");
  console.log("ERROR DE DIAGNÓSTICO");
  console.log("======================================");
  console.error(error.message);
  process.exitCode = 1;
}
