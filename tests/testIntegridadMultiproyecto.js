console.log("testIntegridadMultiproyecto.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const PROJECTS_DIR = path.resolve(__dirname, "../Proyectos");
const PROJECT_NAMES = ["Hogar Tijo", "Hogar Rolón", "Hogar Quesada", "Hogar Araque"];
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif)$/i;

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
    // No es JSON; continuar con extracción de nombres.
  }

  const matches = text.match(/[^\\/\"'\[\],;]+\.(?:jpe?g|png|webp|heic|heif)/gi) || [];
  matches.forEach(match => output.add(path.basename(match.trim())));

  return output;
}

function findInputCsv(projectDir) {
  const candidates = fs.readdirSync(projectDir)
    .filter(name => /\.csv$/i.test(name))
    .filter(name => !/salida-editorial|salida/i.test(name))
    .map(name => path.join(projectDir, name));

  return candidates[0] || null;
}

function findEvidence(projectDir) {
  const candidates = fs.readdirSync(projectDir)
    .filter(name => /evidencia-visual\.json$/i.test(name))
    .map(name => path.join(projectDir, name));

  return candidates[0] || null;
}

function inspectProject(projectName) {
  const projectDir = path.join(PROJECTS_DIR, projectName);
  const result = {
    projectName,
    exists: fs.existsSync(projectDir),
    csvFile: null,
    csvRows: 0,
    galleryCount: 0,
    gallerySet: new Set(),
    physicalSet: new Set(),
    evidenceFile: null,
    evidenceSet: new Set(),
    issues: []
  };

  if (!result.exists) {
    result.issues.push("No existe la carpeta local del proyecto.");
    return result;
  }

  result.physicalSet = new Set(
    fs.readdirSync(projectDir).filter(name => IMAGE_EXTENSIONS.test(name))
  );

  result.csvFile = findInputCsv(projectDir);
  if (!result.csvFile) {
    result.issues.push("No se encontró CSV de entrada.");
  } else {
    const rows = Papa.parse(fs.readFileSync(result.csvFile, "utf8"), {
      header: true,
      skipEmptyLines: true
    }).data;

    result.csvRows = rows.length;
    const galleryValues = rows
      .map(row => row["Galería General"])
      .filter(value => normalize(value) !== "");

    result.galleryCount = galleryValues.length;
    result.gallerySet = extractImageNames(galleryValues);
  }

  result.evidenceFile = findEvidence(projectDir);
  if (!result.evidenceFile) {
    result.issues.push("No se encontró evidencia visual.");
  } else {
    try {
      const evidence = JSON.parse(fs.readFileSync(result.evidenceFile, "utf8"));
      result.evidenceSet = extractImageNames(evidence);
    } catch (error) {
      result.issues.push(`Evidencia visual inválida: ${error.message}`);
    }
  }

  const galleryWithoutPhysical = [...result.gallerySet]
    .filter(name => !result.physicalSet.has(name));
  const galleryWithoutEvidence = [...result.gallerySet]
    .filter(name => !result.evidenceSet.has(name));
  const evidenceWithoutPhysical = [...result.evidenceSet]
    .filter(name => !result.physicalSet.has(name));
  const evidenceNotInGallery = [...result.evidenceSet]
    .filter(name => !result.gallerySet.has(name));

  result.galleryWithoutPhysical = galleryWithoutPhysical;
  result.galleryWithoutEvidence = galleryWithoutEvidence;
  result.evidenceWithoutPhysical = evidenceWithoutPhysical;
  result.evidenceNotInGallery = evidenceNotInGallery;

  if (galleryWithoutPhysical.length) {
    result.issues.push(`Galería → disco: ${galleryWithoutPhysical.length} identidad(es) faltante(s).`);
  }

  if (galleryWithoutEvidence.length) {
    result.issues.push(`Galería → evidencia: ${galleryWithoutEvidence.length} identidad(es) sin evidencia.`);
  }

  if (evidenceWithoutPhysical.length) {
    result.issues.push(`Evidencia → disco: ${evidenceWithoutPhysical.length} identidad(es) sin archivo físico.`);
  }

  return result;
}

console.log("");
console.log("======================================");
console.log("PRUEBA — INTEGRIDAD MULTIPROYECTO");
console.log("======================================");
console.log("");
console.log("Objetivo: verificar la coherencia local de Tijo, Rolón, Quesada y Araque.");
console.log("La prueba no consulta Wix en tiempo real y no realiza llamadas a OpenAI.");
console.log("");

try {
  if (!fs.existsSync(PROJECTS_DIR)) {
    throw new Error(`No existe la carpeta de proyectos: ${PROJECTS_DIR}`);
  }

  const results = PROJECT_NAMES.map(inspectProject);
  let failures = 0;

  for (const result of results) {
    console.log("======================================");
    console.log(`PROYECTO — ${result.projectName}`);
    console.log("======================================");

    if (!result.exists) {
      console.log("✗ Carpeta local no encontrada.");
      failures++;
      continue;
    }

    console.log("✓ Carpeta local encontrada.");
    console.log(`✓ Fotografías físicas: ${result.physicalSet.size}`);

    if (result.csvFile) {
      console.log(`✓ CSV: ${path.basename(result.csvFile)}`);
      console.log(`✓ Filas CSV: ${result.csvRows}`);
      console.log(`✓ Identidades en Galería General: ${result.gallerySet.size}`);
    } else {
      console.log("✗ CSV de entrada no encontrado.");
    }

    if (result.evidenceFile) {
      console.log(`✓ Evidencia: ${path.basename(result.evidenceFile)}`);
      console.log(`✓ Identidades en evidencia: ${result.evidenceSet.size}`);
    } else {
      console.log("⚠ Evidencia visual no encontrada.");
    }

    console.log(`✓ Galería → disco: ${result.galleryWithoutPhysical.length === 0 ? "OK" : "INCONSISTENCIA"}`);
    if (result.galleryWithoutPhysical.length) {
      result.galleryWithoutPhysical.forEach(name => console.log(`  ✗ ${name}`));
    }

    console.log(`✓ Galería → evidencia: ${result.galleryWithoutEvidence.length === 0 ? "OK" : "INCONSISTENCIA"}`);
    if (result.galleryWithoutEvidence.length) {
      result.galleryWithoutEvidence.forEach(name => console.log(`  ✗ ${name}`));
    }

    console.log(`✓ Evidencia → disco: ${result.evidenceWithoutPhysical.length === 0 ? "OK" : "INCONSISTENCIA"}`);
    if (result.evidenceWithoutPhysical.length) {
      result.evidenceWithoutPhysical.forEach(name => console.log(`  ✗ ${name}`));
    }

    if (result.issues.length) {
      failures++;
      console.log("⚠ Diagnóstico:");
      result.issues.forEach(issue => console.log(`  • ${issue}`));
    } else {
      console.log("✓ Integridad local completa.");
    }

    if (result.evidenceNotInGallery.length) {
      console.log(`⚠ Evidencia no declarada en Galería: ${result.evidenceNotInGallery.length}`);
      result.evidenceNotInGallery.forEach(name => console.log(`  • ${name}`));
    }

    console.log("");
  }

  console.log("======================================");

  if (failures) {
    console.log("DIAGNÓSTICO — REVISIÓN REQUERIDA");
    console.log("======================================");
    console.log("");
    console.log(`⚠ Proyectos con incidencias: ${failures}/${PROJECT_NAMES.length}`);
    console.log("✓ La prueba no modificó ningún proyecto ni el CMS.");
    console.log("✓ No se realizó ninguna llamada a OpenAI.");
    process.exitCode = 1;
  } else {
    console.log("PRUEBA SUPERADA");
    console.log("======================================");
    console.log("");
    console.log(`✓ ${PROJECT_NAMES.length}/${PROJECT_NAMES.length} proyectos íntegros localmente.`);
    console.log("✓ Las identidades de Galería, disco y evidencia son reconciliables.");
    console.log("✓ La prueba no modificó ningún proyecto ni el CMS.");
    console.log("✓ No se realizó ninguna llamada a OpenAI.");
  }
} catch (error) {
  console.log("");
  console.log("======================================");
  console.log("ERROR DE DIAGNÓSTICO");
  console.log("======================================");
  console.error(error.message);
  process.exitCode = 1;
}
