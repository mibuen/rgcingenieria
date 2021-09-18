const Boom = require('@hapi/boom');
const {
	DBproyectos,
	getCotizaciones,
	getOneCotizacion,
	insertCotizacion,
} = require('../services/DB');

exports.crearCotizacion = async (request, h) => {
	try {
		const cotizacionArray = await getCotizaciones(request);
		const data = request.payload;
		if (data.resuelta) new Date(`${data.resuelta}`);
		data.emision = new Date(data.emision);
		data.captura = new Date();
		data.cotizacionId = cotizacionArray.length + 1;
		console.log('TYPE', typeof data.cotizacionId);
		return insertCotizacion(request, data);
	} catch (error) {
		return Boom.badRequest('duplicate cotizaciones');
	}
};
//#########################################################
//+++++++++++++++++++Listar Cotizaciones++++++++++++++++++
exports.listarCotizaciones = async (request, h) => {
	try {
		return h.response(await getCotizaciones(request)).code(200);
	} catch (error) {
		return Boom.badRequest('no existen cotizaciones');
	}
};
//################Get Cotizacion with project ID #########################################
exports.getCotizacion = async (request, h) => {
	const { cotizacionId } = request.params;
	try {
		const cotizacion = await getOneCotizacion(request, {
			cotizacionId: parseInt(cotizacionId, 10),
		});
		if (!cotizacion) throw Boom.badData('no existe cotizacion');
		const proyectoId =
			(await DBproyectos(request).find({ cotizacionId }).count()) + 1;
		const headProyecto = { ...cotizacion, proyectoId };
		return headProyecto;
	} catch (error) {
		return error;
	}
};
