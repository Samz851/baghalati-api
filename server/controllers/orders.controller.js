/**
* Name: orders.controller
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description: controller for orders
*
* Requirements: orders model
*
* @package
* @property
*
* @version 1.0
*/
const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");
const ordersController = {};
const Orders = require('../models/orders');
const Clients = require('../models/clients');
const Coupons = require('../models/coupons');
const Config = require('../../config');
const jwt = require('jsonwebtoken');
const https = require('axios');
const PushManager = require('../services/PushManager');

ordersController.getActiveProducts = async (req, res) => {
    try{
        var orders = await Orders.find({
            status: { "$ne": 'delivered' }
        }).populate('customer_id').populate('checkout_items.item').populate({
            path: 'checkout_items.item',
            populate: {
              path: 'item',
              model: 'products'
            },
        }).exec();
        orders.forEach((item) => {
            console.log(item.checkout_items)
        })
        console.log(orders);
        if(orders){
            res.json({success: true, data: orders})
        }else{
            res.json({success: false, data: 'EMPTY'})
        }
    }catch(error){
        throw error;
    }
}

ordersController.updateOrderStatus = async (req, res) => {
    const { id, status } = req.body;

    try{
        let order = await Orders.findById(id);
        if(order){
            order.status = status;
            try{
                order.save();
                PushManager.sendOrderNotification(order.device_id, status);
            }catch(er){
                throw er;
            }
        }
    }catch(error){
        throw error;
    }
}

ordersController.pushOrder = async (req, res) => {
    const { token } = req.body;
    let cart_items = [];
    var decoded = jwt.verify(token, Config.jwt.secret);
    decoded.cart.map((item, i) => {
        cart_items.push({
            item: mongoose.Types.ObjectId(item.item),
            quantity: item.quantity,
            price: item.price
        })
    })

    let user = await Clients.findOne({ _id: decoded.customer }).exec();
    // console.log(`ORDER ONE ADDRESS USER IS:::: ${decoded.address._id}`);
    user.billing_address.map(item => console.log(item._id));
    let add = await user.billing_address.find( ( o ) => {
        // console.log(`The Order address ID is: ${o._id} and user address ID is: ${decoded.address._id}`)
       return  o._id == decoded.address._id
    })
    // console.log(`the address is: ${add} `);

    //Prepare Order Obj
    let orderObj = {
        customer_id: mongoose.Types.ObjectId(decoded.customer),
        checkout_items: cart_items,
        amount_total: decoded.total,
        delivery_time: decoded.deliveryTime,
        delivery_address: add,
        status: decoded.status,
        device_id: decoded.device_id,
    }
    if(decoded.coupon){
        orderObj.coupon = mongoose.Types.ObjectId(decoded.coupon)
    }

    let order = new Orders(orderObj);
    try{
        let save = await order.save();
        let push_user_order = await Clients.update(
            {_id: decoded.customer},
            { $push: { orders: mongoose.Types.ObjectId(save._id) } }
        ).exec();
        if(orderObj.coupon){
            try{
                let cObj = await Coupons.update(
                    {_id: orderObj.coupon},
                    { $push: {used_customers: mongoose.Types.ObjectId(decoded.customer)}, $inc: {use_count: 1}}
                ).exec();
            }catch(e){
                console.log(e);
                throw e;
            }

        }
        try{
            let new_order = await Orders.findOne({
                                _id: mongoose.Types.ObjectId(save._id)
                            }).populate('customer_id').populate({
                                path: 'checkout_items.item',
                                populate: {
                                path: 'item',
                                model: 'products'
                                },
                            }).exec();
            try{
                PushManager.sendOrderNotification(order.device_id, order.status);
                console.log('EMITTING EVENT!!!!!!!!!!!!!!!!!!!!!!!!')
                let eventEmitter = req.app.get('eventEmitter');
                console.log(eventEmitter);
                eventEmitter.emit('order', new_order)
                res.json({success: true})
            }catch(error){
                throw error
            }

        }catch(err){
            throw err;
        }

    }catch(err){
        res.json({success: false, error: err});
    }
    // res.json({success: true, order: decoded})
}

ordersController.ordersFeed = async (req, res) => {
    let latestOrder;
    res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
      });

      let eventEmitter = req.app.get('eventEmitter');
      eventEmitter.on('order', function (data) {
          console.log('FEEDING NEW ORDERRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        res.write("event: new-order\n");
        res.write(`data: ${ JSON.stringify(data)} `);
        res.write("\n\n");
      })
}

ordersController.ordersByUser = async (req, res) => {
    const { userID } = req.query;

    try{
        let orders = await Orders.find({
            customer_id: mongoose.Types.ObjectId(userID)
        }).populate('checkout_items.item').exec();

        if(orders){
            res.json({success: true, data: orders})
        }else{
            res.json({success: false, data: 'EMPTY'})
        }
    }catch(error){
        res.json({success: false, data: 'EMPTY'})
    }


}

ordersController.orderDetails = async (req, res) => {
    const { id } = req.query;

    try{
        let orderDetails = await Orders.findOne({
            OrderId: id
        }).populate('customer_id').populate({
            path: 'checkout_items.item',
            populate: {
            path: 'item',
            model: 'products'
            },
        }).exec();

        if(orderDetails){
            res.json({success: true, order: orderDetails})
        }else{
            res.json({success: false, orderDetails: 'EMPTY'});
        }

    }catch(error){
        throw error
    }

}

module.exports = ordersController;

/** this ends this file
* server/controllers/orders.controller
**/