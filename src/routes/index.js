const fotos = require('./fotos');
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

module.exports = [mainpage, ...controlProyectos, ...fotos, ...cotizaciones];
