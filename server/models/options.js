/**
 * Name: clients
 *
 * @author Samer Alotaibi
 *		  sam@samiscoding.com
 *
 *
 *
 * Description: Options data model
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

const OptionSchema = new Schema({
    option_value: {
        type: mongoose.Schema.Types.Mixed
    },
    type: {
        type: String
    }
}, {
    
    timestamps: true,
    autoIndex: true
});


module.exports = mongoose.model('options', OptionSchema);



/** this ends this file
 * server/models/clients
 **/

 