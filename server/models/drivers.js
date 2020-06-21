/**
 * Name: drivers
 *
 * @author Samer Alotaibi
 *		  sam@samiscoding.com
 *
 *
 *
 * Description: drivers data model
 *
 * Requirements: mongoose
 *
 * @package
 * @property
 *
 * @version 1.0
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const DriverSchema = new Schema({
    driver_id: {
        type:mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        trim: true,
        required: "Password is Required"
    },
    session_id: {
        type: String

    },

    csrf_id: {
        type: String
    },

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }],
}, {
    
    timestamps: true,
    autoIndex: true
});

DriverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('drivers', DriverSchema);



/** this ends this file
 * server/models/clients
 **/

 