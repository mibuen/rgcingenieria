const { uploadS3v4 } = require('../services/uploadV4');

const getS3postController = async (request, h) => {
	console.log('REQUEST', request.payload);
	const { cotizacionId, proyectoId, key } = request.payload;
	console.log(cotizacionId);
	console.log(proyectoId);

	const folder = `${cotizacionId}/${proyectoId}`;
	console.log(folder);
	return uploadS3v4(folder, key);
};

module.exports = {
	getS3postController,
};
