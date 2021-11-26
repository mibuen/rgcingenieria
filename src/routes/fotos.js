module.exports = [
	{
		method: 'POST',
		path: '/gets3post',
		handler: require('../controllers/controllersFotos').getS3postController,
		options: {
			description: 'get S3 end point',
		},
	},
	{
		method: 'POST',
		path: '/agregarfoto',
		handler: require('../controllers/controllersFotos').agregarFoto,
		options: {
			description: 'upload fotos',
		},
	},
];
