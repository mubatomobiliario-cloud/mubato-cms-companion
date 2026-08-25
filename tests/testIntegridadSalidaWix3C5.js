console.log("testIntegridadSalidaWix3C5.js cargado");

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const Papa = require("papaparse");

const SalidaEditorialCSV = require("../src/Exportadores/salidaEditorialCSV");

const PROYECTOS = ["Hogar Tijo", "Hogar Rolón", "Hogar Quesada", "Hogar Araque"];
const PROYECTO_OBJETIVO = "Hogar Araque";

const CAMPOS_EDITABLES_WIX = [
    "Código MUBATO",
    "Hero Texto",
    "Descripción",
    "Servicios",
    "Slug",
    "SEO Title",
    "Meta Description"
];

const CAMPO_HISTORIA = "Historia";
const CAMPOS_HISTORIAS_WIX = "Historias de Transformación";
const CAMPO_HERO_IMAGEN = "Hero Imágen";

function hashArchivo(ruta) {
    return crypto.createHash("sha256").update(fs.readFileSync(ruta)).digest("hex");
}

function localizarCSV() {
    const ruta = path.join(process.cwd(), "Proyectos", "Historias_WIX_ORIGINAL.csv");
    if (!fs.existsSync(ruta)) {
        throw new Error(`No se encontró el CSV maestro real: ${ruta}`);
    }
    return ruta;
}

function leerMatriz(rutaCSV) {
    const resultado = Papa.parse(fs.readFileSync(rutaCSV, "utf8"), {
        header: false,
        skipEmptyLines: true
    });
    if (resultado.errors.length > 0) {
        throw new Error(`Error leyendo CSV: ${JSON.stringify(resultado.errors)}`);
    }
    if (resultado.data.length < 2) {
        throw new Error("El CSV no contiene filas de datos.");
    }
    return {
        encabezados: resultado.data[0],
        filas: resultado.data.slice(1)
    };
}

function crearIndice(encabezados) {
    const todas = {};
    encabezados.forEach((encabezado, posicion) => {
        if (!todas[encabezado]) todas[encabezado] = [];
        todas[encabezado].push(posicion);
    });
    return todas;
}

function exigir(condicion, mensaje) {
    if (!condicion) throw new Error(mensaje);
}

function obtenerPosicionUnica(indice, campo) {
    const posiciones = indice[campo] || [];
    exigir(posiciones.length === 1, `El campo "${campo}" debe ser único; se encontraron ${posiciones.length}.`);
    return posiciones[0];
}

function obtenerFilaPorProyecto(matriz, proyecto) {
    const indice = crearIndice(matriz.encabezados);
    const posicionProyecto = obtenerPosicionUnica(indice, "Proyecto");
    const fila = matriz.filas.find(f => String(f[posicionProyecto] || "").trim() === proyecto);
    exigir(fila, `No se encontró el proyecto "${proyecto}".`);
    return fila;
}

function mapaProyectos(matriz) {
    const indice = crearIndice(matriz.encabezados);
    const posicionProyecto = obtenerPosicionUnica(indice, "Proyecto");
    const mapa = new Map();
    matriz.filas.forEach(fila => {
        const proyecto = String(fila[posicionProyecto] || "").trim();
        if (PROYECTOS.includes(proyecto)) mapa.set(proyecto, fila);
    });
    return { indice, mapa };
}

