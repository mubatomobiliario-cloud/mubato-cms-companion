const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const Parser = require("../src/core/parser");
const ExpedienteProyecto = require("../src/direccionEditorial/expedienteProyecto");
const ConstructorContexto = require("../src/direccionEditorial/ConstructorContexto");
const OpenAIClient = require("../src/direccionEditorial/openAIClient");
const AdaptadorCSVEditorial = require("../src/Exportadores/adaptadorCSVEditorial");

async function ejecutar() {
    const carpetaProyecto = "Proyectos/Araque";
    const rutaCSV = path.join(carpetaProyecto, "Historias+de+Transformación (10).csv");
    const rutaSalida = path.join(carpetaProyecto, "salida", "Hogar_Araque_EDITORIAL.csv");

    const parser = new Parser();
    const proyecto = parser.importarCarpeta(carpetaProyecto);

    // Reutilizamos las observaciones Vision de la prueba controlada.
    const observaciones = {
        "IMG_1072.jpeg": { espacio: "Alcoba Principal", tipo: "", plano: "General", estilo: "Contemporáneo", materiales: ["Madera Natural", "Mármol", "Vidrio", "Metal Negro"], colores: ["Blanco", "Beige", "Gris", "Marrón", "Negro"], elementos: ["Cama", "Almohada", "Televisor", "Persiana", "Ventana", "Mesa de noche", "Lámpara", "Gabinete"], iluminacion: "Mixta", sensacion: "Calidez", confianza: 94 },
        "IMG_1073.jpeg": { espacio: "Alcoba Principal", tipo: "", plano: "General", estilo: "Contemporáneo", materiales: ["Madera Natural", "Vidrio", "Tela"], colores: ["Blanco", "Beige", "Negro", "Marrón", "Gris"], elementos: ["Cama", "Televisor", "Persiana", "Ventana", "Mueble suspendido", "Armario", "Lámpara", "Panel"], iluminacion: "Mixta", sensacion: "Calma", confianza: 90 },
        "IMG_1076.jpeg": { espacio: "Alcoba Principal", tipo: "", plano: "General", estilo: "Contemporáneo", materiales: ["Madera Natural", "Piedra", "Textil", "Vidrio", "Metal"], colores: ["Blanco", "Beige", "Gris", "Marrón"], elementos: ["Cama", "Almohada", "Armario", "Mesa de noche", "Repisa", "Lámpara", "Persiana", "Ventana", "Cabecero", "Interruptor", "Control remoto"], iluminacion: "Mixta", sensacion: "Calma", confianza: 90 }
    };

    proyecto.fotografias.forEach(foto => {
        const datos = observaciones[foto.nombre];
        if (datos) Object.assign(foto, datos, { analizada: true });
    });

    proyecto.expediente = new ExpedienteProyecto().construir(proyecto);
    const constructor = new ConstructorContexto();
    const openAI = new OpenAIClient();

    console.log("======================================");
    console.log("INTEGRACIÓN CONTROLADA — HISTORIA + SEO + CSV");
    console.log("HOGAR ARAQUE");
    console.log("======================================\n");
    console.log("Vision: NO (observaciones reutilizadas)");

    console.log("GENERANDO HISTORIA...");
    const promptHistoria = constructor.construirHistoria(proyecto);
    const historia = (await openAI.generarTexto(promptHistoria)).trim();
    console.log(`✓ Historia generada: ${historia.length} caracteres\n`);

    console.log("GENERANDO SEO...");
    const promptSEO = constructor.construirSEO(proyecto, historia);
    const seoRaw = (await openAI.generarTexto(promptSEO)).trim();

    let seo;
    try {
        const limpio = seoRaw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        seo = JSON.parse(limpio);
    } catch (error) {
        throw new Error(`La respuesta SEO no es JSON válido: ${seoRaw}`);
    }

    console.log(`✓ SEO generado: ${JSON.stringify(seo)}\n`);

    const contenido = fs.readFileSync(rutaCSV, "utf8");
    const parsed = Papa.parse(contenido, { header: true, skipEmptyLines: true });
    const filaPendiente = parsed.data.find(fila => String(fila["Código MUBATO"] || "").trim() === "");

    if (!filaPendiente) throw new Error("No se encontró fila pendiente en el CSV.");

    const adaptador = new AdaptadorCSVEditorial();
    const resultado = adaptador.exportar({
        rutaEntrada: rutaCSV,
        rutaSalida,
        filaProyecto: filaPendiente,
        camposEditoriales: {
            codigo: proyecto.codigo,
            seoTitle: seo.seoTitle,
            metaDescription: seo.metaDescription,
            slug: proyecto.slug
        }
    });

    // La historia se conserva en memoria para esta primera integración.
    // No modificamos todavía los campos semánticos Historia/Hero/Descripción.
    console.log("======================================");
    console.log("RESULTADO INTEGRACIÓN");
    console.log("======================================\n");
    console.log(JSON.stringify({
        proyecto: resultado.proyecto,
        historiaCaracteres: historia.length,
        seoTitle: seo.seoTitle,
        metaDescription: seo.metaDescription,
        camposCSV: resultado.camposActualizados,
        rutaSalida: resultado.rutaSalida,
        vision: false,
        llamadasIA: 2,
        originalModificado: false
    }, null, 2));
}

ejecutar().catch(error => {
    console.error("\n======================================");
    console.error("ERROR EN LA INTEGRACIÓN");
    console.error("======================================\n");
    console.error(error);
    process.exit(1);
});
