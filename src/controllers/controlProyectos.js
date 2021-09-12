const Boom = require('@hapi/boom');

const DB = (request, colName) => request.mongo.db.collection(colName);

const transform = (data) => {
	return data.map((item) => {
		return {
			cotizacionId: item.cotizacionId,
			proyectoId: item.proyectoId,
			cliente: item.proyectos_ready.cliente,
			descripcion: item.proyectos_ready.descripcion,
			sitio: item.sitio,
			direccion: item.direccion,
			supervisor: item.supervisor,
			status_proyecto: item.status_proyecto,
			fecha_inicio: item.fechaInicio,
			fecha_terminado: item.fechaTerminado,
			fotos: item.fotos.length,
		};
	});
};

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
	const { cotizacionId } = payload;
	console.log('PAYLOAD', payload);
	try {
		await DB(request, 'proyectos').createIndex(
			{ cotizacionId: 1, proyectoId: 1 },
			{ unique: true }
		);
		const checkQuotte = await DB(request, 'cotizaciones').findOne({
			cotizacionId: parseInt(cotizacionId, 10),
		});
		if (!checkQuotte) throw Error;
		const proyectoId =
			(await DB(request, 'proyectos').find({ cotizacionId }).count()) + 1;
		console.log('cotizacion', cotizacionId, 'proyectoId', proyectoId);
		payload.proyectoId = proyectoId;
		//payload.descripcion = checkQuotte.descripcion;
		//payload.cliente = checkQuotte.cliente;
		const proyecto = await DB(request, 'proyectos').insertOne(payload);
		console.log(checkQuotte, proyecto.ops[0]);
		const resultado = { ...checkQuotte, ...proyecto.ops[0] };
		return resultado;
	} catch (error) {
		return { message: 'error gachote' };
	}
};
//###################################################
//++++++++++Inactivar
const inactivarProyecto = async (request, h) =>
	h.response('proyecto inactivado');
//++++++++++++++++++++++++++++++
const listaProyectos = async (request, h) => {
	try {
		const data = await DB(request, 'proyectos')
			.aggregate([
				{
					$lookup: {
						from: 'cotizaciones',
						localField: 'cotizacionId',
						foreignField: 'cotizacionId',
						as: 'proyectos_ready',
					},
				},
				{ $unwind: '$proyectos_ready' },
				{ $sort: { cotizacionId: 1, proyectoId: 1 } },
			])
			.toArray();
		const proyectos = transform(data);
		return h.response(proyectos).code(200);
	} catch (error) {
		console.log(error);
	}
};
//+++++++++++++++++++++
const getProyecto = async (request, h) => {
	const { proyectoId } = request.params;
	try {
		const proyecto = await DB(request, 'proyectos').findOne({
			proyectoId: parseInt(proyectoId, 10),
		});
		return proyecto
			? h.response(proyecto).code(200)
			: h.response({ message: 'proyecto no existe' });
	} catch (error) {
		console.log(error);
	}
};
// ++++++++++++++++++++++++++++++
const modificarProyecto = async (request, h) =>
	h.response('modificar proyectos, ');
//++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++agregar foto+++++++++++++++++++++++
const agregarFoto = async (request, h) => {
	const { cotizacionId, proyectoId, key, status, item } = request.payload;
	console.log(cotizacionId, proyectoId, key);
	const imgObj = {
		key,
		status,
		item,
	};
	try {
		const toMongo = await DB(request, 'proyectos').updateOne(
			{
				cotizacionId: parseInt(cotizacionId, 10),
				proyectoId: parseInt(proyectoId, 10),
			},
			{ $push: { fotos: { $each: [imgObj], $sort: { item: 1, status: 1 } } } }
		);
		return { modified: toMongo.modifiedCount };
	} catch (error) {
		throw Boom.serverUnavailable('mongo not available');
	}
};
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
	agregarFoto,
	getProyecto,
	creaReporte,
	existeProyecto,
};
