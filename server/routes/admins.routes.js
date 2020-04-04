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
router.post('/pushBanner', upload.single('file'), adminsController.pushBanners);

module.exports = router;
/** this ends this file
* server/routes/admins.routes
**/
