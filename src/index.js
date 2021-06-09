const config = require('./config');
const { createServer } = require('./app');

const startServer = async () => {
  const server = await createServer(config);
  await server.start();
  // console.log('server running on ', server.info.uri);
  server.log('info');
};
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
startServer();
