console.log("proyectoManager.js cargado");

const Proyecto = require("./proyecto");
const FotografiaManager = require("./fotografiaManager");

class ProyectoManager {

    constructor() {

        this.proyecto = null;

        this.fotografiaManager = new FotografiaManager();

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

        return this.proyecto;

    }

}

module.exports = ProyectoManager;