console.log("prueba-salida-editorial-csv-v2.js cargado");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const SalidaEditorialCSV = require("../src/Exportadores/salidaEditorialCSV");

const rutaEntrada = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).prueba-editorial-v2.csv");
const rutaSalida = path.resolve("Proyectos/Araque/Historias+de+Transformación (10).prueba-salida-editorial-csv-v2.csv");

function leerMatriz(ruta) {
    return Papa.parse(fs.readFileSync(ruta, "utf8"), {
        header: false,
        skipEmptyLines: true
    }).data;
}

function indice(encabezados) {
    const resultado = {};
    encabezados.forEach((campo, i) => {
        if (resultado[campo] === undefined) resultado[campo] = [];
        resultado[campo].push(i);
    });
    return resultado;
}

function assert(condicion, mensaje) {
    if (!condicion) throw new Error(`FALLO: ${mensaje}`);
    console.log(`✓ ${mensaje}`);
}

function buscarFila(matriz, filaReferencia) {
    const encabezados = matriz[0];
    const idx = indice(encabezados);
    return matriz.slice(1).find(fila => {
        const porId = idx.ID?.length === 1 && String(fila[idx.ID[0]] || "") === String(filaReferencia.ID || "");
        const porProyecto = idx.Proyecto?.length === 1 && String(fila[idx.Proyecto[0]] || "") === String(filaReferencia.Proyecto || "");
        return porId || porProyecto;
    });
}

function snapshotPorPosicion(matriz, posiciones) {
    const fila = buscarFila(matriz, encontrarFilaReferencia(matriz));
    if (!fila) throw new Error("No se pudo localizar la fila para snapshot.");
    return posiciones.map(posicion => ({ posicion, valor: fila[posicion] || "" }));
}

function encontrarFilaReferencia(matriz) {
    const encabezados = matriz[0];
    const idx = indice(encabezados);
    const posicion = idx.Proyecto?.[0];
    if (posicion === undefined) throw new Error("El CSV no contiene la cabecera Proyecto.");

    const fila = matriz.slice(1).find(f => String(f[posicion] || "").trim() === "Hogar Araque");
    if (!fila) throw new Error("No se encontró Hogar Araque en el CSV de prueba.");

    const referencia = {};
    ["ID", "Proyecto", "Slug"].forEach(campo => {
        if (idx[campo]?.length === 1) referencia[campo] = fila[idx[campo][0]] || "";
    });
    return referencia;
}

function contarCabecerasDuplicadas(encabezados) {
    const conteo = {};
    encabezados.forEach(campo => conteo[campo] = (conteo[campo] || 0) + 1);
    return conteo;
}

function mostrarDuplicados(matriz) {
    const encabezados = matriz[0];
    const idx = indice(encabezados);
    const fila = encontrarFilaReferencia(matriz);
    const filaCompleta = buscarFila(matriz, fila);
    const duplicados = Object.entries(idx).filter(([, posiciones]) => posiciones.length > 1);

    console.log("\n--------------------------------------");
    console.log("DIAGNÓSTICO — CABECERAS DUPLICADAS");
    console.log("--------------------------------------");

    duplicados.forEach(([campo, posiciones]) => {
        console.log(`• ${campo}: ${posiciones.length} apariciones`);
        posiciones.forEach(posicion => {
            console.log(`  - posición ${posicion + 1}: ${JSON.stringify(filaCompleta?.[posicion] ?? "")}`);
        });
    });

    console.log("\n✓ Diagnóstico completado: ninguna columna duplicada será utilizada por el contrato editorial.");
}

