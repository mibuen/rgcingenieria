const DB = (request, colName) => request.mongo.db.collection(colName);
const Boom = require('@hapi/boom');

const crearCotizacion = async (request, h) => {
	try {
		const totalCotizaciones = await DB(request, 'cotizaciones')
			.find({})
			.count();
		const cotizacionId = totalCotizaciones + 1;
		const data = request.payload;
		data.cotizacionId = cotizacionId;
		console.log(data);
		await request.mongo.db
			.collection('cotizaciones')
			.createIndex({ cotizacionId: 1 }, { unique: true });
		const cotizaciones = await DB(request, 'cotizaciones').insertOne(data);
		return h.response(cotizaciones.ops[0]).code(201);
	} catch (error) {
		throw Boom.badRequest('duplicate cotizaciones');
	}
};
//#########################################################
//+++++++++++++++++++Listar Cotizaciones++++++++++++++++++
const listarCotizaciones = async (request, h) => {
	try {
		const listado = await DB(request, 'cotizaciones').find({}).toArray();
		return h.response(listado).code(200);
	} catch (error) {
		Boom.badRequest('no existen cotizaciones');
	}
};
//#########################################################
const getCotizacion = async (request, h) => {
	const { cotizacionId } = request.params;
	console.log(typeof cotizacionId);
	try {
		const cotizacion = await DB(request, 'cotizaciones').findOne({
			cotizacionId: parseInt(cotizacionId, 10),
		});
		return cotizacion
			? cotizacion
			: { message: ` cotizacion Id :${cotizacionId} do not exist` };
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	crearCotizacion,
	listarCotizaciones,
	getCotizacion,
};
