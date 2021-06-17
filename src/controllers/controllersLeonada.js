const { s3Post } = require('../services/uploadToS3');

const getS3postController = async (request, h) => {
  const { proyectoId, ext } = request.payload;
  console.log('CONTROLLER', proyectoId);
  const s3Data = s3Post(proyectoId, ext);
  return h.response({ s3Data });
};
module.exports = {
  getS3postController,
};
