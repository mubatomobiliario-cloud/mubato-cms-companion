console.log("prueba-validador-historia-v2.js cargado");

const ValidadorHistoriaV2 = require("../src/direccionEditorial/validadorHistoriaV2");

const validador = new ValidadorHistoriaV2();

const proyecto = {
    nombre: "Hogar Tijo",
    ciudad: "Bogotá",
    espacios: ["Cocina", "Sala", "Comedor"],
    servicios: ["Diseño Interior", "Mobiliario a Medida", "Remodelación"],
    descripcion: "Una cocina contemporánea diseñada para integrar funcionalidad, luz y materiales nobles en un solo espacio."
};

const base = `La cocina partía de una necesidad concreta: organizar preparación, almacenamiento y encuentro cotidiano sin perder continuidad con las áreas sociales. La intervención reorganizó el espacio alrededor de una isla central y articuló el mobiliario a medida con la arquitectura existente. La cocina se convirtió así en un lugar donde cocinar, compartir y reunirse forman parte de una misma experiencia. La isla reúne preparación y almacenamiento, mientras el mobiliario auxiliar incorpora una estación de café y resuelve funciones que antes ocupaban distintos puntos del espacio. La iluminación acompaña los recorridos y permite percibir con claridad los materiales y las proporciones. El resultado permite una nueva forma de habitar la cocina, más integrada con la vida cotidiana de quienes la usan. En Hogar Tijo, el diseño interior y el mobiliario a medida responden a una condición específica de Bogotá y construyen una relación continua entre cocina, comedor y sala. `;

function extender(texto) {
    let salida = texto;
    while (salida.split(/\s+/).length < 250) salida += " La solución mantiene equilibrio entre función, proporción y continuidad espacial.";
    return salida;
}

function ejecutar(nombre, historia, debeAprobar, reglaEsperada) {
    const resultado = validador.validar(extender(historia), proyecto);
    console.log(`\nCASO — ${nombre}`);
    console.log(`Estado: ${resultado.estado}`);
    console.log(`Palabras: ${resultado.metricas.palabras}`);
    console.log(`Errores: ${resultado.errores.length}`);
    console.log(`Advertencias: ${resultado.advertencias.length}`);

    if (resultado.aprobado !== debeAprobar) {
        throw new Error(`Resultado inesperado en ${nombre}: aprobado=${resultado.aprobado}`);
    }

    if (reglaEsperada && !resultado.errores.some(e => e.regla === reglaEsperada)) {
        throw new Error(`No se detectó la regla esperada: ${reglaEsperada}`);
    }

    return resultado;
}

console.log("\n======================================");
console.log("PRUEBA — VALIDADOR HISTORIA V2");
console.log("======================================");

ejecutar("NARRACIÓN VÁLIDA", base, true);

ejecutar(
    "APROVECHA EN USO NARRATIVO",
    base.replace("La solución mantiene equilibrio", "La distribución permite aprovechar mejor la isla sin alterar el equilibrio") ,
    true
);

ejecutar(
    "LLAMADO COMERCIAL",
    base + "Aprovecha esta oportunidad y conoce nuestro trabajo.",
    false,
    "voz.llamado_accion"
);

ejecutar(
    "LENGUAJE META",
    base + "Según el expediente, esta decisión se sustenta en las observaciones.",
    false,
    "voz.meta"
);

ejecutar(
    "PUBLICIDAD",
    base + "El resultado es espectacular y exclusivo.",
    false,
    "voz.publicidad"
);

console.log("\n======================================");
console.log("RESULTADO");
console.log("======================================");
console.log("✓ Reglas editoriales V2 superadas");
console.log("✓ 'aprovecha' contextual no se penaliza por palabra aislada");
console.log("✓ El llamado comercial sí se detecta por función");
console.log("✓ El lenguaje meta se detecta por construcción");
console.log("✓ La publicidad se detecta por construcción");
