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

exports.getAllDbResources = (request, col, pipeline) => {
	console.log('PIPe', pipeline);
	return DB(request, col).aggregate([pipeline]).toArray();
};

exports.insertDbResource = (request, col, data) =>
	DB(request, col).insertOne(data);

exports.updateDbResource = (request, col, query, data) => {
	return DB(request, col).updateOne(query, { $set: data });
};
