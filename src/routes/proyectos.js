module.exports = [
	{
		method: 'POST',
		path: '/proyecto',
		handler: require('../controllers/controlProyectos').crearProyecto,
		options: {
			description: 'crear proyecto en mongo',
		},
	},
	{
		method: 'GET',
		path: '/verificar/{proyectoId}',
		handler: require('../controllers/controlProyectos').existeProyecto,
		options: {
			description: 'verificar existencia proyecto',
		},
	},
	{
		method: 'GET',
		path: '/inactivar',
		handler: require('../controllers/controlProyectos').inactivarProyecto,
		options: {
			description: 'inactivar proyecto en mongo',
		},
	},
	{
		method: 'GET',
		path: '/listado',
		handler: require('../controllers/controlProyectos').listaProyectos,
		options: {
			description: 'lista proyectos en mongo',
		},
	},
	{
		method: 'GET',
		path: '/listado/{proyecto}',
		handler: require('../controllers/controlProyectos').getProyecto,
		options: {
			description: 'lista un proyecto en mongo',
		},
	},

	{
		method: 'GET',
		path: '/modificar',
		handler: require('../controllers/controlProyectos').modificarProyecto,
		options: {
			description: 'modificar proyecto en mongo',
		},
	},
	{
		method: 'POST',
		path: '/agregarfoto',
		handler: require('../controllers/controlProyectos').agregarFoto,
		options: {
			description: 'upload fotos',
		},
	},
	{
		method: 'POST',
		path: '/reporte',
		handler: require('../controllers/controlProyectos').creaReporte,
		options: {
			description: 'modifica campos foto',
		},
	},
];
