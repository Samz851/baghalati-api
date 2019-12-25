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

const ClientSchema = new Schema({
    customer_id: {
        type:mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    full_name: {
        type: String,
        match: [/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Invalid Name"],
        required: true
    },
    
    password: {
        type: String,
        trim: true,
        required: "Password is Required"
    },
    date_of_birth: {
        type: Date,
        required: true,
        min: '1900-01-01',

    },

    contact_no: {
        type: String,
        /*not required by default**/
        validate: {
            validator: function (v) {
                var re = /^(([\+]{1}[0-9]{1,3}[\ ]{1}[0-9]{1,2}[\ ]{1}[0-9]{4}[\ ]{1}[0-9]{4})|([0]{1}[0-9]{1}[\ ]{1}[0-9]{4}[\ ]{1}[0-9]{4})|([0]{1}[0-9]{1}[\-]{1}[0-9]{4}[\-]{1}[0-9]{4})|([\(]{1}[0]{1}[0-9]{1}[\)]{1}[\ ]{1}[0-9]{4}([\ ]|[\-]){1}[0-9]{4})|([0-9]{4}([\ ]|[\-])?[0-9]{4})|([0]{1}[0-9]{3}[\ ]{1}[0-9]{3}[\ ]{1}[0-9]{3})|([0]{1}[0-9]{9})|([\(]{1}[0-9]{3}[\)]{1}[\ ]{1}[0-9]{3}[\-]{1}[0-9]{4})|([0-9]{3}([\/]|[\-]){1}[0-9]{3}[\-]{1}[0-9]{4})|([1]{1}[\-]?[0-9]{3}([\/]|[\-]){1}[0-9]{3}[\-]{1}[0-9]{4})|([1]{1}[0-9]{9}[0-9]?)|([0-9]{3}[\.]{1}[0-9]{3}[\.]{1}[0-9]{4})|([\(]{1}[0-9]{3}[\)]{1}[0-9]{3}([\.]|[\-]){1}[0-9]{4}(([\ ]?(x|ext|extension)?)([\ ]?[0-9]{3,4}))?)|([1]{1}[\(]{1}[0-9]{3}[\)]{1}[0-9]{3}([\-]){1}[0-9]{4})|([\+]{1}[1]{1}[\ ]{1}[0-9]{3}[\.]{1}[0-9]{3}[\-]{1}[0-9]{4})|([\+]{1}[1]{1}[\ ]?[\(]{1}[0-9]{3}[\)]{1}[0-9]{3}[\-]{1}[0-9]{4}))$/;
                return (v == null || v.trim().length < 1) || re.test(v);
            },
            message: 'Provided phone number is invalid.'
        }
    },

    contact_email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, 'is invalid'],
        index: true,
        unique: true,
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
                required: true,
                min: [-180,"Less than allowed value"],
                max: [180, "More than allowed value"]
             },
             latitude:{
                type: Number,
                required: true,
                min: [-90, "Less than allowed value"],
                max: [90, "More than allowed value"]
             },
        //     required: true
         },

        // required: true
     },

     sub_accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: false
     }],

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

ClientSchema.plugin(uniqueValidator);
ClientSchema.methods.getHikeUpdateObject = function(){
    return {
        first_name: this.full_name.split(' ')[0],
        last_name: this.full_name.split(' ')[1],
        phone: this.contact_no,
        email: this.contact_email
    }
}

module.exports = mongoose.model('customers', ClientSchema);



/** this ends this file
 * server/models/clients
 **/

 