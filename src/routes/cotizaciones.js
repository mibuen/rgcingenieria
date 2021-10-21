module.exports = [
	{
		method: 'POST',
		path: '/cotizacion-nueva',
		handler: require('../controllers/controlCotizaciones').crearCotizacion,
		options: {
			description: 'nueva cotizacion en mongo',
		},
	},

	{
		method: 'GET',
		path: '/cotizaciones/{cotizacionId?}',
		handler: require('../controllers/controlCotizaciones').getCotizacion,
		options: {
			description: 'get Cotizaciones o Cotizacion',
		},
	},
	{
		method: 'PUT',
		path: '/modifica-cotizacion/{cotizacionId}',
		handler: require('../controllers/controlCotizaciones').modificaCotizacion,
		options: {
			description: 'modifica cotizacion',
		},
	},
];