function main() {
    console.log("\n======================================");
    console.log("PRUEBA BLINDADA — SALIDA EDITORIAL CSV V2.2");
    console.log("======================================\n");

    if (!fs.existsSync(rutaEntrada)) throw new Error(`No existe CSV de entrada: ${rutaEntrada}`);
    if (fs.existsSync(rutaSalida)) fs.unlinkSync(rutaSalida);

    const antes = leerMatriz(rutaEntrada);
    const encabezadosAntes = antes[0];
    const referencia = encontrarFilaReferencia(antes);
    const duplicadosAntes = contarCabecerasDuplicadas(encabezadosAntes);
    const historiasWix = indice(encabezadosAntes)["Historias de Transformación"] || [];
    const snapshotHistorias = snapshotPorPosicion(antes, historiasWix);

    assert(encabezadosAntes.length === 25, `CSV de entrada conserva ${encabezadosAntes.length} cabeceras`);
    assert(historiasWix.length === 2, "Las dos columnas originales Historias de Transformación existen");
    assert(Object.values(duplicadosAntes).some(n => n > 1), "CSV de entrada contiene cabeceras duplicadas");

    mostrarDuplicados(antes);

    const editorial = {
        codigo: "MUB-TEST-001",
        heroTexto: "Hero de prueba editorial MUBATO.",
        historia: "Historia editorial nueva de prueba del Companion, independiente de las dos columnas originales de Wix.",
        descripcion: "Descripción editorial de prueba.",
        servicios: ["Diseño interior", "Mobiliario a medida"],
        slug: "hogar-araque",
        seoTitle: "Hogar Araque | MUBATO",
        metaDescription: "Historia de transformación del Hogar Araque diseñada por MUBATO."
    };

    const salida = new SalidaEditorialCSV().exportar({
        rutaEntrada,
        rutaSalida,
        filaProyecto: referencia,
        editorial
    });

    assert(fs.existsSync(rutaSalida), "Se generó el CSV de salida");
    assert(salida.camposActualizados.length === 8, "Se aplicaron exactamente 8 campos editoriales autorizados");

    const despues = leerMatriz(rutaSalida);
    const encabezadosDespues = despues[0];
    const idxDespues = indice(encabezadosDespues);
    const duplicadosDespues = contarCabecerasDuplicadas(encabezadosDespues);

    assert(encabezadosDespues.length === 26, "Se conserva el CSV original y se agrega exactamente una columna Companion");
    assert(JSON.stringify(encabezadosDespues.slice(0, 25)) === JSON.stringify(encabezadosAntes), "Las 25 cabeceras originales permanecen idénticas y en el mismo orden");
    assert(idxDespues["Historias de Transformación"]?.length === 2, "Las dos cabeceras originales Historias de Transformación permanecen intactas");
    assert(JSON.stringify(duplicadosDespues["Historias de Transformación"]) === JSON.stringify(duplicadosAntes["Historias de Transformación"]), "La duplicidad de Historias de Transformación permanece intacta");
    assert(despues.length === antes.length, "La cantidad de filas permanece idéntica");
    assert(despues.every(fila => fila.length === encabezadosDespues.length), "Todas las filas conservan exactamente el número de columnas de la salida");

    const filaDespues = buscarFila(despues, referencia);
    assert(filaDespues, "La fila de Hogar Araque sigue localizable");

    const historiasDespues = snapshotPorPosicion(despues, historiasWix);
    assert(JSON.stringify(historiasDespues) === JSON.stringify(snapshotHistorias), "Las dos columnas originales Historias de Transformación permanecen exactamente iguales");

    const esperados = {
        "Código MUBATO": editorial.codigo,
        "Hero Texto": editorial.heroTexto,
        "Descripción": editorial.descripcion,
        "Servicios": JSON.stringify(editorial.servicios),
        "Slug": editorial.slug,
        "SEO Title": editorial.seoTitle,
        "Meta Description": editorial.metaDescription
    };

    for (const [campo, esperado] of Object.entries(esperados)) {
        assert(idxDespues[campo]?.length === 1, `El campo editorial ${campo} existe una sola vez`);
        assert(String(filaDespues[idxDespues[campo][0]] || "") === String(esperado), `${campo} contiene exactamente el valor editorial esperado`);
    }

    assert(idxDespues.Historia?.length === 1, "La columna Companion Historia existe una sola vez");
    assert(String(filaDespues[idxDespues.Historia[0]] || "") === editorial.historia, "Historia contiene exactamente el valor editorial generado");
    assert(idxDespues["Hero Imágen"]?.length === 1, "Hero Imágen original permanece presente y separada de Hero Texto");

    console.log("\n--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log(`✓ CSV generado: ${rutaSalida}`);
    console.log("✓ Contrato de salida verificado.");
    console.log("✓ Integridad estructural verificada.");
    console.log("✓ Las dos columnas Historias de Transformación fueron protegidas.");
    console.log("✓ Historia Companion creada como columna independiente.");
    console.log("✓ Hero Texto mapeado al campo Wix correcto.");
    console.log("");
}

try {
    main();
} catch (error) {
    console.error("\n✗ PRUEBA FALLIDA");
    console.error(error.message);
    process.exitCode = 1;
}
