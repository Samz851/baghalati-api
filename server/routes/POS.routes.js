/**
* Name: POS.routes
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: routes for HIKEUP POS
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

const POSController = require('../controllers/POS.controller');


router.get('/hikeup-authorize', POSController.authorize );
router.get('/hikeup-redirect', POSController.redirect );
router.get('/refreshToken', POSController.refreshToken);
router.get('/getProducts', POSController.getProducts);
router.post('/syncPOS', POSController.syncInventory);

module.exports = router;
/** this ends this file
* server/routes/clients.routes
**/
