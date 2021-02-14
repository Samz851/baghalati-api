/**
* Name: products
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: Coupon data model
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

const couponSchema = new Schema(
    {
        code:{type: String, required: true},
        start_datetime: {type: Date, required: true}, 
        end_datetime:{type: Date, required: true},
        use_count:{type: Number},
        rate:{type: Number, required: true},
        used_customers:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'customers',
                required: false
            }
        ],
        name: {type: String, required: true},
        coupon_type:{type: String, required: true}
    },
    {timestamps: true, autoIndex: true}
);


module.exports = mongoose.model('coupons', couponSchema);

/** this ends this file
* server/models/products
**/
