const selectProjectButton = document.getElementById("selectProjectButton");
const analyzeButton = document.getElementById("analyzeButton");
const exportButton = document.getElementById("exportButton");

const status = document.getElementById("status");
const projectPanel = document.getElementById("projectPanel");
const photoPanel = document.getElementById("photoPanel");

let proyectoSeleccionado = null;
let carpetaSeleccionada = null;


//==================================================
// SELECCIONAR PROYECTO
//==================================================

selectProjectButton.addEventListener("click", async () => {

    try {

        status.innerHTML = "Seleccionando proyecto...";

        const carpeta = await window.companion.seleccionarProyecto();

        if (!carpeta) {

            status.innerHTML = "Operación cancelada.";

            return;

        }

        carpetaSeleccionada = carpeta;

        status.innerHTML = "Importando proyecto...";

        const proyecto =
            await window.companion.importarProyecto(carpeta);

        proyectoSeleccionado = proyecto;

        mostrarProyecto(proyecto);

        analyzeButton.disabled = false;

        exportButton.disabled = true;

        status.innerHTML = "✓ Proyecto listo para análisis.";

    }

    catch (error) {

        console.error(error);

        proyectoSeleccionado = null;
        carpetaSeleccionada = null;

        analyzeButton.disabled = true;

        exportButton.disabled = true;

        status.innerHTML =
            "❌ Error importando el proyecto.";

    }

});


//==================================================
// MOSTRAR PROYECTO
//==================================================

function mostrarProyecto(proyecto) {

    projectPanel.innerHTML = `

        <h2>📁 ${proyecto.nombre}</h2>

        <p>
            <strong>Código:</strong>
            ${proyecto.codigo || "Pendiente de generar"}
        </p>

        <p>
            <strong>Cliente:</strong>
            ${proyecto.cliente || "Sin información"}
        </p>

        <p>
            <strong>Ciudad:</strong>
            ${proyecto.ciudad || "Sin información"}
        </p>

        <p>
            <strong>Estado:</strong>
            ${proyecto.estado || "Sin información"}
        </p>

        <p>
            <strong>Fotografías:</strong>
            ${proyecto.listaFotografias.length}
        </p>

        ${proyecto.expediente ? `
            <p><strong>Espacios detectados:</strong>
                ${(proyecto.expediente.espacios || []).join(", ") || "Ninguno"}
            </p>
        ` : ""}

    `;


    let html = `

        <h2>Fotografías</h2>

        <div class="photoGrid">

    `;


    proyecto.listaFotografias.forEach(foto => {

        const rutaImagen =
            "file://" + foto.ruta.replace(/\\/g, "/");

        html += `

            <div class="photoCard">

                <img
                    src="${rutaImagen}"
                    alt="${foto.nombre}"
                >

                <div class="photoName">

                    ${foto.nombre}

                </div>

                ${foto.analizada ? `
                    <div class="photoAnalysis">
                        ${foto.espacio || ""}
                        ${foto.plano ? ` · ${foto.plano}` : ""}
                    </div>
                ` : ""}

            </div>

        `;

    });


    html += `

        </div>

    `;

    photoPanel.innerHTML = html;

}


//==================================================
// ANALIZAR FOTOGRAFÍAS
//==================================================

analyzeButton.addEventListener("click", async () => {

    if (!proyectoSeleccionado || !carpetaSeleccionada) {

        status.innerHTML =
            "⚠️ Primero debes seleccionar un proyecto.";

        return;

    }

    try {

        analyzeButton.disabled = true;
        exportButton.disabled = true;

        status.innerHTML = `
            Analizando fotografías de
            <strong>${proyectoSeleccionado.nombre}</strong>...
            <br><br>
            Vision está trabajando. Esto puede tardar.
        `;

        const resultado =
            await window.companion.analizarProyecto(carpetaSeleccionada);

        proyectoSeleccionado = resultado;

        mostrarProyecto(resultado);

        status.innerHTML = `
            <strong>✓ Análisis completado.</strong>
            <br><br>
            Fotografías analizadas:
            ${resultado.listaFotografias.length}
            <br>
            Expediente construido correctamente.
        `;

        analyzeButton.disabled = false;

    }

    catch (error) {

        console.error(error);

        analyzeButton.disabled = false;
        exportButton.disabled = true;

        status.innerHTML = `
            ❌ Error durante el análisis.
            <br>
            Revisa la consola para ver el detalle.
        `;

    }

});
