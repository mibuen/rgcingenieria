const { v4 } = require('uuid');
const Boom = require('@hapi/boom');
const { getDbResource, updateDbResource } = require('../services/DB');

const { uploadS3v4 } = require('../services/uploadV4');
const { existeProyecto } = require('./controlProyectos');

const fileExtensions = ['jpeg', 'jpg', 'png'];

exports.getS3postController = async (request, h) => {
	const { cotizacionId, proyectoId, key } = request.payload;
	const [base, ext] = key.split('.');
	if (!fileExtensions.includes(ext.toLowerCase()))
		throw Boom.unsupportedMediaType('file erroneo');
	//check for proyect in mongo
	const checkProyecto = await existeProyecto(request);
	if (checkProyecto.message === 'proyecto no existe')
		throw Boom.notFound('proyecto no valido');
	const fileName = `${cotizacionId}-${proyectoId}/${v4()}.${ext}`;

	return await uploadS3v4(fileName);
};
//+++++++++++Agregar Fotos++++++++++++++++++++++
exports.agregarFoto = async (request, h) => {
	const tipos = ['inicio', 'final'];
	const { cotizacionId, proyectoId, tipo, seq, key } = request.payload;
	console.log(cotizacionId, proyectoId, tipo, key);
	const query = {
		cotizacionId: parseInt(cotizacionId, 10),
		proyectoId: parseInt(proyectoId, 10),
	};
	console.log('QUERY', query);
	try {
		if (!tipos.includes(tipo))
			throw Boom.notAcceptable('tipo foto no es inicio o final');

		const proyecto = await getDbResource(request, 'proyectos', query);
		//console.log('PROYECTO', proyecto);
		if (!proyecto) throw Boom.notFound('proyecto no existe');

		const item = proyecto.vistas ? proyecto.vistas.length + 1 : 1;
		const updateInicio = {
			$push: { vistas: { item, inicio: key, final: 'tbd.png' } },
		};
		query['vistas.item'] = seq;
		const updateFinal = {
			$set: { 'vistas.$.final': key },
		};
		const toMongo = await updateDbResource(
			request,
			'proyectos',
			query,
			tipo === 'inicio' ? updateInicio : updateFinal
		);
		const message =
			toMongo.modifiedCount === 1
				? { modified: toMongo.modifiedCount, message: 'almacenaje exitoso' }
				: Boom.expectationFailed('fallo actualizacion a DB');
		return h.response(message).code(202);
	} catch (error) {
		console.log('ERROR GACHO', error);
		throw error;
	}
};
