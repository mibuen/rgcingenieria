const Hapi = require('@hapi/hapi');

const createServer = async (config) => {
  const { host, port } = config;
  const server = Hapi.server({
    host,
    port,
    routes: {
      cors: true,
    },
  });
  server.app.config = config;
  await server.register(require('./plugins'));
  server.route(require('./routes'));
  return server;
};
module.exports = {
  createServer,
};
