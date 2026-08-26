console.log("testIntegridadSalidaWix3C5.js cargado");

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const Papa = require("papaparse");

const SalidaEditorialCSV = require("../src/Exportadores/salidaEditorialCSV");

const PROYECTOS = ["Hogar Tijo", "Hogar Rolón", "Hogar Quesada", "Hogar Araque"];
const OBJETIVO = "Hogar Araque";
const EDITABLES = [
    "Código MUBATO", "Hero Texto", "Descripción", "Servicios",
    "Slug", "SEO Title", "Meta Description", "Galería General"
];
const HISTORIA = "Historia";
const HISTORIAS_WIX = "Historias de Transformación";
const HERO_IMAGEN = "Hero Imágen";

function exigir(condicion, mensaje) {
    if (!condicion) throw new Error(mensaje);
}

function hash(ruta) {
    return crypto.createHash("sha256").update(fs.readFileSync(ruta)).digest("hex");
}

function leer(ruta) {
    const resultado = Papa.parse(fs.readFileSync(ruta, "utf8"), {
        header: false,
        skipEmptyLines: true
    });
    exigir(resultado.errors.length === 0, `Error leyendo CSV: ${JSON.stringify(resultado.errors)}`);
    exigir(resultado.data.length >= 2, "El CSV no contiene filas de datos.");
    return { encabezados: resultado.data[0], filas: resultado.data.slice(1) };
}

function indice(encabezados) {
    const mapa = {};
    encabezados.forEach((nombre, posicion) => {
        if (!mapa[nombre]) mapa[nombre] = [];
        mapa[nombre].push(posicion);
    });
    return mapa;
}

function unica(mapa, campo) {
    const posiciones = mapa[campo] || [];
    exigir(posiciones.length === 1, `El campo "${campo}" debe ser único; se encontraron ${posiciones.length}.`);
    return posiciones[0];
}

function proyectos(matriz) {
    const mapa = indice(matriz.encabezados);
    const p = unica(mapa, "Proyecto");
    const resultado = new Map();
    matriz.filas.forEach(fila => {
        const nombre = String(fila[p] || "").trim();
        if (PROYECTOS.includes(nombre)) resultado.set(nombre, fila);
    });
    return resultado;
}

function objetoFila(matriz, nombre) {
    const mapa = indice(matriz.encabezados);
    const p = unica(mapa, "Proyecto");
    const fila = matriz.filas.find(f => String(f[p] || "").trim() === nombre);
    exigir(fila, `No se encontró "${nombre}".`);
    const objeto = {};
    matriz.encabezados.forEach((campo, posicion) => {
        // Wix tiene dos cabeceras duplicadas de Historias de Transformación.
        // No las enviamos al objeto para evitar colisión; permanecen en el CSV.
        if ((mapa[campo] || []).length === 1) objeto[campo] = fila[posicion] ?? "";
    });
    return objeto;
}

function compararProyecto(matrizBase, matrizSalida, proyecto, editables) {
    const baseIndice = indice(matrizBase.encabezados);
    const salidaIndice = indice(matrizSalida.encabezados);
    const baseFila = proyectos(matrizBase).get(proyecto);
    const salidaFila = proyectos(matrizSalida).get(proyecto);
    exigir(baseFila && salidaFila, `El proyecto "${proyecto}" no existe en ambas matrices.`);

    const diferencias = [];
    Object.entries(baseIndice).forEach(([campo, posiciones]) => {
        exigir(posiciones.length >= 1, `Cabecera sin posición: ${campo}`);
        const posicionesSalida = salidaIndice[campo];
        exigir(posicionesSalida && posicionesSalida.length === posiciones.length,
            `La cabecera "${campo}" cambió su multiplicidad: entrada ${posiciones.length}, salida ${posicionesSalida ? posicionesSalida.length : 0}.`);

        posiciones.forEach((posicionBase, indiceDuplicado) => {
            const posicionSalida = posicionesSalida[indiceDuplicado];
            const antes = String(baseFila[posicionBase] ?? "");
            const despues = String(salidaFila[posicionSalida] ?? "");

            if (proyecto === OBJETIVO && editables.includes(campo)) return;
            if (antes !== despues) {
                diferencias.push({ proyecto, campo, posicion: posicionBase + 1, antes, despues });
            }
        });
    });
    return diferencias;
}

