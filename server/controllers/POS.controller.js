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
var FormData = require('form-data');
const fetch = require("node-fetch");
const qs = require('querystring');
const Admins = require('../models/clients');
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
  let serverRes;
    if(!req.query.error){
        const { code, state } = req.query;
        // const Config = {
        //     headers: {
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        //   }

        let requestB = {
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
          }
          let formData = new FormData();
          for(var field in requestB) {
            formData.append(field, requestB[field]);
          }
            // response = await fetch.post(tokenURI, requestB);
            let request = await fetch(tokenURI, { method: 'POST', body: formData}).then((response) => {
              console.log("HIKEUP AUTH RESPONSE:::::");
              console.log(response);
              serverRes = response.json();
            }).catch((e) => {
              console.log("HIKEUP AUTH ERROR:::::");
              console.log(e);
            })
            // let response = await request.json();
          }
    }
}


module.exports = POSController;

/** this ends this file
* server/controllers/clients.controller
**/
