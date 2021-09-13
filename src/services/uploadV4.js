const { S3Client } = require('@aws-sdk/client-s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { v4 } = require('uuid');

const client = new S3Client({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});
const uploadS3v4 = async (folder, key) => {
	//console.log('folder', folder);
	//console.log('FILE', key);
	const ext = key.split('.').pop();
	const Key = `${folder}/${v4()}.${ext}`;
	const Conditions = [
		{ bucket: process.env.BUCKET },
		['content-length-range', 0, 10000000],
		['starts-with', '$Content-Type', 'image/'],
	];
	// const Fields = {
	//   proyectoId,
	// };
	const options = {
		Bucket: process.env.BUCKET,
		Key,
		Conditions,
		// Fields,
		expires: 600,
	};
	try {
		const { url, fields } = await createPresignedPost(client, options);
		return { url, fields };
	} catch (error) {
		console.log('PENDEJADA', error);
		return { PENDEJADA: error };
	}
};

module.exports = { uploadS3v4 };
