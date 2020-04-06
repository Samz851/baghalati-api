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
const https = require('axios');
const qs = require('querystring');
const Admins = require('../models/admins');
const tokenURI = 'https://api.hikeup.com/oauth/token';
const authURI = 'https://api.hikeup.com/oauth/authorize';
const client_id =  'baghalati-1be96a0e45';
const client_secret = '452e2c42d33e48c9b755bdae9991ce46';
const redirect_uri = 'https://api.baghalati.com/api/pos/hikeup-redirect';

const authorizeURI = (user_token) => {
    return `https://api.hikeup.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${user_token}&scope=all`;
}
var origURL = '';


POSController.authorize = async (req, res) => {
    const { user_token } = req.query;
    origURL = req.hostname + req.originalUrl;
    res.writeHead(301,
        {Location: authorizeURI(user_token)}
    );
    res.end();
  
  
};

POSController.redirect = async (req, res) => {
    if(!req.query.error){
        const { code, state } = req.query;
        console.log(`CODE: ${code}`);
        console.log(`STATE: ${state}`);

         let requestB = {
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
          }
        
        const config = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }
        
        https.post(tokenURI, qs.stringify(requestB), config)
          .then(async (result) => {
            // Do somthing
            if(result.data){
              Admins.findOne({session_id: state}, function(err, user){
                console.log(user);
                if(user){
                  user.pos_data = {...result.data};
                  res.writeHead(301,
                    {Location: authorizeURI('https://admin.jubnawebaith.com/dashboard?synched=true')}
                  );
                  res.end();
                }else{
                  res.json({success: false, message: 'Failed to save user access token', error:err});
                }
              });
            }
          })
          .catch((err) => {
            // Do somthing
            console.log("HIKEUP AUTH ERROR:::::");
            console.log(err);
          })
    }
}


module.exports = POSController;

/** this ends this file
* server/controllers/clients.controller
**/
