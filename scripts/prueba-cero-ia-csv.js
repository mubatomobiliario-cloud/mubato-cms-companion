const fs = require("fs");
const Papa = require("papaparse");

const ruta = "Proyectos/Araque/Historias+de+Transformación (10).csv";
const csv = fs.readFileSync(ruta, "utf8");

const primeraLinea = csv.split(/\r?\n/)[0];
const encabezadosOriginales = Papa.parse(primeraLinea, { header: false }).data[0] || [];
const duplicados = encabezadosOriginales.filter((h, i, arr) => h && arr.indexOf(h) !== i);
const resultado = Papa.parse(csv, { header: true, skipEmptyLines: true });

console.log("\n======================================");
console.log("PRUEBA CERO IA — CSV WIX");
console.log("======================================\n");
console.log("Archivo:", ruta);
console.log("Encabezados originales:");
console.log(encabezadosOriginales);
console.log("\nDuplicados originales:");
console.log([...new Set(duplicados)]);
console.log("\nCampos que PapaParse expone:");
console.log(resultado.meta.fields);
console.log("\nPrimera fila:");
console.log(resultado.data[0]);
console.log("\nIA llamada: NO");
console.log("Costo IA de esta prueba: $0.00");
console.log("======================================\n");
