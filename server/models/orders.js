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
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            sale_price: {type: mongoose.Schema.Types.Decimal128}
        }
    ],

    amount_total: { type: mongoose.Schema.Types.Decimal128,  required: true},
    
    tax_ded: { type: mongoose.Schema.Types.Decimal128, required: true, description: "tax deduction from total_amount"}

})