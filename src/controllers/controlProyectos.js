const Boom = require('@hapi/boom');

const DB = (request, colName) => request.mongo.db.collection(colName);

const existeProyecto = async (request, h) => {
  const { proyectoId } = request.params;
  const response = await DB(request, 'proyectos').find({ proyectoId: parseInt(proyectoId, 10) }).count();
  return response !== 1 ? h.response({ message: 'proyecto no existe' }) : h.response({ message: 'proyecto valido' });
};

const crearProyecto = async (request, h) => {
  const { proyectoId } = request.payload;
  request.payload.proyectoId = parseInt(proyectoId, 10);
  try {
    await request.mongo.db.collection('proyectos').createIndex({ proyectoId: 1 }, { unique: true });
    const proyecto = await DB(request, 'proyectos').insertOne(request.payload);
    return h.response(proyecto.ops[0]).code(201);
  } catch (error) {
    throw Boom.badRequest('duplicate project');
  }
};
const inactivarProyecto = async (request, h) => h.response('proyecto inactivado');
//++++++++++++++++++++++++++++++
const listaProyectos = async (request, h) => {
  const criteria = request.query;
  try {
    const proyectos = await DB(request, 'proyectos').find(criteria).toArray();
    return h.response(proyectos).code(200);
  } catch (error) {
    console.log(error);
  }
};
//+++++++++++++++++++++
const getProyecto = async (request, h) => {
  const { proyectoId } = request.params;
  try {
    const proyecto = await DB(request, 'proyectos').findOne({ proyectoId: parseInt(proyectoId, 10) });
    return proyecto ? h.response(proyecto).code(200) : h.response({ message: 'proyecto no existe' });
  } catch (error) {
    console.log(error);
  }
};
// ++++++++++++++++++++++++++++++
const modificarProyecto = async (request, h) => h.response('modificar proyectos, ');
//++++++++++++++++++++++++++++++++++++++++++++

const agregarFoto = async (request, h) => {
  const { proyectoId, key } = request.payload;
  console.log(proyectoId, key);
  const imgObj = {
    key,
    comentarios: '',
    status: '',
    item: '',
  };
  try {
    const toMongo = await DB(request, 'proyectos').updateOne({ proyectoId: parseInt(proyectoId, 10) }, { $push: { fotos: { $each: [imgObj], $sort: { item: 1, status: 1 } } } });
    return { modified: toMongo.modifiedCount };
  } catch (error) {
    throw Boom.serverUnavailable('mongo not available');
  }
};
const creaReporte = async (request, h) => {
  const {
    proyectoId, key, item, status, comentarios,
  } = request.payload;
  const query = { proyectoId: parseInt(proyectoId, 10), 'fotos.key': key };
  const data = {
    'fotos.$.item': item,
    'fotos.$.comentarios': comentarios,
    'fotos.$.status': status,
  };
  try {
    await DB(request, 'proyectos').updateOne(query, { $set: data });
    const sortedReport = await DB(request, 'proyectos').updateOne(query, { $push: { fotos: { $each: [], $sort: { item: 1, status: -1 } } } });
    return h.response(sortedReport).code(201);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  crearProyecto,
  inactivarProyecto,
  listaProyectos,
  modificarProyecto,
  agregarFoto,
  getProyecto,
  creaReporte,
  existeProyecto,
};
