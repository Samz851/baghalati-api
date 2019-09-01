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
const { Schema } = mongoose;

const ClientSchema = new Schema({
    customer_id: mongoose.Schema.Types.ObjectId,
    full_name: {
        type: String,
        required: true
    },
    
    date_of_birth: {
        type: Date,
        required: true
    },

    contact_no: {
        type: String,
        /*not required by default**/
        validate: {
            validator: function (v) {
                var re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
                return (v == null || v.trim().length < 1) || re.test(v);
            },
            message: 'Provided phone number is invalid.'
        }
    },

    contact_email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
        verified: {
            type: Boolean,
            required: false,
            default: false
        }
    },

     billing_address: {
         address:{
             type: String,
             required: true
        },
        district: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip_code: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
         geolocation: {
             longitude:{
                 type: Number,
                 required: true
             },
             latitude:{
                 type: Number,
                 required: true
             },
        //     required: true
         },

        // required: true
     },

    payment_cards: [{
        card_name: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        card_number: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        expiry_date: {
            type: Date,
            required: true,
            trim: true
        },
        zip: {
            type: String,
            trim: true,
            required: false
        },

        required: false
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }],
}, {
    
    timestamps: true,
    autoIndex: true
});


module.exports = mongoose.model('customers', ClientSchema);



/** this ends this file
 * server/models/clients
 **/

 