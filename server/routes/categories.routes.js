/**
 * Name: clients.routes
 *
 * @author Samer Alotaibi
 *		  sam@samiscoding.com
 *
 *
 * Description: routes for clients
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

const categoryController = require('../controllers/categories.controller');

router.get('/',categoryController.getCategories);

router.post('/',categoryController.createCategory);
router.put('/addProduct/:id', categoryController.addProduct);

module.exports = router