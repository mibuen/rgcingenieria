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
	const { proyectoId } = request.params;
	const response = await DB(request, 'proyectos')
		.find({ proyectoId: parseInt(proyectoId, 10) })
		.count();
	return response !== 1
		? h.response({ message: 'proyecto no existe' })
		: h.response({ message: 'proyecto valido' });
};
//++++++++Crear Proyecto++++++++++++++++
const crearProyecto = async (request, h) => {
	const { payload } = request;
	try {
		await DBindex(request, 'proyectos', { cotizacionId: 1, proyectoId: 1 });
		payload.cotizacionId = parseInt(payload.cotizacionId, 10);
		payload.proyectoId = parseInt(payload.proyectoId, 10);
		payload.createdDate = new Date();
		if (payload.inicio) new Date(`${payload.inicio}`);
		if (payload.terminado) new Date(`${payload.terminado}`);
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
	return proyects;
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

//+++++++++++Agregar Fotos++++++++++++++++++++++
const agregarFoto = async (request, h) => {
	const { cotizacionId, proyectoId, tipo, key } = request.payload;
	const query = {
		cotizacionId: parseInt(cotizacionId, 10),
		proyectoId: parseInt(proyectoId, 10),
	};
	try {
		if (tipo !== 'inicio') throw Boom.notAcceptable('tipo foto no es inicio');
		const proyecto = await DB(request, 'proyectos').findOne(query);
		const item = proyecto.vistas ? proyecto.vistas.length : 1;
		console.log(item);
		const toMongo = await DB(request, 'proyectos').updateOne(query, {
			$push: { vistas: { item, inicio: key, final: 'tbd.png' } },
		});
		return { modified: toMongo.modifiedCount };
	} catch (error) {
		return error;
	}
};
//return 'message quien sabe';
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
//++++++++++Inactivar
const inactivarProyecto = async (request, h) =>
	h.response('proyecto inactivado');
// ++++++++++++++++++++++++++++++Modificar Proyecto
const modificarProyecto = async (request, h) => {
	const { payload } = request;
	const { cotizacionId, proyectoId } = payload;
	delete payload.cotizacionId;
	delete payload.proyectoId;
	if (payload.inicio) new Date(`${payload.inicio}`);
	if (payload.terminado) new Date(`${payload.terminado}`);
	const modified = await updateDbResource(
		request,
		'proyectos',
		{
			cotizacionId: parseInt(cotizacionId, 10),
			proyectoId: parseInt(proyectoId, 10),
		},
		payload
	);
	return h.response(modified);
};

//++++++++++++++++++++++++++++++++++++++++++++

module.exports = {
	crearProyecto,
	inactivarProyecto,
	listaProyectos,
	modificarProyecto,
	agregarFoto,
	getProyecto,
	creaReporte,
	existeProyecto,
	proyectsInCotizacion,
};
