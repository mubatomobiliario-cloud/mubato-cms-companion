console.log("testExportacionGaleriaEditorialV2_2.js cargado");

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
        if ((mapa[campo] || []).length === 1) objeto[campo] = fila[posicion] ?? "";
    });
    return objeto;
}

function valorCelda(matriz, proyecto, campo) {
    const mapa = indice(matriz.encabezados);
    const posicionProyecto = unica(mapa, "Proyecto");
    const posicionesCampo = mapa[campo] || [];
    exigir(posicionesCampo.length === 1, `El campo "${campo}" debe ser único para esta aserción.`);
    const fila = matriz.filas.find(f => String(f[posicionProyecto] || "").trim() === proyecto);
    exigir(fila, `No se encontró "${proyecto}".`);
    return fila[posicionesCampo[0]] ?? "";
}

function objetoWixEsperado(foto) {
    return {
        description: foto.description || "",
        fileName: foto.fileName,
        slug: foto.slug,
        alt: foto.alt,
        src: foto.src,
        title: foto.title,
        type: foto.type,
        settings: foto.settings
    };
}

function compararNoEditables(matrizBase, matrizSalida, proyecto) {
    const baseIndice = indice(matrizBase.encabezados);
    const salidaIndice = indice(matrizSalida.encabezados);
    const baseFila = proyectos(matrizBase).get(proyecto);
    const salidaFila = proyectos(matrizSalida).get(proyecto);
    exigir(baseFila && salidaFila, `El proyecto "${proyecto}" no existe en ambas matrices.`);

    const diferencias = [];
    Object.entries(baseIndice).forEach(([campo, posiciones]) => {
        const posicionesSalida = salidaIndice[campo];
        exigir(posicionesSalida && posicionesSalida.length === posiciones.length,
            `La cabecera "${campo}" cambió su multiplicidad.`);

        posiciones.forEach((posicionBase, indiceDuplicado) => {
            if (EDITABLES.includes(campo)) return;
            const posicionSalida = posicionesSalida[indiceDuplicado];
            const antes = String(baseFila[posicionBase] ?? "");
            const despues = String(salidaFila[posicionSalida] ?? "");
            if (antes !== despues) {
                diferencias.push({ campo, posicion: posicionBase + 1, antes, despues });
            }
        });
    });
    return diferencias;
}

