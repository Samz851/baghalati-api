/**
* Name: categories
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: Categories data model
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
		name: { type: String, unique: true, required: true },
		name_eng: { type: String },
		description: { type: String },
		description_ar: { type: String},
		isActive: { type: Boolean },
		id: { type: Number }
    },
    {timestamps: true, autoIndex: true}
);



module.exports = mongoose.model('categories', categorySchema);

/** this ends this file
* server/models/categories
**/
