//++++++++DB Index
exports.DBindex = (request, col, data) =>
	DB(request, col).createIndex(data, { unique: true });

//+++++++++++Proyectos
exports.DBproyectos = (request) => {
	return request.mongo.db.collection('proyectos');
};
//+++++++++++++++++Generico+++++++++++++++++++++

const DB = (request, col) => request.mongo.db.collection(col);

exports.getDbResource = (request, col, data) => DB(request, col).findOne(data);

exports.getAllDbResources = (request, col, pipeline) =>
	DB(request, col).aggregate([pipeline]).toArray();

exports.insertDbResource = (request, col, data) =>
	DB(request, col).insertOne(data);

// exports.cotizacionDB = (request) => {
// 	return request.mongo.db.collection('cotizaciones');
// };
// const DBcotizacion = (request) => request.mongo.db.collection('cotizaciones');

// exports.getCotizaciones = (request) => DBcotizacion(request).find().toArray();

// exports.getOneCotizacion = (request, data) =>
// 	DBcotizacion(request).findOne(data);

// exports.insertCotizacion = async (request, data) => {
// 	await DBcotizacion(request).createIndex(
// 		{ cotizacionId: 1 },
// 		{ unique: true }
// 	);
// 	const saved = await DBcotizacion(request).insertOne(data);
// 	console.log(saved);
// 	return saved.ops[0];
// };
