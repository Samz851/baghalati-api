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
const Config = require('../../config');
const jwt = require('jsonwebtoken');
const https = require('axios');
const PushManager = require('../services/PushManager');
const events = require('events');
const eventEmitter = new events.EventEmitter();

ordersController.getActiveProducts = async (req, res) => {
    try{
        var orders = await Orders.find({
            status: { "$ne": 'delivered' }
        }).populate('customer_id').populate({
            path: 'checkout_items.item',
            populate: {
              path: 'item',
              model: 'products'
            },
        }).exec();
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
    console.log('THE REQ BODY IS');
    console.log(req.body);
    var decoded = jwt.verify(token, Config.jwt.secret);
    decoded.cart.map((item, i) => {
        cart_items.push({
            item: mongoose.Types.ObjectId(item.item),
            quantity: item.quantity,
            price: item.price
        })
    })
    //Prepare Order Obj
    let orderObj = {
        customer_id: mongoose.Types.ObjectId(decoded.customer),
        checkout_items: cart_items,
        amount_total: decoded.total,
        delivery_time: decoded.deliveryTime,
        delivery_address: decoded.address._id,
        status: decoded.status,
        device_id: decoded.device_id
    }

    let order = new Orders(orderObj);
    try{
        let save = await order.save();
        try{
            let order = await Orders.findOne({
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

                eventEmitter.emit('new-order', save)
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

module.exports = ordersController;

/** this ends this file
* server/controllers/orders.controller
**/