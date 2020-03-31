/**
 * Name: clients
 *
 * @author Samer Alotaibi
 *		  sam@samiscoding.com
 *
 *
 *
 * Description: Clients data model
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

const AdminSchema = new Schema({
    admin_id: {
        type:mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    email: {
        type:mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    username: {
        type:mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
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
}, {
    
    timestamps: true,
    autoIndex: true
});

AdminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('admins', AdminSchema);



/** this ends this file
 * server/models/clients
 **/

 