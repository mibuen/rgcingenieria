const { S3Client } = require('@aws-sdk/client-s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { v4 } = require('uuid');

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
  },
});
const uploadS3v4 = async (proyectoId, key) => {
  const ext = key.split('.').pop();
  const Key = `${proyectoId}/${v4()}.${ext}`;
  const Conditions = [{ bucket: process.env.BUCKET },
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
    console.log(error);
    return { PENDEJADA: error };
  }
};

module.exports = { uploadS3v4 };
