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

        const galeriaWix = this.parsearCampoWix(
            campoGaleria,
            "Galería General"
        );

        const heroWix = this.parsearCampoWix(
            campoHero,
            "Hero Imagen"
        );

        //--------------------------------------------------
        // Galería: conservar exactamente el orden del CSV.
        //--------------------------------------------------

        galeriaWix.forEach(itemWix => {

            const foto = this.buscarFotografiaPorNombre(
                itemWix.fileName
            );

            if (!foto) {
                return;
            }

            // Conservamos el objeto físico Wix recibido del CSV.
            foto.wixMedia = itemWix;

            this.proyecto.agregarGaleria(foto);

        });

        //--------------------------------------------------
        // Hero: selección independiente de la Galería.
        //--------------------------------------------------

        if (heroWix.length > 0) {

            const itemHero = heroWix[0];

            const fotoHero = this.buscarFotografiaPorNombre(
                itemHero.fileName
            );

            if (fotoHero) {

                // Conservamos también la identidad física Wix del Hero.
                fotoHero.wixMedia = itemHero;

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