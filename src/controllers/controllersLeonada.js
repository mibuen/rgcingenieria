// const { s3Post } = require('../services/uploadToS3');
const { uploadS3v4 } = require('../services/uploadV4');

const getS3postController = async (request, h) => uploadS3v4(request.payload.proyectoId,
  request.payload.key);
module.exports = {
  getS3postController,
};
