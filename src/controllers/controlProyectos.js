const Boom = require('@hapi/boom');
const { myUpload } = require('../services/uploadToS3');
const { transformer } = require('../services/transform');

const DB = (request, colName) => request.mongo.db.collection(colName);

const crearProyecto = async (request, h) => {
  const { proyectoId } = request.payload;
  request.payload.proyectoId = parseInt(proyectoId, 10);
  try {
    await request.mongo.db.collection('proyectos').createIndex({ proyectoId: 1 }, { unique: true });
    const proyecto = await DB(request, 'proyectos').insertOne(request.payload);
    return h.response(proyecto.ops[0]).code(201);
  } catch (error) {
    throw Boom.badRequest('duplicate project');
    // console.log('DUPLICATE', error);
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
  // console.log(proyectoId);
  try {
    const proyecto = await DB(request, 'proyectos').findOne({ proyectoId: parseInt(proyectoId, 10) });
    // console.log(proyecto);
    return proyecto ? h.response(proyecto).code(200) : h.response({ message: 'proyecto no existe' });
  } catch (error) {
    console.log(error);
  }
};
// ++++++++++++++++++++++++++++++
const modificarProyecto = async (request, h) => h.response('modificar proyectos, ');
//++++++++++++++++++++++++++++++++++++++++++++
// ++++++++ Agregar Fotos++++++++++++++++++
const agregarFoto = async (request, h) => {
  const validExt = ['jpeg', 'jpg', 'png'];
  const { fotoFile, proyectoId } = request.payload;
  console.log('PROYECTO', typeof proyectoId);
  try {
    const checkMongo = await DB(request, 'proyectos').find({ proyectoId: parseInt(proyectoId, 10) }).count();
    if (checkMongo !== 1) {
      return h.response({ message: 'proyecto no existe' });
    }
  } catch (error) {
    console.log(error);
  }

  // read array of files
  const fotoFiles = [].concat(fotoFile);
  const filesToS3 = await Promise.all(fotoFiles.map(async (file) => {
    const x = file.hapi.filename;
    const [base, ext] = x.split('.');
    if (!validExt.includes(ext.toLowerCase())) {
      return;
    }
    const fotoNombre = `${proyectoId}/${base}.webp`;
    const img = file.pipe(transformer());
    try {
      const toS3 = await myUpload(fotoNombre, img);
      const imgObj = {
        url: toS3.Location,
        comentarios: '',
        status: 'inicial',
        item: 1,
      };

      const toMongo = await DB(request, 'proyectos').updateOne({ proyectoId: parseInt(proyectoId, 10) }, { $push: { fotos: { $each: [imgObj] } } });
      return (imgObj);
    } catch (error) {
      console.log(error);
      return error;
    }
  }));
  return h.response(filesToS3);
};

module.exports = {
  crearProyecto, inactivarProyecto, listaProyectos, modificarProyecto, agregarFoto, getProyecto,
};
