/**
* Name: clients.controller
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description: controller for clients
*
* Requirements: clients model
*
* @package
* @property
*
* @version 1.0
*/

const POSController = {};
const qs = require('querystring')
const tokenURI = 'https://api.hikeup.com/oauth/token';
const authURI = 'https://api.hikeup.com/oauth/authorize';
const client_id =  'baghalati-1be96a0e45';
const client_secret = '452e2c42d33e48c9b755bdae9991ce46';
const redirect_uri = 'https://api.baghalati.com/api/pos/hikeup-redirect';
const authorizeURI = `https://api.hikeup.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=all`;
var headers = {'Content-Type': 'application/x-www-form-urlencoded'}
var origURL = '';


POSController.authorize = async (req, res) => {
    origURL = req.hostname + req.originalUrl;
    // res.json({
    //     host: req.hostname,
    //     originalURL: req.originalUrl
    // })

    res.writeHead(301,
        {Location: authorizeURI}
    );
    res.end();
  
  
};

POSController.redirect = async (req, res) => {
    console.log('HIKE UP OBJ');
    console.log(req.params)
    if(req.params.code){
        process.env.HUCODE = req.params.code;
    }
    console.log(process.env.HUCODE);
}


module.exports = POSController;

/** this ends this file
* server/controllers/clients.controller
**/
