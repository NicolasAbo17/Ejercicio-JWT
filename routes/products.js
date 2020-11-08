var express = require('express');
var router = express.Router();
var [getProducts, insertProduct, updateProduct, checkAutorization ] = require('../controllers/product');
const auth = require('../lib/utils/auth.js')

let checkAccess = (action, req) => {
  let token = req.headers['authorization'] 
  token = token.split(' ')[1];
  if(checkAutorization(action, token ,'products') === false){
    return res.status(401).json({
     error: "Access denied"
    });
  }
};

/* GET product listing. */
router.get('/', auth.checkToken, async function (req, res, next) {
  checkAccess('readAny', req);

  const products = await getProducts();
  console.warn('products->', products);
  res.send(products);
});


/**
 * POST product
 */
router.post('/', async function (req, res, next) {
  checkAccess('createAny', req);

  const newProduct = await insertProduct(req.body);
  console.warn('insert products->', newProduct);
  res.send(newProduct);
});

/**
 * PUT product
 */
router.put('/:productoId', auth.checkToken, async function (req, res, next) {
  checkAccess('updateAny', req);

  const editProduct = await updateProduct(req.body, req.params.productoId);
  res.send(editProduct);
});

module.exports = router;