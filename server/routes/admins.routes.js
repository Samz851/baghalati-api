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
var multer  = require('multer')
const cors = require('cors');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './server/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname )
    }
  })
var upload = multer({ storage: storage })

const adminsController = require('../controllers/admins.controller');

router.post('/register', adminsController.register);
router.post('/login', adminsController.login);
router.post('/sid', adminsController.verifySID);
router.post('/pushBanner', [cors('*'), upload.single('file')], adminsController.pushBanners);
router.get('/getBanners', adminsController.getBanners);
router.get('/deleteBanners', adminsController.deleteBanners);
router.post('/deliveryFee', adminsController.updateDelivery);
router.get('/deliveryFee', adminsController.getDelivery);

module.exports = router;
/** this ends this file
* server/routes/admins.routes
**/