function compararCeldas(base, salida, indiceBase, indiceSalida, proyecto, filaBase, filaSalida) {
    const diferencias = [];
    const esObjetivo = proyecto === PROYECTO_OBJETIVO;

    indiceBase.forEach((posiciones, encabezado) => {
        exigir(posiciones.length > 0, `Cabecera sin posición: ${encabezado}`);
        const posicionSalida = indiceSalida[encabezado];
        exigir(posicionSalida && posicionSalida.length === 1, `La cabecera original "${encabezado}" no se preservó exactamente una vez en la salida.`);

        const posicionBase = posiciones[0];
        const valorBase = String(filaBase[posicionBase] ?? "");
        const valorSalida = String(filaSalida[posicionSalida[0]] ?? "");

        if (esObjetivo && CAMPOS_EDITABLES_WIX.includes(encabezado)) return;

        if (valorBase !== valorSalida) {
            diferencias.push({ proyecto, campo: encabezado, posicion: posicionBase + 1, antes: valorBase, despues: valorSalida });
        }
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

    const rutaCSV = localizarCSV();
    const hashAntes = hashArchivo(rutaCSV);
    const entrada = leerMatriz(rutaCSV);
    const entradaIndice = crearIndice(entrada.encabezados);
    const entradaProyectos = mapaProyectos(entrada);

    console.log(`✓ CSV maestro: ${rutaCSV}`);
    console.log(`✓ Filas de proyectos capturadas: ${entradaProyectos.mapa.size}`);
    PROYECTOS.forEach(proyecto => console.log(`  • ${proyecto}`));
    console.log("");

    exigir(entradaProyectos.mapa.size === PROYECTOS.length, "El CSV maestro no contiene exactamente los cuatro proyectos esperados.");

    console.log("1. Verificando contrato físico Wix antes de exportar...");
    exigir((entradaIndice[CAMPOS_HISTORIAS_WIX] || []).length === 2,
        `Se esperaban exactamente 2 columnas "${CAMPOS_HISTORIAS_WIX}".`);
    exigir((entradaIndice[CAMPO_HERO_IMAGEN] || []).length === 1,
        `Se esperaba exactamente 1 columna "${CAMPO_HERO_IMAGEN}".`);
    exigir(!entradaIndice[CAMPO_HISTORIA], `El campo Companion "${CAMPO_HISTORIA}" ya existe en el CSV maestro.`);
    CAMPOS_EDITABLES_WIX.forEach(campo => exigir((entradaIndice[campo] || []).length === 1,
        `El campo editable "${campo}" no es una cabecera única.`));
    console.log("✓ Las 2 columnas Historias de Transformación están presentes y protegidas.");
    console.log(`✓ ${CAMPO_HERO_IMAGEN} está presente y protegido.`);
    console.log(`✓ Los ${CAMPOS_EDITABLES_WIX.length} campos Wix editables son únicos.`);
    console.log("");

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-integridad-wix-3c5-"));
    const copiaEntrada = path.join(tmp, "entrada.csv");
    const salidaCSV = path.join(tmp, "salida-editorial.csv");
    fs.copyFileSync(rutaCSV, copiaEntrada);

    console.log("2. Ejecutando exportación controlada exclusivamente para Araque...");
    const salida = new SalidaEditorialCSV();
    const filaAraque = (() => {
        const matriz = leerMatriz(copiaEntrada);
        const indice = crearIndice(matriz.encabezados);
        const posicionProyecto = obtenerPosicionUnica(indice, "Proyecto");
        const fila = matriz.filas.find(f => String(f[posicionProyecto] || "").trim() === PROYECTO_OBJETIVO);
        exigir(fila, `No se encontró "${PROYECTO_OBJETIVO}" en la copia de trabajo.`);
        const objeto = {};
        matriz.encabezados.forEach((encabezado, posicion) => {
            if ((indice[encabezado] || []).length === 1) objeto[encabezado] = fila[posicion] ?? "";
        });
        return objeto;
    })();

    const resultado = salida.exportar({
        rutaEntrada: copiaEntrada,
        rutaSalida: salidaCSV,
        filaProyecto: filaAraque,
        editorial: {
            codigo: "MUB-ARAQUE-3C5",
            heroTexto: "Hero control 3C.5",
            descripcion: "Descripción control 3C.5",
            servicios: "Diseño interior, mobiliario a medida",
            slug: "hogar-araque-3c5",
            seoTitle: "Hogar Araque | MUBATO — 3C.5",
            metaDescription: "Historia de transformación de Hogar Araque — control 3C.5.",
            historia: "Historia editorial control 3C.5 de Araque"
        }
    });

    exigir(fs.existsSync(resultado.rutaSalida), "La salida editorial no fue creada.");
    console.log("✓ Salida editorial generada.");
    console.log(`✓ Archivo: ${resultado.rutaSalida}`);
    console.log("");

    console.log("3. Verificando que la entrada original permanezca intacta...");
    exigir(hashArchivo(rutaCSV) === hashAntes, "VIOLACIÓN: el CSV maestro original fue modificado.");
    exigir(hashArchivo(copiaEntrada) === hashArchivo(rutaCSV), "VIOLACIÓN: la copia de entrada fue modificada durante la exportación.");
    console.log("✓ CSV maestro intacto.");
    console.log("✓ Copia de entrada intacta.");
    console.log("");

    console.log("4. Verificando estructura física de la salida...");
    const salidaMatriz = leerMatriz(resultado.rutaSalida);
    const salidaIndice = crearIndice(salidaMatriz.encabezados);

    exigir(salidaMatriz.filas.length === entrada.filas.length,
        `La cantidad de filas cambió: entrada ${entrada.filas.length}, salida ${salidaMatriz.filas.length}.`);
    exigir(salidaMatriz.encabezados.length === entrada.encabezados.length + 1,
        `La salida debe contener exactamente una columna Companion adicional: entrada ${entrada.encabezados.length}, salida ${salidaMatriz.encabezados.length}.`);

    entrada.encabezados.forEach((encabezado, posicion) => {
        exigir(salidaMatriz.encabezados[posicion] === encabezado,
            `La cabecera original en posición ${posicion + 1} cambió de "${encabezado}" a "${salidaMatriz.encabezados[posicion]}".`);
    });
    exigir(salidaMatriz.encabezados[salidaMatriz.encabezados.length - 1] === CAMPO_HISTORIA,
        `La única cabecera nueva debe ser "${CAMPO_HISTORIA}" y debe estar al final.`);

    exigir((salidaIndice[CAMPOS_HISTORIAS_WIX] || []).length === 2,
        `La salida no conserva exactamente las 2 columnas "${CAMPOS_HISTORIAS_WIX}".`);
    exigir((salidaIndice[CAMPO_HERO_IMAGEN] || []).length === 1,
        `La salida no conserva exactamente 1 columna "${CAMPO_HERO_IMAGEN}".`);
    exigir((salidaIndice[CAMPO_HISTORIA] || []).length === 1,
        `La salida no contiene exactamente 1 columna Companion "${CAMPO_HISTORIA}".`);
    console.log(`✓ Las ${entrada.encabezados.length} cabeceras Wix originales conservan posición y nombre.`);
    console.log(`✓ La única cabecera nueva es "${CAMPO_HISTORIA}".`);
    console.log("✓ Las dos columnas Historias de Transformación siguen duplicadas y separadas.");
    console.log("✓ Hero Imágen sigue presente como campo independiente.");
    console.log("");

    console.log("5. Comparando todas las celdas del CSV, campo por campo...");
    const salidaProyectos = mapaProyectos(salidaMatriz);
    const diferencias = [];

    for (const proyecto of PROYECTOS) {
        const filaBase = entradaProyectos.mapa.get(proyecto);
        const filaSalida = salidaProyectos.mapa.get(proyecto);
        exigir(filaSalida, `El proyecto "${proyecto}" desapareció de la salida.`);
        diferencias.push(...compararCeldas(entrada, salidaMatriz, entradaIndice, salidaIndice, proyecto, filaBase, filaSalida));
    }

    if (diferencias.length > 0) {
        console.log("✗ DIFERENCIAS NO AUTORIZADAS:");
        diferencias.forEach(d => {
            console.log(`  ✗ ${d.proyecto} → ${d.campo} (columna ${d.posicion})`);
            console.log(`      ANTES:   ${JSON.stringify(d.antes)}`);
            console.log(`      DESPUÉS: ${JSON.stringify(d.despues)}`);
        });
        throw new Error(`La salida contiene ${diferencias.length} diferencias no autorizadas.`);
    }
    console.log("✓ Tijo: todas las celdas originales intactas.");
    console.log("✓ Rolón: todas las celdas originales intactas.");
    console.log("✓ Quesada: todas las celdas originales intactas.");
    console.log("✓ Araque: solo los 7 campos Wix autorizados pueden diferir.");
    console.log("");

    console.log("6. Verificando específicamente los campos críticos protegidos...");
    const baseAraque = entradaProyectos.mapa.get(PROYECTO_OBJETIVO);
    const salidaAraque = salidaProyectos.mapa.get(PROYECTO_OBJETIVO);

    (entradaIndice[CAMPOS_HISTORIAS_WIX] || []).forEach(posicion => {
        exigir(String(baseAraque[posicion] ?? "") === String(salidaAraque[posicion] ?? ""),
            `La columna ${CAMPOS_HISTORIAS_WIX} en posición ${posicion + 1} fue modificada.`);
    });

    const posicionHeroImagen = obtenerPosicionUnica(entradaIndice, CAMPO_HERO_IMAGEN);
    exigir(String(baseAraque[posicionHeroImagen] ?? "") === String(salidaAraque[posicionHeroImagen] ?? ""),
        `El campo ${CAMPO_HERO_IMAGEN} fue modificado.`);

    const posicionHistoria = obtenerPosicionUnica(salidaIndice, CAMPO_HISTORIA);
    exigir(String(salidaAraque[posicionHistoria] ?? "") === "Historia editorial control 3C.5 de Araque",
        "La Historia Companion no contiene exactamente el valor editorial esperado.");

    salidaMatriz.filas.forEach((fila, indiceFila) => {
        const proyecto = String(fila[obtenerPosicionUnica(salidaIndice, "Proyecto")] || "").trim();
        if (proyecto !== PROYECTO_OBJETIVO) {
            exigir(String(fila[posicionHistoria] ?? "") === "",
                `La columna Historia Companion no está vacía en ${proyecto || `fila ${indiceFila + 2}`}.`);
        }
    });

    console.log(`✓ Las 2 columnas ${CAMPOS_HISTORIAS_WIX} permanecen byte-a-byte equivalentes por celda.`);
    console.log(`✓ ${CAMPO_HERO_IMAGEN} permanece intacto.`);
    console.log(`✓ ${CAMPO_HISTORIA} solo contiene contenido en Araque.`);
    console.log("");

    console.log("======================================");
    console.log("PRUEBA SUPERADA — 3C.5");
    console.log("======================================");
    console.log("");
    console.log("✓ Salida estructuralmente compatible con el CSV Wix de origen.");
    console.log("✓ Ningún proyecto ajeno fue modificado.");
    console.log("✓ Solo los 7 campos Wix autorizados pueden cambiar en Araque.");
    console.log("✓ Historia Companion se agrega como columna independiente.");
    console.log("✓ Historias de Transformación / Historias de Transformación1 permanecen intactas.");
    console.log("✓ Hero Imágen permanece intacta.");
    console.log("✓ CSV original protegido.");
    console.log("✓ No se realizaron llamadas a OpenAI.");
}

main().catch(error => {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA FALLIDA — 3C.5");
    console.log("======================================");
    console.error(error.message);
    process.exit(1);
});
