console.log("CONFIG CARGADO");
//alert("CONFIG CARGADO");

window.CAMPOS = {
    PROYECTO: 0,
    HISTORIA: 1,
    DESCRIPCION: 2,
    GALERIA: 3,
    HERO_IMAGEN: 4,
    HERO_TEXTO: 5,
    ID: 6,
    CREATED: 7,
    UPDATED: 8,
    OWNER: 9,
    SLUG: 10,
    CODIGO: 11,
    CIUDAD: 12,
    CATEGORIA: 13,
    ESPACIOS: 14,
    ESTADO: 15,
    SERVICIOS: 16,
    ANIO: 17,
    DESTACADO: 18,
    ORDEN_HOME: 19,
    SEO_TITLE: 20,
    META_DESCRIPTION: 21,
    SLUG_SEO: 22,
    CLIENTE: 23,
    OBSERVACIONES: 24
};

IA: {

    proveedor: "openai",

    modelo: "gpt-5.5"

}

model: config.IA.modelo