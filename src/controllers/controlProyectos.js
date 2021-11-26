const Boom = require('@hapi/boom');

const DB = (request, colName) => request.mongo.db.collection(colName);
const {
	getDbResource,
	insertDbResource,
	getAllDbResources,
	DBindex,
	updateDbResource,
} = require('../services/DB');
const { transform } = require('../services/helpers');

const existeProyecto = async (request, h) => {
	const { cotizacionId, proyectoId } = request.payload;
	console.log(cotizacionId, proyectoId);
	const result = await DB(request, 'proyectos')
		.find({
			cotizacionId: parseInt(cotizacionId, 10),
			proyectoId: parseInt(proyectoId, 10),
		})
		.count();
	console.log(result);
	return result !== 1
		? { message: 'proyecto no existe' }
		: { message: 'proyecto valido' };
};
//++++++++Crear Proyecto++++++++++++++++
const crearProyecto = async (request, h) => {
	const { payload } = request;
	try {
		await DBindex(request, 'proyectos', { cotizacionId: 1, proyectoId: 1 });
		payload.cotizacionId = parseInt(payload.cotizacionId, 10);
		payload.proyectoId = parseInt(payload.proyectoId, 10);
		payload.createdDate = new Date();
		//check cotizacion ganada
		const ganada = await getDbResource(request, 'cotizaciones', {
			cotizacionId: payload.cotizacionId,
			status: 'ganada',
		});
		if (!ganada) throw Boom.notAcceptable('cotizacion no ganada');
		const saved = await insertDbResource(request, 'proyectos', payload);
		return h
			.response({
				proyecto: `${saved.ops[0].cotizacionId}-${saved.ops[0].proyectoId}`,
			})
			.code(201);
	} catch (error) {
		console.log(error);
		return error.code === 11000
			? Boom.conflict('E:1100 proyecto ya existe en db')
			: error;
	}
};
// ++++++++++++++++++++++####Modificar Proyecto####+++++++++
const modificarProyecto = async (request, h) => {
	const { payload } = request;
	const { cotizacionId, proyectoId } = payload;
	delete payload.cotizacionId;
	delete payload.proyectoId;
	payload.inicio = Date(payload.inicio);
	payload.terminado = Date(payload.terminado);
	const modified = await updateDbResource(
		request,
		'proyectos',
		{
			cotizacionId: parseInt(cotizacionId, 10),
			proyectoId: parseInt(proyectoId, 10),
		},
		[{ $set: payload }]
	);
	console.log(modified);
	return modified.modifiedCount > 0
		? h
				.response({
					cotizacion: cotizacionId,
					proyecto: proyectoId,
					message: 'modificado',
				})
				.code(202)
		: Boom.badRequest('modificacion invalida');
};

//++++++++++++++++++++++++++++++Lista Proyectos+++++++++++++
const listaProyectos = async (request, h) => {
	try {
		const data = await getAllDbResources(
			request,
			'proyectos',
			{
				$lookup: {
					from: 'cotizaciones',
					localField: 'cotizacionId',
					foreignField: 'cotizacionId',
					as: 'proyectos_ready',
				},
			},
			{ $unwind: '$proyectos_ready' },
			{ $sort: { cotizacionId: 1, proyectoId: 1 } }
		);
		const proyectos = transform(data);
		return h.response(proyectos).code(200);
	} catch (error) {
		console.log(error);
	}
};
//+++++++++Proyects in cotizacion+++++++++++++++
const proyectsInCotizacion = async (request, h) => {
	console.log(request.params);
	const { cotizacionId } = request.params;
	console.log('COT', cotizacionId);
	const pipe = [
		{ $match: { cotizacionId: parseInt(cotizacionId, 10) } },
		{
			$lookup: {
				from: 'cotizaciones',
				localField: 'cotizacionId',
				foreignField: 'cotizacionId',
				as: 'proyectos_ready',
			},
		},
		{ $unwind: '$proyectos_ready' },
		{ $sort: { proyectoId: 1 } },
	];
	const proyects = await getAllDbResources(request, 'proyectos', pipe);
	return proyects.length > 0
		? proyects
		: Boom.notFound('cotizacion sin proyectos');
};
//+++++++++++++++++++++Get proyecto by ID cotID-prjId
const getProyecto = async (request, h) => {
	const { proyecto } = request.params;
	const [cotizacionId, proyectoId] = proyecto.split('-');
	try {
		const proyecto = await getDbResource(request, 'proyectos', {
			cotizacionId: parseInt(cotizacionId, 10),
			proyectoId: parseInt(proyectoId, 10),
		});
		return proyecto
			? h.response(proyecto).code(200)
			: Boom.badData('proyecto no existe');
	} catch (error) {
		console.log(error);
		return error;
	}
};

//++++++++++Inactivar
const inactivarProyecto = async (request, h) =>
	h.response('proyecto inactivado');

//++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const creaReporte = async (request, h) => {
	const { proyectoId, key, item, status, comentarios } = request.payload;
	const query = { proyectoId: parseInt(proyectoId, 10), 'fotos.key': key };
	const data = {
		'fotos.$.item': item,
		'fotos.$.comentarios': comentarios,
		'fotos.$.status': status,
	};
	try {
		await DB(request, 'proyectos').updateOne(query, { $set: data });
		const sortedReport = await DB(request, 'proyectos').updateOne(query, {
			$push: { fotos: { $each: [], $sort: { item: 1, status: -1 } } },
		});
		return h.response(sortedReport).code(201);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
module.exports = {
	crearProyecto,
	inactivarProyecto,
	listaProyectos,
	modificarProyecto,
	getProyecto,
	creaReporte,
	existeProyecto,
	proyectsInCotizacion,
};
