/**
* Name: database
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
const URI = 'https://api.hikeup.com/oauth/token';

// hikeup = https.get(URI, (res) => {
//     // console.log('response is: ');
//     console.log(res.rawHeaders)
//     console.log(`Status Code ${res.statusCode}`);
//     res.on('data', (d) => {
//         process.stdout.write(d);
//       });
// })
const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const requestBody = {
    client_id: 'jubnawebaith-app-2c1b2b595e',
    client_secret: 'ff5700a000b04e47accd84b215dac4b4',
    code: '548ad434dcbc44aa8d3cb8605fd0b97bf333ed4a4e1148a097148d985e742d10',
    redirect_uri: 'https://samiscoding.com',
    grant_type: 'authorization_code'
}
// https.post(URI, requestBody, config)
//   .then((result) => {
//     // Do somthing
//     console.log('result: ');
//     console.log(result);
//   })
//   .catch((err) => {
//     // Do somthing
//     console.log('Error:');
//     console.log(err.message)
//   })
// token.on('response', (resObj) => {
//     console.log('responce object is:')
//     console.log(resObj);
// })
// token.on('error', (e) => {
//     console.error(`problem with request: ${e.message}`);
//   });
// token.write(JSON.stringify(data));
// token.end();
module.exports = '';


