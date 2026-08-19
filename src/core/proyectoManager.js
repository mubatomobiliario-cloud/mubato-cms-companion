console.log("proyectoManager.js cargado");

const Proyecto = require("./proyecto");
const FotografiaManager = require("./fotografiaManager");

class ProyectoManager {

    constructor() {

        this.proyecto = null;

        this.fotografiaManager = new FotografiaManager();

    }

    //--------------------------------------------------
    // Utilidades Wix
    //--------------------------------------------------

    parsearCampoWix(campo, nombreCampo) {

        if (!campo || campo.trim() === "") {
            return [];
        }

        try {

            const valor = JSON.parse(campo);

            if (Array.isArray(valor)) {
                return valor;
            }

            return [valor];

        } catch (error) {

            throw new Error(
                `No se pudo interpretar el campo Wix "${nombreCampo}" como JSON.`
            );

        }

    }

    extraerNombreDesdeWixImage(src) {

        if (!src) {
            return "";
        }

        const sinFragmento = src.split("#")[0];
        const partes = sinFragmento.split("/");
        const nombre = partes[partes.length - 1] || "";

        try {
            return decodeURIComponent(nombre);
        } catch (error) {
            return nombre;
        }

    }

    buscarFotografiaPorNombre(nombreArchivo) {

        if (!nombreArchivo) {
            return null;
        }

        return this.proyecto.fotografias.find(
            foto => foto.nombre === nombreArchivo
        ) || null;

    }

    //--------------------------------------------------
    // Importar selección editorial ya definida en Wix
    //--------------------------------------------------

    importarHeroYGaleria(filaCSV) {

        const campoGaleria = filaCSV["Galería General"] || "";

        const campoHero =
            filaCSV["Hero Imagen"] ||
            filaCSV["Hero Imágen"] ||
            "";

        //--------------------------------------------------
        // GALERÍA GENERAL
        // Contrato físico comprobado: JSON serializado
        // de un array de objetos Wix.
        //--------------------------------------------------

        const galeriaWix = this.parsearCampoWix(
            campoGaleria,
            "Galería General"
        );

        galeriaWix.forEach(itemWix => {

            const foto = this.buscarFotografiaPorNombre(
                itemWix.fileName
            );

            if (!foto) {
                return;
            }

            // Conservamos intacto el objeto físico Wix.
            foto.wixMedia = itemWix;

            this.proyecto.agregarGaleria(foto);

        });

        //--------------------------------------------------
        // HERO IMAGEN
        // Contrato físico comprobado: string Wix image URI.
        // Ejemplo:
        // wix:image://v1/.../TEST_0007.jpeg#originWidth=...
        // NO es JSON.
        //--------------------------------------------------

        if (campoHero.trim() !== "") {

            const nombreHero =
                this.extraerNombreDesdeWixImage(campoHero);

            const fotoHero = this.buscarFotografiaPorNombre(
                nombreHero
            );

            if (fotoHero) {

                // Conservamos exactamente la referencia física que
                // Wix exportó para el Hero.
                fotoHero.wixHeroSrc = campoHero;

                this.proyecto.definirHero(fotoHero);

            }

        }

    }

    importarProyecto(

        filaCSV,

        carpetaProyecto,

        rutaCSV

    ) {

        this.proyecto = new Proyecto();

        //--------------------------------------------------
        // Ubicación
        //--------------------------------------------------

        this.proyecto.rutaProyecto = carpetaProyecto;

        this.proyecto.rutaCSV = rutaCSV;

        //--------------------------------------------------
        // Datos básicos
        //--------------------------------------------------

        this.proyecto.codigo = filaCSV["Código MUBATO"];

        this.proyecto.nombre = filaCSV["Proyecto"];

        this.proyecto.slug = filaCSV["Slug"];

        this.proyecto.cliente = filaCSV["Cliente"];

        this.proyecto.ciudad = filaCSV["Ciudad"];

        this.proyecto.estado = filaCSV["Estado"];

        this.proyecto.categoria = filaCSV["Categoría"];

        this.proyecto.servicios = filaCSV["Servicios"];

        this.proyecto.espacios = filaCSV["Espacios"];

        //--------------------------------------------------
        // Fotografías
        //--------------------------------------------------

        this.fotografiaManager.cargarCarpeta(

            carpetaProyecto

        );

        this.fotografiaManager.obtenerTodas().forEach(

            foto => {

                this.proyecto.agregarFotografia(foto);

            }

        );

        //--------------------------------------------------
        // Hero + Galería seleccionados por MUBATO en Wix
        //--------------------------------------------------

        this.importarHeroYGaleria(filaCSV);

        return this.proyecto;

    }

}

module.exports = ProyectoManager;