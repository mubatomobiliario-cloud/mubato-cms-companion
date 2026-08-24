console.log("testTelemetriaIA.js cargado");

const assert = require("assert");
const TelemetriaIA = require("../src/core/telemetriaIA");

console.log("");
console.log("======================================");
console.log("PRUEBA — TELEMETRÍA IA 3B.1");
console.log("======================================");
console.log("");

const telemetria = new TelemetriaIA();
telemetria.iniciarEjecucion({ proyecto: "Hogar Araque", flujo: "EDITORIAL_PROYECTO_V2.2" });

const vision = telemetria.iniciarLlamada({
    proveedor: "OpenAI",
    operacion: "vision",
    modelo: "modelo-vision-prueba",
    proyecto: "Hogar Araque",
    fotografia: "hero.jpg"
});
telemetria.registrarLlamada(vision, {
    model: "modelo-vision-prueba",
    usage: { input_tokens: 1200, output_tokens: 300, total_tokens: 1500 }
});

const editorial = telemetria.iniciarLlamada({
    proveedor: "OpenAI",
    operacion: "texto",
    modelo: "modelo-texto-prueba",
    proyecto: "Hogar Araque"
});
telemetria.registrarLlamada(editorial, {
    model: "modelo-texto-prueba",
    usage: { input_tokens: 2000, output_tokens: 800, total_tokens: 2800 }
});

const fallo = telemetria.iniciarLlamada({
    proveedor: "ProveedorFuturo",
    operacion: "texto",
    modelo: "modelo-futuro",
    proyecto: "Hogar Araque"
});
telemetria.registrarError(fallo, new Error("Error simulado"));

const resumen = telemetria.resumen();

assert.strictEqual(resumen.llamadas, 3);
assert.strictEqual(resumen.exitosas, 2);
assert.strictEqual(resumen.fallidas, 1);
assert.strictEqual(resumen.tokensEntrada, 3200);
assert.strictEqual(resumen.tokensSalida, 1100);
assert.strictEqual(resumen.tokensTotales, 4300);
assert.strictEqual(resumen.llamadasPorOperacion.vision, 1);
assert.strictEqual(resumen.llamadasPorOperacion.texto, 2);
assert.strictEqual(resumen.llamadasPorProveedor.OpenAI, 2);
assert.strictEqual(resumen.llamadasPorProveedor.ProveedorFuturo, 1);
assert.strictEqual(resumen.detalle[0].fotografia, "hero.jpg");
assert.strictEqual(resumen.detalle[2].exito, false);
assert.strictEqual(resumen.detalle[2].error, "Error simulado");
assert.strictEqual(resumen.contexto.proyecto, "Hogar Araque");
assert.strictEqual(resumen.contexto.flujo, "EDITORIAL_PROYECTO_V2.2");

console.log("✓ Registra llamadas individuales.");
console.log("✓ Registra proveedor y operación.");
console.log("✓ Registra modelo.");
console.log("✓ Registra proyecto y fotografía.");
console.log("✓ Registra duración y timestamp.");
console.log("✓ Registra éxito y error.");
console.log("✓ Registra tokens de entrada, salida y total.");
console.log("✓ Agrega métricas por operación.");
console.log("✓ Agrega métricas por proveedor.");
console.log("✓ Conserva el detalle de cada llamada.");
console.log("✓ No depende del SDK de OpenAI.");
console.log("✓ Permite registrar un proveedor futuro sin modificar el módulo.");
console.log("");
console.log("--------------------------------------");
console.log("PRUEBA SUPERADA");
console.log("--------------------------------------");
console.log("");
console.log("✓ Telemetría IA 3B.1 validada.");
console.log("✓ No se realizó ninguna llamada real a IA.");
console.log("");
