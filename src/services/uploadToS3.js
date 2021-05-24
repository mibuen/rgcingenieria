const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_KEYID,
  secretAccessKey: process.env.AWS_SECRET,
});
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  // params: { Bucket: bucketName },
});

const options = { partSize: 10 * 1024 * 1024, queueSize: 5 };

const myUpload = async (fotoNombre, fotoFile) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    ContentDisposition: 'inline',
    ContentType: 'image/png',
    ACL: 'public-read',
    Key: fotoNombre,
    Body: fotoFile,
  };
  const fileRespo = await s3.upload(params, options).promise();
  return fileRespo;
};

module.exports = {
  myUpload,
};
