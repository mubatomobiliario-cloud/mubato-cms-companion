const selectProjectButton = document.getElementById("selectProjectButton");
const analyzeButton = document.getElementById("analyzeButton");
const exportButton = document.getElementById("exportButton");

const status = document.getElementById("status");
const projectPanel = document.getElementById("projectPanel");
const photoPanel = document.getElementById("photoPanel");

let proyectoSeleccionado = null;


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
//
// ESTE BOTÓN TODAVÍA NO EJECUTA IA.
// Será conectado en el siguiente micro-hito.
//

analyzeButton.addEventListener("click", () => {


    if (!proyectoSeleccionado) {

        status.innerHTML =
            "⚠️ Primero debes seleccionar un proyecto.";

        return;

    }

    status.innerHTML = `

        <strong>Proyecto seleccionado:</strong>

        ${proyectoSeleccionado.nombre}

        <br>

        <strong>Fotografías:</strong>

        ${proyectoSeleccionado.listaFotografias.length}

        <br><br>

        El análisis con IA será conectado en el siguiente paso.

    `;

});
