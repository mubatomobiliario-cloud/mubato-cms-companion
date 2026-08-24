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

function snapshotProtegido(matriz, filaReferencia) {
    const encabezados = matriz[0];
    const idx = indice(encabezados);
    const fila = buscarFila(matriz, filaReferencia);
    if (!fila) throw new Error("No se pudo localizar la fila de referencia para el snapshot.");

    const protegidos = ["ID", "Cliente", "Ciudad", "Estado", "Categoría", "Galería General", "Espacios"];
    return Object.fromEntries(protegidos.map(campo => [
        campo,
        (idx[campo] || []).map(posicion => fila[posicion] || "")
    ]));
}

function encontrarFilaReferencia(matriz) {
    const encabezados = matriz[0];
    const idx = indice(encabezados);
    const filas = matriz.slice(1);
    const posicion = idx.Proyecto?.[0];
    if (posicion === undefined) throw new Error("El CSV no contiene la cabecera Proyecto.");

    const fila = filas.find(f => String(f[posicion] || "").trim() === "Hogar Araque");
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

    if (!duplicados.length) {
        console.log("✓ No existen cabeceras duplicadas.");
        return;
    }

    duplicados.forEach(([campo, posiciones]) => {
        console.log(`• ${campo}: ${posiciones.length} apariciones`);
        posiciones.forEach(posicion => {
            console.log(`  - posición ${posicion + 1}: ${JSON.stringify(filaCompleta?.[posicion] ?? "")}`);
        });
    });

    console.log("\n✓ Diagnóstico completado: no se ha elegido automáticamente ninguna columna duplicada.");
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
    const protegidosAntes = snapshotProtegido(antes, referencia);
    const duplicadosAntes = contarCabecerasDuplicadas(encabezadosAntes);

    assert(encabezadosAntes.length === 25, `CSV de entrada conserva ${encabezadosAntes.length} cabeceras`);
    assert(Object.values(duplicadosAntes).some(n => n > 1), "CSV de entrada contiene cabeceras duplicadas");

    mostrarDuplicados(antes);

    const editorial = {
        codigo: "MUB-TEST-001",
        heroTexto: "Hero de prueba editorial MUBATO.",
        historia: "Historia maestra de prueba del contrato editorial.",
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
    const duplicadosDespues = contarCabecerasDuplicadas(encabezadosDespues);

    assert(JSON.stringify(encabezadosDespues) === JSON.stringify(encabezadosAntes), "Las 25 cabeceras permanecen idénticas y en el mismo orden");
    assert(JSON.stringify(duplicadosDespues) === JSON.stringify(duplicadosAntes), "Las cabeceras duplicadas permanecen intactas");
    assert(despues.length === antes.length, "La cantidad de filas permanece idéntica");
    assert(despues.every(fila => fila.length === encabezadosDespues.length), "Todas las filas conservan exactamente el número de columnas");

    const protegidosDespues = snapshotProtegido(despues, referencia);
    assert(JSON.stringify(protegidosDespues) === JSON.stringify(protegidosAntes), "Los campos protegidos permanecen idénticos");

    const idx = indice(encabezadosDespues);
    const filaDespues = buscarFila(despues, referencia);
    assert(filaDespues, "La fila de Hogar Araque sigue localizable");

    const esperados = {
        "Código MUBATO": editorial.codigo,
        "Hero": editorial.heroTexto,
        "Historia": editorial.historia,
        "Descripción": editorial.descripcion,
        "Servicios": JSON.stringify(editorial.servicios),
        "Slug": editorial.slug,
        "SEO Title": editorial.seoTitle,
        "Meta Description": editorial.metaDescription
    };

    for (const [campo, esperado] of Object.entries(esperados)) {
        assert(idx[campo]?.length === 1, `El campo editorial ${campo} existe una sola vez`);
        assert(String(filaDespues[idx[campo][0]] || "") === String(esperado), `${campo} contiene exactamente el valor editorial esperado`);
    }

    console.log("\n--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log(`✓ CSV generado: ${rutaSalida}`);
    console.log("✓ Contrato de salida verificado.");
    console.log("✓ Integridad estructural verificada.");
    console.log("✓ Campos protegidos verificados.");
    console.log("✓ Campos editoriales autorizados verificados.");
    console.log("");
}

try {
    main();
} catch (error) {
    console.error("\n✗ PRUEBA FALLIDA");
    console.error(error.message);
    process.exitCode = 1;
}
