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
  const validExt = ['jpeg', 'jpg', 'png', 'tif', 'webp', 'svg'];
  const { fotoFile, proyectoId } = request.payload;
  const fotoFiles = [].concat(fotoFile);
  try {
    const checkMongo = await DB(request, 'proyectos').find({ proyectoId: parseInt(proyectoId, 10) }).count();
    if (checkMongo !== 1) {
      return h.response({ message: 'proyecto no existe' });
    }
    const filesToS3 = await Promise.all(fotoFiles.map(async (file) => {
      const x = file.hapi.filename;
      const [base, ext] = x.split('.');
      if (!validExt.includes(ext.toLowerCase())) {
        return { message: 'invalid file' };
      }
      const fotoNombre = `${proyectoId}/${base}.webp`;
      // const img = file.pipe(transformer());
      const img = file;
      const toS3 = await myUpload(fotoNombre, img);
      const imgObj = {
        url: toS3.Location,
        comentarios: '',
        status: '',
        item: '',
      };
      const toMongo = await DB(request, 'proyectos').updateOne({ proyectoId: parseInt(proyectoId, 10) }, { $push: { fotos: { $each: [imgObj], $sort: { item: 1, status: 1 } } } });
      return (imgObj);
    }));
    const invalidFiles = filesToS3.filter((elem) => elem.message).length;
    const imgUrls = filesToS3.filter((elem) => !elem.message);
    const acceptedFiles = filesToS3.length - invalidFiles;
    return h.response({ message: `Files Saved: ${acceptedFiles}, rejected: ${invalidFiles}`, imgUrls });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const creaReporte = async (request, h) => {
  const {
    proyectoId, url, item, status, comentarios,
  } = request.payload;
  const query = { proyectoId: parseInt(proyectoId, 10), 'fotos.url': url };
  const data = {
    'fotos.$.item': item,
    'fotos.$.comentarios': comentarios,
    'fotos.$.status': status,
  };
  console.log(query);
  console.log(data);
  try {
    const reporte = await DB(request, 'proyectos').updateOne(query, { $set: data });
    const sortedReport = await DB(request, 'proyectos').updateOne(query, { $push: { fotos: { $each: [], $sort: { item: 1, status: -1 } } } });
    return h.response(sortedReport);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// db.proyectos.updateOne({proyectoId:1980,"fotos.url":"https://repofotosdaniel.s3.amazonaws.com/1980/2021-05-23-0002.webp"},{$set:{"fotos.$.comentarios":"Ya Chingamos con URL"}})
module.exports = {
  crearProyecto,
  inactivarProyecto,
  listaProyectos,
  modificarProyecto,
  agregarFoto,
  getProyecto,
  creaReporte,
};
