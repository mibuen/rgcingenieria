const {
	crearProyecto,
	inactivarProyecto,
	listaProyectos,
	modificarProyecto,
	agregarFoto,
	getProyecto,
	creaReporte,
	existeProyecto,
} = require('../controllers/controlProyectos');

module.exports = [
	{
		method: 'POST',
		path: '/proyecto',
		handler: crearProyecto,
		options: {
			description: 'crear proyecto en mongo',
		},
	},
	{
		method: 'GET',
		path: '/verificar/{proyectoId}',
		handler: existeProyecto,
	},
	{
		method: 'GET',
		path: '/inactivar',
		handler: inactivarProyecto,
		options: {
			description: 'inactivar proyecto en mongo',
		},
	},
	{
		method: 'GET',
		path: '/listado',
		handler: listaProyectos,
		options: {
			description: 'lista proyectos en mongo',
		},
	},
	{
		method: 'GET',
		path: '/listado/{proyectoId}',
		handler: getProyecto,
		options: {
			description: 'lista un proyecto en mongo',
		},
	},

	{
		method: 'GET',
		path: '/modificar',
		handler: modificarProyecto,
		options: {
			description: 'modificar proyecto en mongo',
		},
	},
	{
		method: 'POST',
		path: '/agregarfoto',
		handler: agregarFoto,
		options: {
			description: 'upload fotos',
		},
	},
	{
		method: 'POST',
		path: '/reporte',
		handler: creaReporte,
		options: {
			description: 'modifica campos foto',
		},
	},
];
