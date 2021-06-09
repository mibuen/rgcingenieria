const {
  crearProyecto, inactivarProyecto, listaProyectos, modificarProyecto, agregarFoto, getProyecto, creaReporte,
} = require('../controllers/controlProyectos');

const routeCrearProyecto = {
  method: 'POST',
  path: '/proyecto',
  handler: crearProyecto,
  options: {
    description: 'crear proyecto en mongo',
  },
};
const routeInactivarProyecto = {
  method: 'GET',
  path: '/inactivar',
  handler: inactivarProyecto,
  options: {
    description: 'inactivar proyecto en mongo',
  },
};
const routeListaProyectos = {
  method: 'GET',
  path: '/listado',
  handler: listaProyectos,
  options: {
    description: 'lista proyectos en mongo',
  },
};
const routeGetProyecto = {
  method: 'GET',
  path: '/listado/{proyectoId}',
  handler: getProyecto,
  options: {
    description: 'lista proyectos en mongo',
  },
};

const routeModificarProyecto = {
  method: 'GET',
  path: '/modificar',
  handler: modificarProyecto,
  options: {
    description: 'modificar proyecto en mongo',
  },
};
const routeAgregarFoto = {
  method: 'POST',
  path: '/agregarfoto',
  handler: agregarFoto,
  options: {
    payload: {
      output: 'stream',
      parse: true,
      multipart: true,
      maxBytes: 209715200,
    },
    description: 'upload fotos',
  },

};
const routeReporte = {
  method: 'POST',
  path: '/reporte',
  handler: creaReporte,
  options: {
    description: 'modifica campos foto',
  },
};

module.exports = [
  routeCrearProyecto,
  routeInactivarProyecto,
  routeListaProyectos,
  routeModificarProyecto,
  routeAgregarFoto,
  routeGetProyecto,
  routeReporte,
];
