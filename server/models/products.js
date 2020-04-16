/**
* Name: products
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: Product data model
*
* Requirements: mongoose
*
* @package
* @property
*
* @version 1.0
*/

const mongoose = require('mongoose');
const { Schema }  = mongoose;

const productSchema = new Schema(
    {
        parentId:{type: String},
        name:{type: String, required: true},
        description:{type: String, required: true},
        sku:{ type: Number, required: true },
        primary_image:{type: String},
        bran_name:{type: String, required: true},
        supplier_code:{type: String},
        sales_code:{type: String},
        purchase_code:{type: String},
        product_tags:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'tags',
                required: false
            }
        ],
        product_type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories',
                required: false
            }
        ],
        price: { 
            price_ex_tax: {type: mongoose.Schema.Types.Decimal128, required: true},
            tax_rate:{type: mongoose.Schema.Types.Decimal128, required: true},
            price_inc_tax:{type: mongoose.Schema.Types.Decimal128, required: true},
        },
        isActive:{type: Boolean},
        favorites: {
            type: Number
        }
    },
    {timestamps: true, autoIndex: true}
);



module.exports = mongoose.model('products', productSchema);

/** this ends this file
* server/models/products
**/
