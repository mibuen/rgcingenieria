const Boom = require('@hapi/boom');
const {
	getDbResource,
	insertDbResource,
	DbIndex,
	getAllDbResources,
} = require('../services/DB');

exports.crearCotizacion = async (request, h) => {
	const data = request.payload;
	try {
		await DBindex(request, 'cotizaciones', { cotizacionId: 1 });
		const cotizacionArray = await getAllDbResources(request, 'cotizaciones', {
			$match: {},
		});
		data.cotizacionId = cotizacionArray.length + 1;
		if (data.resuelta) new Date(`${data.resuelta}`);
		data.emision = new Date(data.emision);
		data.captura = new Date();
		const savedCotizacion = await insertDbResource(
			request,
			'cotizaciones',
			data
		);
		return h
			.response({ cotizacionId: savedCotizacion.ops[0].cotizacionId })
			.code(201);
	} catch (error) {
		console.log(error);
		return Boom.badRequest('cotizacion was not saved');
	}
};
//#########################################################
//+++++++++++++++++++Listar Cotizaciones++++++++++++++++++
exports.listarCotizaciones = async (request, h) => {
	try {
		const cotizaciones = await getAllDbResources(request, 'cotizaciones', {
			$match: {},
		});
		//console.log(cotizaciones);
		return h.response(cotizaciones).code(200);
	} catch (error) {
		return Boom.badRequest('no existen cotizaciones');
	}
};
//################Get Cotizacion with project ID
exports.getCotizacion = async (request, h) => {
	const { cotizacionId } = request.params;
	try {
		const cotizacion = await getDbResource(request, 'cotizaciones', {
			cotizacionId: parseInt(cotizacionId, 10),
		});
		if (!cotizacion) throw Boom.badData('no existe cotizacion');
		return h.response(cotizacion).code(200);
	} catch (error) {
		return error;
	}
};
