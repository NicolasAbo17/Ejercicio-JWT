const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'products';
const { ObjectId } = require("mongodb");
const { roles } = require('../lib/utils/roles.js');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

async function getProducts() {
  const client = await mongoUtils.conn();
  const products = await client
    .db(dataBase)
    .collection(COLLECTION_NAME)
    .find({})
    .toArray()
    .finally(() => client.close());
  return products;
}

function insertProduct(product) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(product)
      .finally(() => client.close());
  });
}

function updateProduct(body, productoId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .updateOne(
        {
          _id: ObjectId(productoId),
        },
        {
          $set: { idProducto: body.idProducto,
            nombreProducto: body.nombreProducto,
            idProveedor: body.idProveedor,
            idCategoria: body.idCategoria,
            cantidadPorUnidad: body.cantidadPorUnidad,
            precioUnidad: body.precioUnidad,
            unidadesEnExistencia: body.unidadesEnExistencia,
            unidadesEnPedido: body.unidadesEnPedido,
            nivelNuevoPedido: body.nivelNuevoPedido,
            suspendido: body.suspendido,
            categoriaProducto: body.categoriaProducto  },
        },
      )
      .finally(() => client.close());
  });
}

function checkAutorization(action, token, resource){
    
  let accessGranted;  
  jwt.verify( token, secret, (err, decoded ) => {
    let role = decoded.role;
    const permission = roles.can(role)[action](resource);

    accessGranted = permission.granted;
  });
  return accessGranted;
}

module.exports = [getProducts, insertProduct, updateProduct, checkAutorization ];