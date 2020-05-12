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

ordersController.getActiveProducts = async (req, res) => {
    try{
        var orders = await Orders.find({
            status: 'received'
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

module.exports = ordersController;

/** this ends this file
* server/controllers/orders.controller
**/