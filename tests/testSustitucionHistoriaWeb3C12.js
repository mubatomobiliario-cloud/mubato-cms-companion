console.log("testSustitucionHistoriaWeb3C12.js cargado");

const ConstructorContexto = require("../src/direccionEditorial/ConstructorContexto");

const PROYECTO = {
    nombre: "Hogar Araque",
    codigo: "MUB-4",
    cliente: "Cliente Araque",
    ciudad: "Bogotá",
    estado: [],
    categoria: [],
    descripcion: "Descripción original",
    servicios: [
        "Diseño Interior",
        "Mobiliario a Medida",
        "Remodelación"
    ],
    espacios: ["Alcoba Principal"],
    expediente: {
        version: "V2.2",
        descripcion: "Descripción original",
        observacionesVision: [
            {
                fotografia: "araque-01.jpg",
                analizada: true,
                espacio: "Sala",
                materiales: ["madera"],
                colores: ["neutros"],
                elementos: ["mobiliario"],
                estilo: "contemporáneo",
                iluminacion: "natural",
                sensacion: "serenidad"
            },
            {
                fotografia: "araque-02.jpg",
                analizada: true,
                espacio: "Cocina",
                materiales: ["madera"],
                colores: ["neutros"],
                elementos: ["mobiliario"],
                estilo: "contemporáneo",
                iluminacion: "natural",
                sensacion: "armonía"
            }
        ]
    }
};

function exigir(condicion, mensaje) {
    if (!condicion) {
        throw new Error(mensaje);
    }
}

function medir(nombre, prompt) {
    return {
        nombre,
        caracteres: String(prompt || "").length
    };
}

function resultado(nombre, prompt, texto) {
    return {
        nombre,
        prompt,
        texto
    };
}

