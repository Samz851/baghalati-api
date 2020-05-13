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

const ordersController = require('../controllers/orders.controller');

router.get('/activeOrders', ordersController.getActiveProducts);
router.get('/ordersFeed', ordersController.ordersFeed);
router.get('/ordersByUser', ordersController.ordersByUser);
router.get('/orderDetails', ordersController.orderDetails);
router.post('/updateOrderStatus', ordersController.updateOrderStatus);
router.post('/pushOrder', ordersController.pushOrder);

module.exports = router;