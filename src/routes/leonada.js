const getS3postRoute = {
	method: 'POST',
	path: '/gets3post',
	handler: require('../controllers/controllersLeonada').getS3postController,
	options: {
		description: 'get S3 end point',
	},
};

module.exports = [getS3postRoute];
