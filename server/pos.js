/**
* Name: HIKEUP POS
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description: HikeUp API CONNECTION
*
* Requirements: 
*
* @package commerce
* @property
*
* @version 1.0
*/
const https = require('axios');
const qs = require('querystring')
const config = require('../config')
const tokenURI = 'https://api.hikeup.com/oauth/token';
const authURI = 'https://api.hikeup.com/oauth/authorize';
const authtCode = "e92f52ce3166455c96f519aa98c706f903314c7a84f84ba9b72451babe924996";   // DEV ONLY
var POS = {};
// hikeup = https.get(URI, (res) => {
//     // console.log('response is: ');
//     console.log(res.rawHeaders)
//     console.log(`Status Code ${res.statusCode}`);
//     res.on('data', (d) => {
//         process.stdout.write(d);
//       });
// })
const req_config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const requestBody = {
    client_id: 'jubnawebaith-app-2c1b2b595e',
    client_secret: 'ff5700a000b04e47accd84b215dac4b4',
    code: 'bcfd562e2ec444dc8598e5c369317fdfe46d0494794f4cd5b301739d7e67fd08',
    redirect_uri: 'https://samiscoding.com',
    grant_type: 'authorization_code'
}

POS.requestAccessToken = async () => {
  let requestB = {
    client_id: config.POS.app_id,
    client_secret: config.POS.app_secret,
    code: authtCode,
    redirect_uri: config.POS.redirect_uri,
    grant_type: 'authorization_code'
  }
  try {
    response = await https.post(tokenURI, requestBody, req_config);
    return response;
  } catch (e) {
    console.log(e.response);
  }
}
module.exports = POS;


