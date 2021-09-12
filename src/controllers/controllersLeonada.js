const { uploadS3v4 } = require('../services/uploadV4');

const getS3postController = async (request, h) => {
  const {cotizacionId, proyectoId,key}=request
  const folder = `${cotizacionId}/${proyectoId}`
  return uploadS3v4(folder,key);
}

module.exports = {
  getS3postController,
};