async function main() {
    console.log("======================================");
    console.log("PRUEBA — INTEGRIDAD SALIDA WIX 3C.5");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: verificar que el CSV de salida sea seguro para el cargue Wix.");
    console.log("La prueba trabaja con el CSV maestro real y no realiza llamadas a OpenAI.");
    console.log("");

    const rutaCSV = path.join(process.cwd(), "Proyectos", "Historias_WIX_ORIGINAL.csv");
    exigir(fs.existsSync(rutaCSV), `No se encontró el CSV maestro real: ${rutaCSV}`);

    const hashAntes = hash(rutaCSV);
    const entrada = leer(rutaCSV);
    const entradaIndice = indice(entrada.encabezados);
    const entradaProyectos = proyectos(entrada);

    console.log(`✓ CSV maestro: ${rutaCSV}`);
    console.log(`✓ Filas de proyectos capturadas: ${entradaProyectos.size}`);
    PROYECTOS.forEach(p => console.log(`  • ${p}`));
    exigir(entradaProyectos.size === PROYECTOS.length,
        "El CSV maestro no contiene exactamente los cuatro proyectos esperados.");
    console.log("");

    console.log("1. Verificando contrato físico Wix antes de exportar...");
    exigir((entradaIndice[HISTORIAS_WIX] || []).length === 2,
        `Se esperaban exactamente 2 columnas "${HISTORIAS_WIX}".`);
    exigir((entradaIndice[HERO_IMAGEN] || []).length === 1,
        `Se esperaba exactamente 1 columna "${HERO_IMAGEN}".`);
    exigir(!entradaIndice[HISTORIA], `El campo Companion "${HISTORIA}" ya existe en el CSV maestro.`);
    EDITABLES.forEach(campo => exigir((entradaIndice[campo] || []).length === 1,
        `El campo editable "${campo}" no es único.`));
    console.log("✓ Las 2 columnas Historias de Transformación están presentes y protegidas.");
    console.log(`✓ ${HERO_IMAGEN} está presente y protegido.`);
    console.log(`✓ Los 8 campos Wix editables son únicos.`);
    console.log("");

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-integridad-wix-3c5-"));
    const copiaEntrada = path.join(tmp, "entrada.csv");
    const salidaCSV = path.join(tmp, "salida-editorial.csv");
    fs.copyFileSync(rutaCSV, copiaEntrada);

    console.log("2. Ejecutando exportación controlada exclusivamente para Araque...");
    const salida = new SalidaEditorialCSV();
    const resultado = salida.exportar({
        rutaEntrada: copiaEntrada,
        rutaSalida: salidaCSV,
        filaProyecto: objetoFila(entrada, OBJETIVO),
        editorial: {
            codigo: "MUB-ARAQUE-3C5",
            heroTexto: "Hero control 3C.5",
            descripcion: "Descripción control 3C.5",
            servicios: "Diseño interior, mobiliario a medida",
            slug: "hogar-araque-3c5",
            seoTitle: "Hogar Araque | MUBATO — 3C.5",
            metaDescription: "Historia de transformación de Hogar Araque — control 3C.5.",
            historia: "Historia editorial control 3C.5 de Araque",
            galeriaEditorial: []
        }
    });

    exigir(resultado && resultado.rutaSalida && fs.existsSync(resultado.rutaSalida),
        "La salida editorial no fue creada.");
    console.log("✓ Salida editorial generada.");
    console.log(`✓ Archivo: ${resultado.rutaSalida}`);
    console.log("");

    console.log("3. Verificando que las entradas permanezcan intactas...");
    exigir(hash(rutaCSV) === hashAntes, "VIOLACIÓN: el CSV maestro original fue modificado.");
    exigir(hash(copiaEntrada) === hashAntes, "VIOLACIÓN: la copia de entrada fue modificada.");
    console.log("✓ CSV maestro intacto.");
    console.log("✓ Copia de entrada intacta.");
    console.log("");

    console.log("4. Verificando estructura física de la salida...");
    const salidaMatriz = leer(resultado.rutaSalida);
    const salidaIndice = indice(salidaMatriz.encabezados);

    exigir(salidaMatriz.filas.length === entrada.filas.length,
        `Cambió la cantidad de filas: entrada ${entrada.filas.length}, salida ${salidaMatriz.filas.length}.`);
    exigir(salidaMatriz.encabezados.length === entrada.encabezados.length + 1,
        `La salida debe tener exactamente una columna adicional: entrada ${entrada.encabezados.length}, salida ${salidaMatriz.encabezados.length}.`);

    entrada.encabezados.forEach((campo, posicion) => {
        exigir(salidaMatriz.encabezados[posicion] === campo,
            `La cabecera en posición ${posicion + 1} cambió: "${campo}" → "${salidaMatriz.encabezados[posicion]}".`);
    });
    exigir(salidaMatriz.encabezados[salidaMatriz.encabezados.length - 1] === HISTORIA,
        `La única cabecera nueva debe ser "${HISTORIA}" al final.`);
    exigir((salidaIndice[HISTORIAS_WIX] || []).length === 2,
        `La salida no conserva exactamente 2 columnas "${HISTORIAS_WIX}".`);
    exigir((salidaIndice[HERO_IMAGEN] || []).length === 1,
        `La salida no conserva exactamente 1 columna "${HERO_IMAGEN}".`);
    exigir((salidaIndice[HISTORIA] || []).length === 1,
        `La salida no contiene exactamente 1 columna "${HISTORIA}".`
    );

    console.log(`✓ Las ${entrada.encabezados.length} cabeceras Wix originales conservan posición y nombre.`);
    console.log(`✓ La única cabecera nueva es "${HISTORIA}".`);
    console.log("✓ Las dos columnas Historias de Transformación siguen duplicadas y separadas.");
    console.log(`✓ ${HERO_IMAGEN} sigue presente como campo independiente.`);
    console.log("");

    console.log("5. Comparando todas las celdas del CSV, campo por campo...");
    const diferencias = [];
    PROYECTOS.forEach(proyecto => {
        diferencias.push(...compararProyecto(entrada, salidaMatriz, proyecto, EDITABLES));
    });

    if (diferencias.length) {
        console.log("✗ DIFERENCIAS NO AUTORIZADAS:");
        diferencias.forEach(d => {
            console.log(`  ✗ ${d.proyecto} → ${d.campo} (columna ${d.posicion})`);
            console.log(`      ANTES:   ${JSON.stringify(d.antes)}`);
            console.log(`      DESPUÉS: ${JSON.stringify(d.despues)}`);
        });
        throw new Error(`La salida contiene ${diferencias.length} diferencias no autorizadas.`);
    }

    console.log("✓ Tijo: todas las celdas protegidas intactas.");
    console.log("✓ Rolón: todas las celdas protegidas intactas.");
    console.log("✓ Quesada: todas las celdas protegidas intactas.");
    console.log("✓ Araque: solo los 8 campos Wix autorizados pueden diferir.");
    console.log("");

    console.log("6. Verificando específicamente los campos críticos...");
    const baseAraque = entradaProyectos.get(OBJETIVO);
    const salidaAraque = proyectos(salidaMatriz).get(OBJETIVO);
    const historiaPosicion = unica(salidaIndice, HISTORIA);
    const proyectoPosicion = unica(salidaIndice, "Proyecto");

    (entradaIndice[HISTORIAS_WIX] || []).forEach((posicion, duplicado) => {
        const salidaPosicion = (salidaIndice[HISTORIAS_WIX] || [])[duplicado];
        exigir(String(baseAraque[posicion] ?? "") === String(salidaAraque[salidaPosicion] ?? ""),
            `La columna ${HISTORIAS_WIX} duplicada #${duplicado + 1} fue modificada.`);
    });

    const heroPosicion = unica(entradaIndice, HERO_IMAGEN);
    exigir(String(baseAraque[heroPosicion] ?? "") === String(salidaAraque[unica(salidaIndice, HERO_IMAGEN)] ?? ""),
        `El campo ${HERO_IMAGEN} fue modificado.`);

    exigir(String(salidaAraque[historiaPosicion] ?? "") === "Historia editorial control 3C.5 de Araque",
        "La Historia Companion no contiene el valor editorial esperado en Araque.");

    salidaMatriz.filas.forEach(fila => {
        const proyecto = String(fila[proyectoPosicion] || "").trim();
        if (proyecto !== OBJETIVO) {
            exigir(String(fila[historiaPosicion] ?? "") === "",
                `La columna Historia Companion no está vacía en ${proyecto}.`);
        }
    });

    console.log(`✓ Las 2 columnas ${HISTORIAS_WIX} permanecen intactas.`);
    console.log(`✓ ${HERO_IMAGEN} permanece intacto.`);
    console.log(`✓ ${HISTORIA} solo contiene contenido en Araque.`);
    console.log("✓ Galería General queda autorizada como frontera editorial de exportación.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.5");
    console.log("--------------------------------------");
    console.log("✓ Estructura Wix preservada.");
    console.log("✓ Historias de Transformación no fueron tocadas.");
    console.log("✓ Hero Imágen no fue tocado.");
    console.log("✓ Tijo, Rolón y Quesada permanecen intactos.");
    console.log("✓ Araque solo modifica campos editoriales Wix autorizados.");
    console.log("✓ Historia Companion aislada en Araque.");
    console.log("✓ Galería General es el único campo Wix existente que puede recibir la selección editorial.");
    console.log("✓ CSV maestro protegido.");
    console.log("✓ No se realizaron llamadas a OpenAI.");
}

main().catch(error => {
    console.log("");
    console.log("--------------------------------------");
    console.log("PRUEBA FALLIDA — 3C.5");
    console.log("--------------------------------------");
    console.log(error.message);
    process.exitCode = 1;
});
