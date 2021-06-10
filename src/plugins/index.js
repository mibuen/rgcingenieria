exports.plugin = {
  name: 'index',
  version: '1.0.0',
  register: async (server, options) => {
    await server.register([
      { plugin: require('blipp') },
      // {
      //   plugin: require('laabr'),
      // },
      { plugin: require('./mongoPlugin') },

    ]);
  },
};
