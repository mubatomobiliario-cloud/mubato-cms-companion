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

        const proyecto = await window.companion.importarProyecto(carpeta);

        proyectoSeleccionado = proyecto;

        console.log("IMPORTACIÓN COMPLETADA — RENDERER");
        console.log("Proyecto:", proyecto.nombre);
        console.log("Hero:", proyecto.heroImagen);
        console.log("Galería:", proyecto.galeria);
        console.log("Fotografías:", proyecto.listaFotografias);

        mostrarProyecto(proyecto);

        analyzeButton.disabled = false;
        exportButton.disabled = true;

        status.innerHTML = "✓ Proyecto listo para ejecutar el flujo editorial completo.";

    } catch (error) {

        console.error(error);

        proyectoSeleccionado = null;
        carpetaSeleccionada = null;

        analyzeButton.disabled = true;
        exportButton.disabled = true;

        status.innerHTML = "❌ Error importando el proyecto.";

    }

});

//==================================================
// MOSTRAR PROYECTO
//==================================================

function mostrarProyecto(proyecto) {

    projectPanel.innerHTML = `
        <h2>📁 ${proyecto.nombre}</h2>

        <p><strong>Código:</strong> ${proyecto.codigo || "Pendiente de generar"}</p>
        <p><strong>Cliente:</strong> ${proyecto.cliente || "Sin información"}</p>
        <p><strong>Ciudad:</strong> ${proyecto.ciudad || "Sin información"}</p>
        <p><strong>Estado:</strong> ${proyecto.estado || "Sin información"}</p>
        <p><strong>Fotografías:</strong> ${proyecto.listaFotografias.length}</p>
        <p><strong>Hero:</strong> ${proyecto.heroImagen?.nombre || "No definido"}</p>
        <p>
            <strong>Galería:</strong>
            ${proyecto.galeria?.length || 0}
            ${proyecto.galeria?.length
                ? ` — ${proyecto.galeria.map(foto => foto.nombre).join(", ")}`
                : ""
            }
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

        const rutaImagen = "file://" + foto.ruta.replace(/\\/g, "/");

        html += `
            <div class="photoCard">
                <img src="${rutaImagen}" alt="${foto.nombre}">
                <div class="photoName">${foto.nombre}</div>

                ${foto.analizada ? `
                    <div class="photoAnalysis">
                        ${foto.espacio || ""}
                        ${foto.plano ? ` · ${foto.plano}` : ""}
                    </div>
                ` : ""}
            </div>
        `;

    });

    html += `</div>`;
    photoPanel.innerHTML = html;

}

//==================================================
// EJECUTAR COMPANION — PIPELINE COMPLETO
//==================================================

analyzeButton.addEventListener("click", async () => {

    if (!proyectoSeleccionado || !carpetaSeleccionada) {
        status.innerHTML = "⚠️ Primero debes seleccionar un proyecto.";
        return;
    }

    try {

        analyzeButton.disabled = true;
        selectProjectButton.disabled = true;
        exportButton.disabled = true;

        status.innerHTML = `
            Ejecutando <strong>MUBATO CMS Companion</strong> para
            <strong>${proyectoSeleccionado.nombre}</strong>...
            <br><br>
            1. Vision analizará las fotografías.<br>
            2. Se construirá la evidencia visual.<br>
            3. Editorial Proyecto V2.2 generará el contenido.<br>
            4. Se generará la Salida Editorial CSV.
            <br><br>
            <strong>No cierres la aplicación durante el proceso.</strong>
        `;

        const resultado =
            await window.companion.ejecutarProyecto(carpetaSeleccionada);

        proyectoSeleccionado = resultado;

        mostrarResultadoEditorial(resultado);

        status.innerHTML = `
            <strong>✓ COMPANION COMPLETADO.</strong>
            <br><br>
            Proyecto: <strong>${resultado.nombre}</strong><br>
            Fotografías analizadas: <strong>${resultado.listaFotografias.length}</strong><br>
            Llamadas IA: <strong>${resultado.editorial?.llamadasIA || 0}</strong><br>
            Salida Editorial CSV: <strong>generada correctamente</strong>
        `;

        exportButton.disabled = !resultado.salidaEditorialCSV?.rutaSalida;
        analyzeButton.disabled = false;
        selectProjectButton.disabled = false;

    } catch (error) {

        console.error(error);

        analyzeButton.disabled = false;
        selectProjectButton.disabled = false;
        exportButton.disabled = true;

        status.innerHTML = `
            ❌ <strong>El flujo editorial no pudo completarse.</strong>
            <br><br>
            ${error.message || "Revisa la consola para ver el detalle."}
        `;

    }

});

//==================================================
// MOSTRAR RESULTADO EDITORIAL
//==================================================

function mostrarResultadoEditorial(resultado) {

    const editorial = resultado.editorial;

    if (!editorial) {
        throw new Error("Electron recibió el proyecto pero no recibió resultado editorial.");
    }

    projectPanel.innerHTML = `
        <h2>✓ ${resultado.nombre}</h2>

        <p><strong>Código MUBATO:</strong> ${editorial.codigo || resultado.codigo || ""}</p>
        <p><strong>Cliente:</strong> ${resultado.cliente || "Sin información"}</p>
        <p><strong>Ciudad:</strong> ${resultado.ciudad || "Sin información"}</p>
        <p><strong>Slug:</strong> ${editorial.slug}</p>

        <hr>

        <h3>Hero</h3>
        <p>${editorial.heroTexto}</p>

        <h3>Historia Editorial</h3>
        <p>${editorial.historia}</p>

        <h3>Descripción CMS</h3>
        <p>${editorial.descripcion}</p>

        <h3>SEO</h3>
        <p><strong>SEO Title:</strong> ${editorial.seo?.seoTitle || ""}</p>
        <p><strong>Meta Description:</strong> ${editorial.seo?.metaDescription || ""}</p>

        <h3>Salida Editorial CSV</h3>
        <p>${resultado.salidaEditorialCSV?.rutaSalida || "No generada"}</p>
    `;

    let html = `
        <h2>Galería Editorial</h2>
        <p><strong>${editorial.galeriaEditorial.length}</strong> fotografías editoriales.</p>
    `;

    editorial.galeriaEditorial.forEach((foto, indice) => {

        html += `
            <div class="photoCard">
                <div class="photoName">
                    ${indice + 1}. ${foto.fileName}
                </div>
                <div class="photoAnalysis">
                    <strong>Title:</strong> ${foto.title}<br>
                    <strong>Description:</strong> ${foto.description}<br>
                    <strong>ALT:</strong> ${foto.alt}<br>
                    <strong>nombreSEO:</strong> ${foto.nombreSEO}<br>
                    <strong>Keywords:</strong> ${(foto.keywords || []).join(", ")}
                </div>
            </div>
        `;

    });

    photoPanel.innerHTML = html;

}

//==================================================
// MOSTRAR CSV EN FINDER
//==================================================

exportButton.addEventListener("click", async () => {

    const rutaSalida = proyectoSeleccionado?.salidaEditorialCSV?.rutaSalida;

    if (!rutaSalida) {
        status.innerHTML = "⚠️ No existe una salida editorial para mostrar.";
        return;
    }

    try {

        await window.companion.mostrarSalidaEditorial(rutaSalida);

        status.innerHTML = `
            ✓ Salida Editorial localizada en Finder.<br><br>
            <strong>${rutaSalida}</strong>
        `;

    } catch (error) {

        console.error(error);

        status.innerHTML = `
            ❌ No fue posible mostrar la salida editorial.<br>
            ${error.message || "Revisa la consola."}
        `;

    }

});
