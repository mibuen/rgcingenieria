const {
	crearCotizacion,
	listarCotizaciones,
	getCotizacion,
} = require('../controllers/controlCotizaciones');

module.exports = [
	{
		method: 'POST',
		path: '/cotizacion',
		handler: crearCotizacion,
		options: {
			description: 'crear cotizacion en mongo',
		},
	},

	{
		method: 'GET',
		path: '/cotizaciones',
		handler: listarCotizaciones,
		options: {
			description: 'lista de cotizaciones',
		},
	},
	{
		method: 'GET',
		path: '/cotizaciones/{cotizacionId}',
		handler: getCotizacion,
		options: {
			description: 'get Cotizacion',
		},
	},
];
