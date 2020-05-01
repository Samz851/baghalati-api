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
const { Schema } = mongoose;

const OrderSchema = new Schema({

    customer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true},

    checkout_items: [
        { 
            quantity: {type: Number},
            item: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            price: {type: mongoose.Schema.Types.Decimal128}
        }
    ],

    amount_total: { type: mongoose.Schema.Types.Decimal128,  required: true},
    
    delivery_time: { type: String },
    delivery_address: { type: String },
    tax_ded: { type: mongoose.Schema.Types.Decimal128, required: false, description: "tax deduction from total_amount"},
    status: { type: String, required: true}

}, {
    timestamps: true,
    autoIndex: true
});

module.exports = mongoose.model('orders', OrderSchema);