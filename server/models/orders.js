/**
* Name: orders
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: data model for orders
*
* Requirements: mongoose
*
* @package
* @property
*
* @version 1.0
*/

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { Schema } = mongoose;
var db = mongoose.connection;

autoIncrement.initialize(db);

const OrderSchema = new Schema({

    customer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true},
    device_id: { type: String },

    checkout_items: [
        { 
            quantity: {type: Number},
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            price: {type: mongoose.Schema.Types.Decimal128}
        }
    ],

    amount_total: { type: mongoose.Schema.Types.Decimal128,  required: true},
    
    delivery_time: { type: String },
    delivery_address: { address:{
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
        } 
    },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'coupons'},
    tax_ded: { type: mongoose.Schema.Types.Decimal128, required: false, description: "tax deduction from total_amount"},
    status: { type: String, required: true}

}, {
    timestamps: true,
    autoIndex: true
});
OrderSchema.plugin(autoIncrement.plugin, { model: 'orders', field: 'OrderId', startAt: 9660, })
module.exports = mongoose.model('orders', OrderSchema);