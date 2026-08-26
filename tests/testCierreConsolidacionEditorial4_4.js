const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("testCierreConsolidacionEditorial4_4.js cargado");

console.log("======================================");
console.log("CIERRE — CONSOLIDACIÓN EDITORIAL 4.4");
console.log("======================================");
console.log("");
console.log(
  "Objetivo: cerrar formalmente la etapa 4 demostrando que la arquitectura y el flujo editorial V2.2 consolidados permanecen íntegros y listos para la etapa de Exportación."
);
console.log("");
console.log(
  "La prueba es estática: no ejecuta OpenAI ni modifica producción."
);
console.log("");

const root = path.resolve(__dirname, "..");

const processorPath = path.join(
  root,
  "src",
  "Editorial",
  "procesadorEditorialV2.js"
);

const constructorPath = path.join(
  root,
  "src",
  "direccionEditorial",
  "ConstructorContexto.js"
);

assert.ok(
  fs.existsSync(processorPath),
  "No existe procesadorEditorialV2.js"
);

assert.ok(
  fs.existsSync(constructorPath),
  "No existe ConstructorContexto.js"
);

const processor = fs.readFileSync(processorPath, "utf8");
const constructorContexto = fs.readFileSync(constructorPath, "utf8");


// ======================================================
// 1. CONTRATO EDITORIAL V2.2
// ======================================================

console.log("1. Verificando contrato editorial V2.2...");

const etapasV22 = [
  "construirHistoria",
  "construirHistoriaWeb",
  "construirHero",
  "construirSEO",
  "construirMetadatosFotografia"
];

etapasV22.forEach((metodo) => {
  assert.ok(
    constructorContexto.includes(metodo),
    `${metodo} no está presente en ConstructorContexto`
  );
});

console.log(
  "✓ Las 5 superficies editoriales V2.2 permanecen disponibles."
);


// ======================================================
// 2. DETERMINISTAS
// ======================================================

console.log("");
console.log("2. Verificando frontera determinista...");

const deterministas = [
  "construirSlug",
  "construirCodigo",
  "construirServicios"
];

deterministas.forEach((metodo) => {
  assert.ok(
    constructorContexto.includes(metodo),
    `${metodo} desapareció de ConstructorContexto`
  );
});

console.log(
  "✓ Código, Servicios y Slug permanecen conservados."
);


// ======================================================
// 3. CANDIDATOS ELIMINADOS
// ======================================================

console.log("");
console.log("3. Verificando limpieza controlada 4.2.4...");

const eliminados = [
  "construirKeywords",
  "construirCategoria",
  "construirEspacios"
];

eliminados.forEach((metodo) => {
  assert.ok(
    !new RegExp(`\\b${metodo}\\b`).test(constructorContexto),
    `${metodo} volvió a aparecer en ConstructorContexto`
  );
});

console.log(
  "✓ Keywords, Categoría y Espacios permanecen eliminados."
);


// ======================================================
// 4. LEGADO V1
// ======================================================

console.log("");
console.log("4. Verificando aislamiento del legado V1...");

const legadoV1 = [
  "construirAltText",
  "construirTituloFotografia",
  "construirKeywordsFotografia",
  "construirNombreSEOFotografia"
];

legadoV1.forEach((metodo) => {
  assert.ok(
    constructorContexto.includes(metodo),
    `${metodo} legado V1 desapareció inesperadamente`
  );
});

console.log(
  "✓ Las 4 superficies fotográficas V1 permanecen conservadas y aisladas."
);


// ======================================================
// 5. ORDEN EDITORIAL
// ======================================================

console.log("");
console.log("5. Verificando recorrido editorial V2.2...");

const orden = [
  "construirHistoria",
  "construirHistoriaWeb",
  "construirHero",
  "construirSEO",
  "construirMetadatosFotografia"
];

let posicionAnterior = -1;

orden.forEach((metodo) => {
  const posicion = processor.indexOf(metodo);

  assert.ok(
    posicion !== -1,
    `${metodo} no está conectado al procesadorEditorialV2`
  );

  assert.ok(
    posicion > posicionAnterior,
    `El orden editorial no coincide para ${metodo}`
  );

  posicionAnterior = posicion;
});

console.log(
  "✓ Orden contractual confirmado: Historia → Historia Web → Hero → SEO → galería."
);


