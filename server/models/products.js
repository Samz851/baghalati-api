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
const mongoose_fuzzy_searching = require("mongoose-fuzzy");
const { Schema }  = mongoose;

const productSchema = new Schema(
    {
        parentId:{type: String},
        name:{type: String, required: true},
        name_eng: {type: String}, 
        description:{type: String},
        sku:{ type: Number, required: true, unique: true },
        primary_image:{type: String},
        brand_name:{type: String, required: true},
        brand_name_eng: {type: String},
        supplier_code:{type: String},
        sales_code:{type: String},
        purchase_code:{type: String},
        barcode: {type: Number},
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

productSchema.plugin(mongoose_fuzzy_searching, {
    fields: ["name", "name_eng"]
});

module.exports = mongoose.model('products', productSchema);

/** this ends this file
* server/models/products
**/
