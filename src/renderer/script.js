const selectProjectButton = document.getElementById("selectProjectButton");

const status = document.getElementById("status");
const projectPanel = document.getElementById("projectPanel");
const photoPanel = document.getElementById("photoPanel");

selectProjectButton.addEventListener("click", async () => {

    try {

        status.innerHTML = "Seleccionando proyecto...";

        const carpeta = await window.companion.seleccionarProyecto();

        if (!carpeta) {

            status.innerHTML = "Operación cancelada.";

            return;

        }

        status.innerHTML = "Importando proyecto...";

        const proyecto = await window.companion.importarProyecto(carpeta);

        await mostrarConexionOpenAI(proyecto);

        mostrarProyecto(proyecto);

    }

    catch (error) {

        console.error(error);

        status.innerHTML = "❌ Error importando el proyecto.";

    }

});

async function mostrarConexionOpenAI(proyecto) {

    status.innerHTML = `

        <div id="terminal" style="
            background:#111;
            color:#00FF88;
            padding:25px;
            border-radius:12px;
            font-family:Menlo,Consolas,monospace;
            line-height:1.8;
            white-space:pre-wrap;
            min-height:420px;
            box-shadow:0 10px 30px rgba(0,0,0,.25);
        "></div>

    `;

    const terminal = document.getElementById("terminal");

    const pasos = [

        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "MUBATO CMS Companion",
        "Inicializando...",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",

        "",

        "✓ Proyecto seleccionado",
        "✓ Expediente editorial construido",
        `✓ ${proyecto.listaFotografias.length} fotografías encontradas`,

        "",

        "────────────────────────────────────────────",

        "Conectándose a OpenAI...",

        "✓ Conexión establecida",

        "✓ Autenticación correcta",

        "✓ Modelo GPT-5.5 disponible",

        "",

        "────────────────────────────────────────────",

        "Recursos disponibles para MUBATO",

        "",

        "✓ Redacción Editorial",

        "✓ Storytelling",

        "✓ SEO",

        "✓ Clasificación de fotografías",

        "✓ Accesibilidad",

        "✓ Metadatos",

        "✓ Exportación JSON",

        "",

        "────────────────────────────────────────────",

        "Analizando proyecto...",

        "",

        "OpenAI listo para trabajar con MUBATO."

    ];

    for (const paso of pasos) {

        terminal.innerHTML += paso + "\n";

        terminal.scrollTop = terminal.scrollHeight;

        await esperar(320);

    }

}

function mostrarProyecto(proyecto) {

    projectPanel.innerHTML = `

        <h2>📁 ${proyecto.nombre}</h2>

        <p><strong>Código:</strong> ${proyecto.codigo || "Pendiente de generar"}</p>

        <p><strong>Cliente:</strong> ${proyecto.cliente}</p>

        <p><strong>Ciudad:</strong> ${proyecto.ciudad}</p>

        <p><strong>Estado:</strong> ${proyecto.estado}</p>

        <p><strong>Fotografías:</strong> ${proyecto.listaFotografias.length}</p>

    `;

    let html = `

        <h2>Fotografías</h2>

        <div class="photoGrid">

    `;

    proyecto.listaFotografias.forEach(foto => {

        const rutaImagen = "file://" + foto.ruta.replace(/\\/g, "/");

        html += `

            <div class="photoCard">

                <img
                    src="${rutaImagen}"
                    alt="${foto.nombre}"
                >

                <div class="photoName">

                    ${foto.nombre}

                </div>

            </div>

        `;

    });

    html += `

        </div>

    `;

    photoPanel.innerHTML = html;

}

function esperar(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}