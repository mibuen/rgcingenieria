module.exports = [
	{
		method: 'POST',
		path: '/cotizacion',
		handler: require('../controllers/controlCotizaciones').crearCotizacion,
		options: {
			description: 'crear cotizacion en mongo',
		},
	},

	{
		method: 'GET',
		path: '/cotizaciones',
		handler: require('../controllers/controlCotizaciones').listarCotizaciones,
		options: {
			description: 'lista de cotizaciones',
		},
	},
	{
		method: 'GET',
		path: '/cotizacion/{cotizacionId}',
		handler: require('../controllers/controlCotizaciones').getCotizacion,
		options: {
			description: 'get Cotizacion',
		},
	},
];
