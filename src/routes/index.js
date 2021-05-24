const controlProyectos = require('./proyectos');

const mainpage = {
  method: 'GET',
  path: '/',
  handler: async (request, h) => 'Hola Daniel',
};

module.exports = [mainpage, ...controlProyectos];
