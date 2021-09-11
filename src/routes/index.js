const leonada = require('./leonada');
const controlProyectos = require('./proyectos');
const cotizaciones = require('./cotizaciones');

const mainpage = {
	method: 'GET',
	path: '/',
	handler: async (request, h) => 'Hola Daniel',
	options: {
		description: 'entrada a API',
	},
};

module.exports = [mainpage, ...controlProyectos, ...leonada, ...cotizaciones];
