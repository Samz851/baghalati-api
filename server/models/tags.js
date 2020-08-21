/**
* Name: tags
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: Tags data model
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

const tagSchema = new Schema(
    {
        name: { type:String, required: true },
        name_eng: { type: String },
        img: { type: String },
        id: { type: String}
    }
);



module.exports = mongoose.model('tags', tagSchema);

/** this ends this file
* server/models/tags
**/
