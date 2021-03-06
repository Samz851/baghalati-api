/**
* Name: index
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: entry for baghalati-API
*
* Requirements: express, morgan, mongoose, cors, nodemon
*
* @package commerce
* @property
*
* @version 1.0
*/
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const POS = require('./pos');
var bodyParser = require('body-parser');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const { mongoose } = require('./database');

/**
 * S E T T I N G S
 */
app.set('port', process.env.PORT || 3200);
app.set('eventEmitter', eventEmitter);

/** 
 * H I K E U P  A U T H
 */
// let temp_code = POS.requestAccessToken();
// console.log(temp_code);

/**
 * M I D D L E W A R E S
 */
app.use(morgan('dev'));
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use('/uploads', express.static(__dirname + '/uploads'));
// app.use(function(req, res, next) {

//   res.header("Access-Control-Allow-Origin", "*");

//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//   next();

// });
app.get('/', (req, res, err) => {
  res.json({message: 'Welcome to Jubna We Baith API v1'})
})


/**
 * R O U T E S
 */ 
app.use('/v1/products', cors({origin: '*'}), require('./routes/product.routes'));
app.use('/v1/clients', require('./routes/clients.routes'));
app.use('/v1/suppliers', require('./routes/suppliers.routes'));
app.use('/v1/categories', require('./routes/categories.routes'));
app.use('/v1/admin', require('./routes/admins.routes'));
app.use('/v1/orders', require('./routes/orders.routes'));
app.use('/v1/pos', require('./routes/POS.routes'));



/**
 * S T A R T I N G   S E R V E R
 */

app.listen(app.get('port'), (error) => {
    if (error)
    {
        console.log('Error on server: ',err);
    } 
    else {
        console.log('Server on port', app.get('port'));
    }
});

/** this ends this file
* server/index
**/
