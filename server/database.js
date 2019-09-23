/**
* Name: database
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description: mongo database connection
*
* Requirements: monggose
*
* @package commerce
* @property
*
* @version 1.0
*/
const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/baghalatiDB';

mongoose.connect(URI, {
    useNewUrlParser: true
})
    .then(db => console.log(`${URI} is connected`))
    .catch( err => console.log(`Error en Mongo: ${err}`));

module.exports = mongoose;


