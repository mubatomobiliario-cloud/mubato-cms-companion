console.log("modelo.js cargado");

function crearProyecto(fila) {

    return {

        proyecto: fila["Proyecto"],

        historia: fila["Historias de Transformación"],

        descripcion: fila["Descripción"],

        galeria: fila["Galería General"],

        heroImagen: fila["Hero Imágen"],

        heroTexto: fila["Hero Texto"],

        id: fila["ID"],

        created: fila["Created Date"],

        updated: fila["Updated Date"],

        owner: fila["Owner"],

        codigo: fila["Código MUBATO"],

        ciudad: fila["Ciudad"],

        categoria: JSON.parse(fila["Categoría"]),

        espacios: JSON.parse(fila["Espacios"]),

        estado: JSON.parse(fila["Estado"]),

        servicios: fila["Servicios"]
            ? fila["Servicios"].split("|")
            : [],

        anio: fila["Año"],

        destacado: fila["Destacado"] === "true",

        ordenHome: fila["Orden Home"],

        seoTitle: fila["SEO Title"],

        metaDescription: fila["Meta Description"],

        slug: fila["Slug"],

        cliente: fila["Cliente"],

        observaciones: fila["Observaciones"]

    };

}