console.log("catalogoMubato.js cargado");

/**
 * CATÁLOGO CONFIGURABLE MUBATO
 *
 * Servicios reconocidos actualmente por MUBATO.
 *
 * Este catálogo pertenece a la configuración del dominio.
 * NO es una fuente de inferencia de IA.
 *
 * Para incorporar un nuevo servicio en el futuro,
 * se agrega aquí al catálogo.
 */

const SERVICIOS_MUBATO = [
    "Diseño Interior",
    "Mobiliario a Medida",
    "Remodelación",
    "Carpintería",
    "Decoración",
    "Iluminación",
    "Obra Civil"
];

function obtenerServicios() {
    return [...SERVICIOS_MUBATO];
}

module.exports = {
    SERVICIOS_MUBATO,
    obtenerServicios
};
