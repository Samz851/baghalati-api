/**
* Name: product.routes
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: routes declaration for products
*
* Requirements: express
*
* @package
* @property
*
* @version 1.0
*/

const express = require('express');
const router = express.Router();
const cors = require('cors');

const productsController = require('../controllers/product.controller');
const productController = require('../controllers/product.controller');

router.get('/', productsController.getProducts);
router.get('/getTags', productsController.getTags);
router.get('/count', productsController.getCount);
router.get('/actives', productsController.getActives);
router.get('/actives/count', productsController.getActivesCount);
router.get('/inactives', productsController.getInactives);
router.get('/inactives/count', productsController.getActivesCount);
router.get('/brokenstock', productsController.brokenStock);
router.get('/:id', productsController.getProduct);
router.get('/activate/:id', productsController.activateProduct);
router.get('/deactivate/:id', productsController.deactivateProduct);
// router.post('/arabizeTags', productsController.arabizeTags);

router.post('/editProduct', cors({origin: '*'}), productsController.editProduct);
router.put('/addimage/:id', productsController.addImage);

router.post('/', productsController.createProduct);
router.post('/getProductsByIDs', productsController.getProductsByIDs);
router.post('/setProductImages', productController.setProductImages);


router.delete('/:id', productsController.deleteProduct);

module.exports = router;

/** this ends this file
* server/routes/product.routes
**/
 