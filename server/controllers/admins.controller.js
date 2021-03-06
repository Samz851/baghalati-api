/**
* Name: clients.controller
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description: controller for clients
*
* Requirements: clients model
*
* @package
* @property
*
* @version 1.0
*/
const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");
const adminsController = {};
const Admins = require('../models/admins');
const Options = require('../models/options');
const Drivers = require('../models/drivers');
const Coupons = require('../models/coupons');
const Config = require('../../config');
const jwt = require('jsonwebtoken');
const https = require('axios');
const { v1 } = require('uuid');



adminsController.register = async (req, res) => {
   const { email, password, secret, phone, name, username, userType } = req.body;

   if(secret == 'Freaky'){
       let user;
       let encrypt_password = Bcrypt.hashSync(password, 10);
       if(userType == 'admin'){
        let admin_id = mongoose.Types.ObjectId();
        user = new Admins({admin_id: admin_id, email: email, username: username, password: encrypt_password, phone: phone, name: name});
       }
       if(userType == 'driver'){
           let driver_id = mongoose.Types.ObjectId();
           user = new Drivers({driver_id: driver_id, email: email, username: username, password: encrypt_password, phone: phone, name: name});
       }
       try{
        await user.save();
        res.json({success: true, message: 'registration successful'})
       }catch(e){
        res.json({success: false, message: 'registration failed'});
       }

   }
   
}

adminsController.login = async (req, res) => {
    const { username, password, secret, type} = req.body;

    if(secret == 'Freaky'){
        let user = type == 'admin' ? await Admins.findOne({username: username}).exec() : await Drivers.findOne({username: username}).exec();
        if(!user){
            return res.status(400).send({
                success: false,
                message: 'The Email is invalid'
            })
        }
        if (!Bcrypt.compareSync(password, user.password)) {
            return res.status(400).send({
                success: false,
                message: "The Password is invalid"
            });
        }else{
            user.session_id = v1();
            let user_is_connected;
            try{
                let products = await https.get('https://api.hikeup.com/api/v1/products/get_all?page_size=1&Skip_count=0', {headers: {
                    'Authorization': 'Bearer ' + user.pos_data.access_token
                }});
                user_is_connected = true;

            }catch(e){
                user_is_connected = user.is_connected = false;
            }

            let success = await user.save();
            if(success){
                res.json({success: true, session: user.session_id, store_status: user_is_connected, type: type});
            }else{
                res.json({success: false, message: 'Failed to generate session token'})
            }
        }

        
    }

}

adminsController.verifySID = async (req, res) => {
    const { sid } = req.body;
    let user = await Admins.findOne({session_id: sid}).exec();
    if(!user){
        return res.status(400).send({
            success: false,
            message: 'Login Failed'
        })
    }
    if (user.session_id !== sid ) {
        return res.status(400).send({
            success: false,
            message: "The SID is invalid"
        });
    }else{
        user.session_id = v1();
        let user_is_connected;
        try{
            let products = await https.get('https://api.hikeup.com/api/v1/products/get_all?page_size=1&Skip_count=0', {headers: {
                'Authorization': 'Bearer ' + user.pos_data.access_token
            }});
            user_is_connected = user.is_connected = true;

        }catch(e){
            user_is_connected = user.is_connected = false;
        }
        let success = await user.save();
        if(success){
            res.json({success: true, session: user.session_id, store_status: user_is_connected});
        }else{
            res.json({success: false, message: 'Failed to generate session token'})
        }
    }

}

adminsController.pushBanners = async (req, res) => {
    let optionsObj = {
        path: 'https://api.jubnawebaith.com/' + req.file.path.replace('server/', ''),
        name: req.file.originalname
    };
    try{
        let saveOptions = new Options({option_value: optionsObj, type: 'banner'});
        let saved = await saveOptions.save();
        res.json({success: true, banners: saved._doc})
    }catch(error){
        console.log(error);
    }
}

adminsController.getBanners = async (req, res) => {
    let banners = await Options.find({type: 'banner'}, null,{sort: {'createdAt': -1}, limit: 3});
    if(banners.length > 0){
        res.json({success: true, banners: banners});
    }else{
        res.json({success: false, message: 'Failed to fetch banners', model: banners})
    }
}

adminsController.deleteBanners = async (req, res) => {
    const { id } = req.query;
    let op = await Options.findByIdAndDelete(id);
    if(op){
        res.json({success: true});
    }else{
        res.json({success: false})
    }
}

adminsController.getDeliveryFee = async (req, res) => {
    try{
        let option = await Options.findOne({type: 'delivery_fee'});
        res.json({success: true, option: option});
    }catch(error){
        res.json({success: false, error: error});
    }
}
 
adminsController.updateDeliveryFee = async (req, res) => {
    console.log('REQ BODY!!!');
    console.log(req.body)
    const { id, fee } = req.body;
    console.log('GOT A HIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + id);
    try{
        let saveOptions = await Options.findByIdAndUpdate({_id: id}, {option_value: fee}).exec();
        res.json({success: true, result: saveOptions});
    }catch(error){
        console.log(error);
        res.json({success: false, error: error})
    }

}

adminsController.getUsers = async (req, res) => {
    let users = [];
    let drivers = await Drivers.find({});
    drivers.forEach( (driver) => {
        let user_drv = {...driver._doc};
        user_drv.userType = 'driver';
        users.push(user_drv);
    });
    let admins = await Admins.find({});
    admins.forEach( (admin) => {
        let user_adm = {...admin._doc};
        user_adm.userType = 'admin';
        users.push(user_adm)
    })
    res.json({users: users, success: true});
}

adminsController.deleteUser = async (req, res) => {
    console.log('HITTTT');
    const { userID, secret } = req.body;
    console.log(`${userID} :: ${secret}`);
    if(userID && secret == 'Freaky'){
        try{
            let user = await Drivers.deleteOne({_id: userID});
            res.json({success: true})
        }catch(e){
            res.json({success: false});
            throw e;
        }

    }
}

adminsController.fetchCoupons = async (req, res) => {
    let { sid } = req.params;
    let user = await Admins.findOne({session_id: sid}).exec();
    if(user){
        let couponsArr = [];
        let coupons = await Coupons.find({});
        if(coupons){
            coupons.forEach( (coupon) =>{
                let record = {...coupon._doc}
                //Compare two dates
                if(Date.now() > new Date(record.end_datetime)){
                    record.status = 'expired';
                }else{
                    record.status = 'active';
                }
                couponsArr.push(record);
            });
        }
        res.json({success: true, data: couponsArr});
    }else{
        res.json({success: false, message: 'Failed fetching coupons!'});
    }
}

adminsController.createCoupon = async(req, res) => {
    const {SID, ...coupon} = req.body;
    coupon.use_count = 0;
    let user = await Admins.findOne({session_id: SID}).exec();
    if(user){
        let new_coupon = new Coupons(coupon);
        try{
            await new_coupon.save();
            res.json({success: true, message: 'successful'})
        }catch(e){
            res.json({success: false, message: 'failed'});
        }
    }
}

adminsController.revokeCoupon = async(req, res) => {
    const {code, sid} = req.query;

    let user = await Admins.findOne({session_id: sid}).exec();
    if(user){
        try{
            let deleting = await Coupons.deleteOne({_id: code});
            res.json({success: true});
        }catch(e){
            res.json({success: false});
        }
    }
}

module.exports = adminsController;

/** this ends this file
* server/controllers/clients.controller
**/
