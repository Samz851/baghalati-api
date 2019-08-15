/**
* Name: suppliers.routes
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: routes for Suppliers
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

const suppliersController = require('../controllers/suppliers.controller');

router.get('/', suppliersController.getSuppliers);
router.get('/:id', suppliersController.getSupplier);

router.post('/', suppliersController.createSupplier);

router.delete('/:id', suppliersController.deleteSupplier);

router.put('/:id', suppliersController.editSupplier);

module.exports = router;

/** this ends this file
* server/routes/suppliers.routes
**/
