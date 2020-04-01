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

const adminsController = require('../controllers/admins.controller');

router.post('/register', adminsController.register);
router.post('/login', adminsController.login);
router.post('/sid', adminsController.verifySID);


module.exports = router;
/** this ends this file
* server/routes/admins.routes
**/
