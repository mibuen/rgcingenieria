const { getS3postController } = require('../controllers/controllersLeonada');

const getS3postRoute = {
  method: 'POST',
  path: '/gets3post',
  handler: getS3postController,
  options: {
    description: 'get S3 end point',
  },
};

module.exports = [getS3postRoute];
