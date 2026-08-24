console.log("testFronteraIA.js cargado");

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const extensiones = new Set([".js", ".json"]);
const directoriosIgnorados = new Set(["node_modules", ".git", "Proyectos"]);
const archivosIgnorados = new Set(["package-lock.json"]);

function recorrer(directorio) {
    const resultados = [];

    for (const entrada of fs.readdirSync(directorio, { withFileTypes: true })) {
        if (directoriosIgnorados.has(entrada.name)) continue;

        const ruta = path.join(directorio, entrada.name);

        if (entrada.isDirectory()) {
            resultados.push(...recorrer(ruta));
            continue;
        }

        if (!extensiones.has(path.extname(entrada.name))) continue;
        if (archivosIgnorados.has(entrada.name)) continue;

        resultados.push(ruta);
    }

    return resultados;
}

function leer(ruta) {
    return fs.readFileSync(ruta, "utf8");
}

function relativo(ruta) {
    return path.relative(ROOT, ruta);
}

function assert(condicion, mensaje) {
    if (!condicion) throw new Error(mensaje);
}

function contarCoincidencias(texto, patron) {
    return (texto.match(patron) || []).length;
}

function ejecutar() {
    console.log("");
    console.log("======================================");
    console.log("PRUEBA — FRONTERA DE IA");
    console.log("======================================");
    console.log("");

    const archivos = recorrer(ROOT);
    const codigo = archivos.map(ruta => ({ ruta, contenido: leer(ruta) }));

    const referenciasOpenAI = [];
    const llamadasDirectas = [];
    const importsOpenAI = [];

    for (const archivo of codigo) {
        const { ruta, contenido } = archivo;
        const nombre = relativo(ruta);

        if (/OpenAI|openai|OPENAI_API_KEY/.test(contenido)) {
            referenciasOpenAI.push(nombre);
        }

        if (/require\(["']openai["']\)|from\s+["']openai["']/.test(contenido)) {
            importsOpenAI.push(nombre);
        }

        if (/responses\.create\s*\(/.test(contenido)) {
            llamadasDirectas.push({
                archivo: nombre,
                cantidad: contarCoincidencias(contenido, /responses\.create\s*\(/g)
            });
        }
    }

    console.log("1. Localizando referencias al proveedor...");
    console.log(`✓ Referencias OpenAI encontradas en ${referenciasOpenAI.length} archivo(s).`);
    referenciasOpenAI.forEach(archivo => console.log(`  • ${archivo}`));
    console.log("");

    console.log("2. Localizando imports directos del SDK...");
    importsOpenAI.forEach(archivo => console.log(`  • ${archivo}`));
    assert(
        importsOpenAI.length === 1 && importsOpenAI[0] === "src/direccionEditorial/openAIClient.js",
        "El SDK de OpenAI está importado fuera de la frontera openAIClient.js."
    );
    console.log("✓ El SDK OpenAI está encapsulado en openAIClient.js.");
    console.log("");

    console.log("3. Localizando llamadas directas a la API...");
    llamadasDirectas.forEach(item => console.log(`  • ${item.archivo}: ${item.cantidad} llamada(s)`));
    assert(
        llamadasDirectas.length === 1 && llamadasDirectas[0].archivo === "src/direccionEditorial/openAIClient.js",
        "Existe una llamada directa a OpenAI fuera de openAIClient.js."
    );
    console.log("✓ Las llamadas responses.create están encapsuladas en openAIClient.js.");
    console.log("");

    console.log("4. Verificando responsabilidades de la frontera...");
    const cliente = leer(path.join(ROOT, "src/direccionEditorial/openAIClient.js"));

    assert(cliente.includes("process.env.OPENAI_API_KEY"), "openAIClient.js no concentra la lectura de OPENAI_API_KEY.");
    assert(cliente.includes("config.IA.modelo"), "openAIClient.js no concentra la selección del modelo actual.");
    assert(cliente.includes("generarTexto"), "Falta operación de generación de texto.");
    assert(cliente.includes("analizarImagen"), "Falta operación de análisis de imagen.");
    assert(cliente.includes("analizarImagenJSON"), "Falta operación JSON de visión.");
    console.log("✓ Credencial, modelo y operaciones IA están concentrados en el cliente.");
    console.log("");

    console.log("5. Verificando dependencia declarada del proyecto...");
    const packageJson = JSON.parse(leer(path.join(ROOT, "package.json")));
    assert(packageJson.dependencies && packageJson.dependencies.openai, "La dependencia openai no está declarada en package.json.");
    console.log(`✓ SDK OpenAI declarado: ${packageJson.dependencies.openai}`);
    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA");
    console.log("--------------------------------------");
    console.log("");
    console.log("✓ La frontera actual de IA está identificada.");
    console.log("✓ Solo openAIClient.js importa el SDK OpenAI.");
    console.log("✓ Solo openAIClient.js ejecuta responses.create.");
    console.log("✓ Vision y Editorial no contienen llamadas directas al SDK.");
    console.log("✓ La credencial y el modelo están centralizados.");
    console.log("✓ No se realizó ninguna llamada a OpenAI.");
    console.log("");
    console.log("CONCLUSIÓN 3A: OpenAI está encapsulado en una frontera única.");
    console.log("Siguiente decisión: evaluar si esa frontera debe convertirse en una interfaz de proveedor IA.");
    console.log("");
}

try {
    ejecutar();
} catch (error) {
    console.error("");
    console.error("✗ PRUEBA FALLIDA");
    console.error("");
    console.error(error.message);
    process.exitCode = 1;
}
