const dotenv = require('dotenv');

dotenv.config();
const {
  NODE_ENV,
  PORT,
  HOST,
  MONGO,
  AWS_KEYID,
  AWS_SECRET,
  AWS_BUCKET,
} = process.env;
module.exports = {
  nodeEnv: NODE_ENV,
  port: PORT,
  host: HOST,
  mongoDb: MONGO,
  awsKey: AWS_KEYID,
  awsSecret: AWS_SECRET,
  repo: AWS_BUCKET,
};