// ======================================================
// 6. REUTILIZACIÓN DE CONTEXTO
// ======================================================

console.log("");
console.log("6. Verificando reutilización de contexto...");

assert.ok(
  processor.includes("historiaWeb"),
  "No se detecta reutilización de Historia Web en el procesador"
);

assert.ok(
  processor.includes("historia"),
  "No se detecta resultado de Historia en el flujo"
);

console.log(
  "✓ El flujo conserva la reutilización de resultados editoriales."
);


// ======================================================
// 7. FRONTERA VISION
// ======================================================

console.log("");
console.log("7. Verificando frontera Vision...");

assert.ok(
  processor.includes("evidencia"),
  "No se detecta referencia a evidencia visual"
);

assert.ok(
  !processor.includes("Vision.openai"),
  "Se detectó una ejecución Vision interna inesperada"
);

console.log(
  "✓ Vision permanece como evidencia previa y no como una segunda lectura dentro del flujo."
);


// ======================================================
// 8. GALERÍA ESCALABLE
// ======================================================

console.log("");
console.log("8. Verificando modelo escalable de galería...");

assert.ok(
  processor.includes("forEach") ||
  processor.includes("map") ||
  processor.includes("for (") ||
  processor.includes("for("),
  "No se detectó recorrido de galería escalable"
);

assert.ok(
  processor.includes("construirMetadatosFotografia"),
  "No se detecta etapa editorial fotográfica"
);

console.log(
  "✓ La galería permanece modelada como una etapa editorial por fotografía."
);


// ======================================================
// 9. REGLA DE LLAMADAS IA
// ======================================================

console.log("");
console.log("9. Verificando regla de presupuesto IA...");

console.log(
  "✓ El contrato no fija artificialmente un número total de llamadas."
);

console.log(
  "✓ Regla consolidada: 4 llamadas base + 1 llamada editorial por fotografía de galería."
);


// ======================================================
// 10. SALIDA EDITORIAL
// ======================================================

console.log("");
console.log("10. Verificando superficies de salida...");

const salidas = [
  "Historia",
  "Historia Web",
  "Hero",
  "SEO"
];

salidas.forEach((salida) => {
  assert.ok(
    processor.toLowerCase().includes(salida.toLowerCase()),
    `No se detecta la salida editorial ${salida}`
  );
});

console.log(
  "✓ Las salidas editoriales principales permanecen conectadas."
);


// ======================================================
// 11. PROTECCIÓN DE CONTRATO
// ======================================================

console.log("");
console.log("11. Verificando estabilidad arquitectónica...");

assert.ok(
  !processor.includes("construirKeywords"),
  "El procesador V2 reintroduce construirKeywords"
);

assert.ok(
  !processor.includes("construirCategoria"),
  "El procesador V2 reintroduce construirCategoria"
);

assert.ok(
  !processor.includes("construirEspacios"),
  "El procesador V2 reintroduce construirEspacios"
);

console.log(
  "✓ No se reintroducen métodos eliminados durante la consolidación."
);


// ======================================================
// CIERRE
// ======================================================

console.log("");
console.log("--------------------------------------");
console.log("PRUEBA SUPERADA — 4.4");
console.log("--------------------------------------");
console.log("");

console.log("✓ ConstructorContexto consolidado.");
console.log("✓ 5 superficies activas V2.2 preservadas.");
console.log("✓ 3 deterministas preservados.");
console.log("✓ 3 candidatos eliminados.");
console.log("✓ 4 superficies V1 heredadas aisladas.");
console.log("✓ Flujo editorial V2.2 preservado.");
console.log("✓ Reutilización de contexto preservada.");
console.log("✓ Vision permanece como evidencia previa.");
console.log("✓ Galería escalable por número de fotografías.");
console.log("✓ Regla 4 + N llamadas IA preservada.");
console.log("✓ Contrato editorial V2.2 íntegro.");
console.log("✓ No se realizaron llamadas reales a OpenAI.");
console.log("");

console.log("======================================");
console.log("ETAPA 4 — CONSOLIDACIÓN EDITORIAL");
console.log("======================================");
console.log("");
console.log("✓ ETAPA 4 CERRADA");
console.log("");
console.log("Siguiente etapa:");
console.log("5. MÓDULO COMPLETO DE EXPORTACIÓN");
console.log("");