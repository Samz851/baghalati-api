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

const categorySchema = new Schema(
    {
        name: {
			type: String,
			unique: true,
			required: true,
		},
		description:{
			type: String,
			required: true,
		},
		products: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'products',
			unique: true,
		}]
    },
    {timestamps: true, autoIndex: true}
);



module.exports = mongoose.model('categories', categorySchema);

/** this ends this file
* server/models/categories
**/
