const AWS = require('aws-sdk');
const { v4 } = require('uuid');

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
//* ****S3 Post */

const s3Post = (proyectoId, ext) => {
  const fileName = `${proyectoId}/${v4()}.${ext}`;
  console.log(fileName);
  const posParams = {
    Bucket: process.env.BUCKET,
    Fields: {
      key: fileName,
    },
    Conditions: [
      ['content-length-range', 0, 10000000],
      ['starts-with', '$Content-Type', 'image/'],
      // ['eq', '$x-amz-meta-user-id', userId],
      ['eq', '$x-amz-meta-proyectoId', proyectoId],
    ],
    // ContentType: fileType,
  };

  const data = s3.createPresignedPost(posParams);
  data.fields['x-amz-meta-proyectoId'] = proyectoId;
  return data;
};

module.exports = {
  myUpload,
  s3Post,
};
// data.fields['$x-amz-meta-user-id'] = userId;
// data.fields['$x-amz-meta-proyectoId'] = proyectoId;
