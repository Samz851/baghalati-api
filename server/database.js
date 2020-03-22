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

const remote_URI = 'mongodb+srv://baghalati:CaH7bWH7Hin1l8K9@cluster0-yntzv.mongodb.net/jubnwbDB';
mongoose.connect(remote_URI, {
    useNewUrlParser: true
})
    .then(db => console.log(`${URI} is connected`))
    .catch( err => console.log(`Error en Mongo: ${err}`));

module.exports = mongoose;


