exports.cotizacionDB = (request) => {
	return request.mongo.db.collection('cotizaciones');
};
const DBcotizacion = (request) => request.mongo.db.collection('cotizaciones');

exports.getCotizaciones = (request) => DBcotizacion(request).find().toArray();

exports.getOneCotizacion = (request, data) =>
	DBcotizacion(request).findOne(data);

exports.insertCotizacion = async (request, data) => {
	await DBcotizacion(request).createIndex(
		{ cotizacionId: 1 },
		{ unique: true }
	);
	const saved = await DBcotizacion(request).insertOne(data);
	console.log(saved);
	return saved.ops[0];
};

//+++++++++++Proyectos
exports.DBproyectos = (request) => {
	return request.mongo.db.collection('proyectos');
};

// return h.response(cotizaciones.ops[0]).code(201);
