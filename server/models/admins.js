/**
 * Name: clients
 *
 * @author Samer Alotaibi
 *		  sam@samiscoding.com
 *
 *
 *
 * Description: Admin data model
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
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
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
    pos_data: {
        access_token: {
            type: String
        },
        token_type: {
            type: String
        },
        expires: {
            type: Number
        },
        expires_in: {
            type: Number
        },
        refresh_token: {
            type: String
        },
        lastUpdate: {
            type: Date
        }
    },
    is_connected: {
        type: Boolean,
        default: 'false'
    },
    phone: {
        type: String
    }
}, {
    
    timestamps: true,
    autoIndex: true
});

AdminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('admins', AdminSchema);



/** this ends this file
 * server/models/clients
 **/

 