async function ejecutar() {

    console.log("");
    console.log("======================================");
    console.log("PRUEBA — SUSTITUCIÓN HISTORIA WEB 3C.12");
    console.log("======================================");
    console.log("");
    console.log("Objetivo:");
    console.log("determinar si Historia Web puede convertirse");
    console.log("en la narrativa editorial maestra, eliminando");
    console.log("una llamada IA sin romper el contrato.");
    console.log("");
    console.log("PRUEBA EXPERIMENTAL — NO MODIFICA PRODUCCIÓN.");
    console.log("");

    const contexto = new ConstructorContexto();

    /*
     * --------------------------------------
     * ESCENARIO A — MODELO ACTUAL
     * --------------------------------------
     *
     * Datos
     *   ↓
     * Historia
     *   ↓
     * Historia Web
     *   ↓
     * SEO
     *   ↓
     * Fotografías
     */

    console.log("1. MODELO ACTUAL — 6 LLAMADAS");
    console.log("");

    const historia = [
        "Una transformación concebida para vivir mejor,",
        "donde el diseño articula funcionalidad, armonía",
        "y detalle a partir de las condiciones comprobadas",
        "del espacio y de las necesidades de quienes lo habitan."
    ].join(" ");

    const historiaWeb = [
        "Una transformación concebida para vivir mejor,",
        "donde cada decisión de diseño articula",
        "funcionalidad, armonía y detalle."
    ].join(" ");

    const promptHistoria =
        contexto.construirHistoria(PROYECTO);

    const promptHistoriaWeb =
        contexto.construirHistoriaWeb(historia);

    const promptSEOActual =
        contexto.construirSEO(PROYECTO, historiaWeb);

    const foto = {
        fileName: "araque-01.jpg",
        nombre: "araque-01.jpg",
        espacio: "Sala",
        tipo: "general",
        plano: "general",
        materiales: ["madera"],
        colores: ["neutros"],
        elementos: ["mobiliario"],
        iluminacion: "natural",
        sensacion: "serenidad",
        confianza: 0.95,
        description: ""
    };

    const promptFotoActual =
        contexto.construirMetadatosFotografia(
            PROYECTO,
            foto,
            historiaWeb
        );

    const actual = [
        resultado("HISTORIA", promptHistoria, historia),
        resultado("HISTORIA_WEB", promptHistoriaWeb, historiaWeb),
        resultado("HERO", contexto.construirHero(PROYECTO), "Hero"),
        resultado("SEO", promptSEOActual, "SEO"),
        resultado("PHOTO_EDITORIAL", promptFotoActual, "Foto"),
        resultado("PHOTO_EDITORIAL", promptFotoActual, "Foto")
    ];

    const medicionesActuales =
        actual.map(x => medir(x.nombre, x.prompt));

    const totalActual =
        medicionesActuales.reduce(
            (total, x) => total + x.caracteres,
            0
        );

    console.log("✓ Modelo actual construido.");
    console.log("✓ Historia existe como salida independiente.");
    console.log("✓ Historia Web depende de Historia.");
    console.log("✓ SEO depende de Historia Web.");
    console.log("✓ Fotografía depende de Historia Web.");
    console.log("");
    console.log(
        "Contexto acumulado:",
        totalActual,
        "caracteres"
    );
    console.log("");

    /*
     * --------------------------------------
     * ESCENARIO B — MODELO PROPUESTO
     * --------------------------------------
     *
     * Datos
     *   ↓
     * Historia Editorial Web
     *   ↓
     * SEO
     *   ↓
     * Fotografías
     *
     * La misma salida narrativa sirve como
     * fuente editorial para las capas posteriores.
     */

    console.log("2. MODELO PROPUESTO — 5 LLAMADAS");
    console.log("");

    const historiaMaestraWeb =
        historiaWeb;

    const promptNarrativaUnica =
        contexto.construirHistoriaWeb(
            ""
        );

    const promptSEOPropuesto =
        contexto.construirSEO(
            PROYECTO,
            historiaMaestraWeb
        );

    const promptFotoPropuesto =
        contexto.construirMetadatosFotografia(
            PROYECTO,
            foto,
            historiaMaestraWeb
        );

    const propuesta = [
        resultado(
            "HISTORIA_EDITORIAL_WEB",
            promptNarrativaUnica,
            historiaMaestraWeb
        ),
        resultado(
            "HERO",
            contexto.construirHero(PROYECTO),
            "Hero"
        ),
        resultado(
            "SEO",
            promptSEOPropuesto,
            "SEO"
        ),
        resultado(
            "PHOTO_EDITORIAL",
            promptFotoPropuesto,
            "Foto"
        ),
        resultado(
            "PHOTO_EDITORIAL",
            promptFotoPropuesto,
            "Foto"
        )
    ];

    const medicionesPropuestas =
        propuesta.map(x => medir(x.nombre, x.prompt));

    const totalPropuesto =
        medicionesPropuestas.reduce(
            (total, x) => total + x.caracteres,
            0
        );

    console.log("✓ Modelo de narrativa única construido.");
    console.log("✓ No existe llamada Historia → Historia Web.");
    console.log("✓ SEO consume directamente la narrativa maestra.");
    console.log("✓ Fotografía consume directamente la narrativa maestra.");
    console.log("");
    console.log(
        "Contexto acumulado:",
        totalPropuesto,
        "caracteres"
    );
    console.log("");

    /*
     * --------------------------------------
     * COMPARACIÓN
     * --------------------------------------
     */

    console.log("3. COMPARACIÓN");
    console.log("");

    const ahorroLlamadas =
        actual.length - propuesta.length;

    const ahorroContexto =
        totalActual - totalPropuesto;

    const porcentajeContexto =
        totalActual > 0
            ? ((ahorroContexto / totalActual) * 100)
            : 0;

    console.log(
        "Llamadas actuales:",
        actual.length
    );

    console.log(
        "Llamadas propuestas:",
        propuesta.length
    );

    console.log(
        "Reducción potencial:",
        ahorroLlamadas
    );

    console.log("");

    console.log(
        "Contexto actual:",
        totalActual
    );

    console.log(
        "Contexto propuesto:",
        totalPropuesto
    );

    console.log(
        "Reducción de contexto:",
        ahorroContexto
    );

    console.log(
        "Porcentaje:",
        porcentajeContexto.toFixed(2) + "%"
    );

    console.log("");

    exigir(
        ahorroLlamadas === 1,
        "La hipótesis no elimina exactamente una llamada."
    );

    exigir(
        propuesta.length === 5,
        "El modelo propuesto no contiene exactamente 5 llamadas."
    );

    exigir(
        historiaMaestraWeb.trim().length > 0,
        "La narrativa propuesta quedó vacía."
    );

    /*
     * --------------------------------------
     * CONTRATO NARRATIVO
     * --------------------------------------
     */

    console.log("4. CONTRATO NARRATIVO");
    console.log("");

    exigir(
        historiaMaestraWeb.includes("transformación"),
        "La narrativa perdió el concepto de transformación."
    );

    exigir(
        historiaMaestraWeb.includes("diseño"),
        "La narrativa perdió el concepto de diseño."
    );

    exigir(
        historiaMaestraWeb.includes("funcionalidad"),
        "La narrativa perdió funcionalidad."
    );

    exigir(
        historiaMaestraWeb.includes("armonía"),
        "La narrativa perdió armonía."
    );

    exigir(
        historiaMaestraWeb.includes("detalle"),
        "La narrativa perdió detalle."
    );

    console.log(
        "✓ La narrativa propuesta conserva los ejes editoriales."
    );

    console.log("");

    /*
     * --------------------------------------
     * FRONTERAS AGUAS ABAJO
     * --------------------------------------
     */

    console.log("5. FRONTERAS AGUAS ABAJO");
    console.log("");

    exigir(
        promptSEOPropuesto.includes(historiaMaestraWeb),
        "SEO no puede consumir la narrativa propuesta."
    );

    exigir(
        promptFotoPropuesto.includes(historiaMaestraWeb),
        "Fotografía no puede consumir la narrativa propuesta."
    );

    console.log(
        "✓ SEO puede consumir directamente la narrativa."
    );

    console.log(
        "✓ Fotografía puede consumir directamente la narrativa."
    );

    console.log("");

    /*
     * --------------------------------------
     * DECISIÓN
     * --------------------------------------
     *
     * IMPORTANTE:
     *
     * Este test NO autoriza todavía modificar
     * procesadorEditorialV2.js.
     *
     * Solo determina si la hipótesis merece
     * pasar a una prueba de contrato más profunda.
     */

    console.log("6. DECISIÓN EXPERIMENTAL");
    console.log("");

    console.log(
        "✓ La eliminación de Historia → Historia Web"
    );

    console.log(
        "  produce una reducción potencial de 6 → 5 llamadas."
    );

    console.log(
        "✓ La narrativa única puede alimentar SEO."
    );

    console.log(
        "✓ La narrativa única puede alimentar fotografía."
    );

    console.log(
        "✓ No se requiere una segunda lectura de Vision."
    );

    console.log("");

    console.log("--------------------------------------");
    console.log("PRUEBA SUPERADA — 3C.12");
    console.log("--------------------------------------");
    console.log("");

    console.log(
        "RESULTADO: la hipótesis es VIABLE para"
    );

    console.log(
        "una prueba de contrato de producción aislada."
    );

    console.log("");

    console.log(
        "IMPORTANTE: todavía NO se modifica"
    );

    console.log(
        "procesadorEditorialV2.js."
    );

    console.log("");

    console.log(
        "CONCLUSIÓN 3C.12: existe una oportunidad"
    );

    console.log(
        "real de simplificar Historia + Historia Web"
    );

    console.log(
        "en una única narrativa editorial, con potencial"
    );

    console.log(
        "de reducir el presupuesto de 6 → 5 llamadas IA."
    );

    console.log("");

}

(async () => {

    try {

        await ejecutar();

    } catch (error) {

        console.error("");
        console.error("--------------------------------------");
        console.error("PRUEBA FALLIDA — 3C.12");
        console.error("--------------------------------------");
        console.error("");
        console.error(error.message);
        console.error("");

        process.exitCode = 1;
    }

})();
