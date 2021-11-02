const Boom = require('@hapi/boom');

const {
	insertDbResource,
	DBindex,
	getAllDbResources,
	updateDbResource,
} = require('../services/DB');

//+++++++++++++Crear Cotizacion from Beginning+++++++++++++++++++++++++
exports.crearCotizacion = async (request, h) => {
	const data = request.payload;
	try {
		await DBindex(request, 'cotizaciones', { cotizacionId: 1 });
		const cotizacionArray = await getAllDbResources(request, 'cotizaciones', {
			$match: {},
		});
		data.cotizacionId = cotizacionArray.length + 1;
		data.resuelta = new Date(data.resuelta);
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
//#############+++ Modifica Cotizacion ++++################
exports.modificaCotizacion = async (request, h) => {
	const { payload } = request;
	const { cotizacionId } = request.params;
	try {
		const cotizacion = await updateDbResource(
			request,
			'cotizaciones',
			{ cotizacionId: parseInt(cotizacionId, 10) },
			payload
		);
		return h
			.response({ modifiedCount: cotizacion.modifiedCount, cotizacionId })
			.code(202);
	} catch (error) {
		return Boom.badRequest();
	}
};
//#############+++Get Cotizacion or Cotizaciones+++########
exports.getCotizacion = async (request, h) => {
	const reg = /^[\s\d]*$/;
	if (request.params.cotizacionId === undefined)
		throw Boom.badData('string not accepted');
	if (!request.params.cotizacionId.match(reg))
		throw Boom.badData('string not accepted');
	console.log('PARAMS', request.params);
	const cotizacionId = parseInt(request.params.cotizacionId, 10);
	const data = cotizacionId ? { cotizacionId: cotizacionId } : {};

	try {
		const cotizacion = await getAllDbResources(request, 'cotizaciones', [
			{
				$match: data,
			},
		]);
		if (cotizacion.length !== 0) {
			return h.response(cotizacion).code(200);
		} else {
			throw Boom.notFound(`cotizacion: ${cotizacionId}`);
		}
	} catch (error) {
		throw error;
	}
};
