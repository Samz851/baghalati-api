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
const get_products_uri = 'https://api.hikeup.com/api/v1/products/get_all';

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
                  user.is_connected = true
                  user.save();
                  res.writeHead(301,
                    {Location: 'https://admin.jubnawebaith.com/dashboard?synched=true'}
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

POSController.refreshToken = async (req, res) => {
  const { id } = req.query;
  try{
    let user = await Admins.findOne({session_id: id});
    if(user){
      const { pos_data } = user;
      let requestB = {
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: pos_data.refresh_token,
        grant_type: 'refresh_token'
      }

      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }

      try{
        let refresh = await https.post(tokenURI, qs.stringify(requestB), config);
        user.pos_data = refresh.data;
        user.save();
        res.json({success: true, message: 'Successfully refreshed token'})
      }catch(err){
        res.json({success: false, message: 'Failed to refresh token'});
      }
      
    }
  }catch(err){
    res.json({success: false, message: 'Failed to locate user'})
  }

}

POSController.getProducts = async (req, res) => {
  const { page, id } = req.query;

  let user = await Admins.findOne({session_id: id}, 'pos_data');
  if(user){
    //Try fetching
    const config = {
      headers: {
        'Authorization': 'Bearer ' + user.pos_data.access_token
      }
    }

    let query = {
      page_size: 20,
      Skip_count: page == 0 ? 0 : page * 20 - 1
    }
    
  }

  try {
    let products = await https.get(get_products_uri, qs.stringify(query), config);
    console.log('Products result!!!!!!!!!!');
    console.log(products);
  }catch(err){
    console.log("products Error!!!!");
    console.log(err);
  }

}

module.exports = POSController;

/** this ends this file
* server/controllers/clients.controller
**/