async function main() {
    console.log("======================================");
    console.log("PRUEBA — EXPORTACIÓN GALERÍA EDITORIAL V2.2");
    console.log("======================================");
    console.log("");
    console.log("Objetivo: verificar que galeriaEditorial[] cruce la frontera Editorial → Exportación → Galería General.");
    console.log("La prueba no realiza llamadas a OpenAI.");
    console.log("");

    const rutaCSV = path.join(process.cwd(), "Proyectos", "Historias_WIX_ORIGINAL.csv");
    exigir(fs.existsSync(rutaCSV), `No se encontró el CSV maestro real: ${rutaCSV}`);

    const hashAntes = hash(rutaCSV);
    const entrada = leer(rutaCSV);
    const entradaIndice = indice(entrada.encabezados);
    const entradaProyectos = proyectos(entrada);

    console.log(`✓ CSV maestro: ${rutaCSV}`);
    console.log(`✓ Proyectos capturados: ${entradaProyectos.size}`);
    exigir(entradaProyectos.size === PROYECTOS.length,
        "El CSV maestro no contiene exactamente los cuatro proyectos esperados.");

    console.log("1. Verificando contrato físico de Galería General...");
    exigir((entradaIndice["Galería General"] || []).length === 1,
        "Galería General debe existir como una única columna Wix.");
    exigir((entradaIndice[HISTORIAS_WIX] || []).length === 2,
        `Se esperaban exactamente 2 columnas "${HISTORIAS_WIX}".`);
    exigir((entradaIndice[HERO_IMAGEN] || []).length === 1,
        `Se esperaba exactamente 1 columna "${HERO_IMAGEN}".`);
    exigir(!entradaIndice[HISTORIA], `El campo Companion "${HISTORIA}" ya existe en el CSV maestro.`);
    console.log("✓ Galería General existe como columna Wix única.");
    console.log("✓ Historias de Transformación ×2 y Hero Imágen están presentes.");
    console.log("");

    const fotos = [
        {
            fileName: "hogar-araque-cocina-01.jpg",
            slug: "hogar-araque-cocina-01",
            alt: "Cocina del Hogar Araque",
            src: "https://static.wixstatic.com/media/hogar-araque-cocina-01.jpg",
            title: "Cocina del Hogar Araque",
            type: "image",
            settings: { focalPoint: { x: 0.5, y: 0.5 }, height: 1200, width: 1800 },
            description: "Cocina renovada del Hogar Araque.",
            keywords: ["cocina", "mobiliario", "Araque"],
            nombreSEO: "cocina-hogar-araque"
        },
        {
            fileName: "hogar-araque-sala-02.jpg",
            slug: "hogar-araque-sala-02",
            alt: "Sala del Hogar Araque",
            src: "https://static.wixstatic.com/media/hogar-araque-sala-02.jpg",
            title: "Sala del Hogar Araque",
            type: "image",
            settings: { focalPoint: { x: 0.4, y: 0.6 }, height: 1350, width: 2025 },
            description: "Sala transformada del Hogar Araque.",
            keywords: ["sala", "interiorismo", "Araque"],
            nombreSEO: "sala-hogar-araque"
        },
        {
            fileName: "hogar-araque-estudio-03.jpg",
            slug: "hogar-araque-estudio-03",
            alt: "Estudio del Hogar Araque",
            src: "https://static.wixstatic.com/media/hogar-araque-estudio-03.jpg",
            title: "Estudio del Hogar Araque",
            type: "image",
            settings: { focalPoint: { x: 0.6, y: 0.45 }, height: 1100, width: 1650 },
            description: "Estudio diseñado a medida para el Hogar Araque.",
            keywords: ["estudio", "mobiliario", "Araque"],
            nombreSEO: "estudio-hogar-araque"
        }
    ];

    console.log(`2. Preparando galería editorial controlada: ${fotos.length} fotografías...`);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mubato-exportacion-galeria-v2-2-"));
    const copiaEntrada = path.join(tmp, "entrada.csv");
    const salidaCSV = path.join(tmp, "salida-editorial.csv");
    fs.copyFileSync(rutaCSV, copiaEntrada);

    const editorial = {
        codigo: "MUB-ARAQUE-5.5",
        heroTexto: "Hero control 5.5",
        descripcion: "Descripción control 5.5",
        servicios: "Diseño interior, mobiliario a medida",
        slug: "hogar-araque-5-5",
        seoTitle: "Hogar Araque | MUBATO — 5.5",
        metaDescription: "Historia de transformación de Hogar Araque — control 5.5.",
        historia: "Historia editorial control 5.5 de Araque",
        galeriaEditorial: fotos
    };

    console.log("✓ Contrato editorial V2.2 preparado.");
    console.log("");

    console.log("3. Ejecutando SalidaEditorialCSV...");
    const salida = new SalidaEditorialCSV();
    const resultado = salida.exportar({
        rutaEntrada: copiaEntrada,
        rutaSalida: salidaCSV,
        filaProyecto: objetoFila(entrada, OBJETIVO),
        editorial
    });

    exigir(resultado && fs.existsSync(resultado.rutaSalida),
        "La salida editorial no fue creada.");
    console.log("✓ Salida editorial generada.");
    console.log("");

    console.log("4. Verificando integridad del CSV de entrada...");
    exigir(hash(rutaCSV) === hashAntes, "VIOLACIÓN: el CSV maestro original fue modificado.");
    exigir(hash(copiaEntrada) === hashAntes, "VIOLACIÓN: la copia de entrada fue modificada.");
    console.log("✓ CSV maestro intacto.");
    console.log("✓ Copia de entrada intacta.");
    console.log("");

    console.log("5. Verificando estructura física de la salida...");
    const salidaMatriz = leer(resultado.rutaSalida);
    exigir(salidaMatriz.encabezados.length === entrada.encabezados.length + 1,
        "La salida debe contener únicamente la columna Companion Historia adicional.");
    entrada.encabezados.forEach((campo, posicion) => {
        exigir(salidaMatriz.encabezados[posicion] === campo,
            `La cabecera en posición ${posicion + 1} cambió.`);
    });
    exigir(salidaMatriz.encabezados[salidaMatriz.encabezados.length - 1] === HISTORIA,
        `La única cabecera nueva debe ser "${HISTORIA}".`);
    exigir((indice(salidaMatriz.encabezados)["Galería General"] || []).length === 1,
        "Galería General debe permanecer como una columna única.");
    console.log("✓ Cabeceras Wix originales conservan posición y nombre.");
    console.log("✓ Galería General permanece como columna Wix existente.");
    console.log("");

    console.log("6. Verificando Galería General exportada...");
    const galeriaSerializada = valorCelda(salidaMatriz, OBJETIVO, "Galería General");
    let galeriaExportada;
    try {
        galeriaExportada = JSON.parse(galeriaSerializada);
    } catch (error) {
        throw new Error(`Galería General no contiene JSON válido: ${error.message}`);
    }

    exigir(Array.isArray(galeriaExportada), "Galería General debe serializar un array JSON.");
    exigir(galeriaExportada.length === fotos.length,
        `Galería General debe contener ${fotos.length} fotografías; contiene ${galeriaExportada.length}.`);

    fotos.forEach((foto, indiceFoto) => {
        const esperado = objetoWixEsperado(foto);
        const actual = galeriaExportada[indiceFoto];
        exigir(JSON.stringify(actual) === JSON.stringify(esperado),
            `La fotografía ${indiceFoto + 1} no coincide con la proyección Wix esperada.`);
        exigir(!Object.prototype.hasOwnProperty.call(actual, "keywords"),
            `La fotografía ${indiceFoto + 1} no debe exportar keywords dentro de Galería General.`);
        exigir(!Object.prototype.hasOwnProperty.call(actual, "nombreSEO"),
            `La fotografía ${indiceFoto + 1} no debe exportar nombreSEO dentro de Galería General.`);
    });

    console.log(`✓ Galería General contiene exactamente ${galeriaExportada.length} fotografías.`);
    console.log("✓ Orden editorial conservado.");
    console.log("✓ Identidad y estructura Wix conservadas por fotografía.");
    console.log("✓ keywords y nombreSEO permanecen fuera de Galería General.");
    console.log("");

    console.log("7. Verificando aislamiento de proyectos y campos protegidos...");
    const diferenciasNoEditables = [];
    PROYECTOS.forEach(proyecto => {
        diferenciasNoEditables.push(...compararNoEditables(entrada, salidaMatriz, proyecto));
    });
    exigir(diferenciasNoEditables.length === 0,
        `Se detectaron ${diferenciasNoEditables.length} mutaciones fuera del contrato.`);

    exigir(valorCelda(salidaMatriz, OBJETIVO, HISTORIA) === editorial.historia,
        "Historia no fue exportada correctamente al proyecto objetivo.");
    exigir(valorCelda(salidaMatriz, "Hogar Tijo", HISTORIA) === "",
        "Historia no debe contener contenido en Tijo.");
    exigir(valorCelda(salidaMatriz, "Hogar Rolón", HISTORIA) === "",
        "Historia no debe contener contenido en Rolón.");
    exigir(valorCelda(salidaMatriz, "Hogar Quesada", HISTORIA) === "",
        "Historia no debe contener contenido en Quesada.");

    console.log("✓ Tijo, Rolón y Quesada permanecen intactos fuera de campos autorizados.");
    console.log("✓ Historias de Transformación permanecen intactas.");
    console.log("✓ Hero Imágen permanece intacto.");
    console.log("✓ Historia Companion permanece aislada en Araque.");
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 5.5.1");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ galeriaEditorial[] cruza Editorial → Exportación → Galería General.");
    console.log("✓ Galería General conserva cantidad y orden editorial.");
    console.log("✓ Estructura Wix por fotografía verificada.");
    console.log("✓ Campos fotográficos no pertenecientes a Galería General no fueron exportados.");
    console.log("✓ Aislamiento multiproyecto preservado.");
    console.log("✓ No se realizaron llamadas a OpenAI.");
}

main().catch(error => {
    console.error("");
    console.error("--------------------------------------");
    console.error("PRUEBA FALLIDA — 5.5.1");
    console.error("--------------------------------------");
    console.error(`✗ ${error.message}`);
    process.exitCode = 1;
});
