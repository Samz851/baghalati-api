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
const Config = require('../../config');
const jwt = require('jsonwebtoken');
const https = require('axios');
const { v1 } = require('uuid');



adminsController.register = async (req, res) => {
   const { email, password, secret } = req.body;

   if(secret == 'Freaky'){
       let admin_id = mongoose.Types.ObjectId();
       let encrypt_password = Bcrypt.hashSync(password, 10);
       let username = email.split('@')[0];
       const admin = new Admins({admin_id: admin_id, email: email, username: username, password: encrypt_password});
       let user = await admin.save();
       res.json({success: true, message: 'registration successful'})

   }
   
}

adminsController.login = async (req, res) => {
    const { username, password, secret} = req.body;

    if(secret == 'Freaky'){
        let user = await Admins.findOne({username: username}).exec();
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
            let success = await user.save();
            if(success){
                res.json({success: true, session: user.session_id});
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
        let success = await user.save();
        if(success){
            res.json({success: true, session: user.session_id});
        }else{
            res.json({success: false, message: 'Failed to generate session token'})
        }
    }

}

adminsController.pushBanners = async (req, res) => {
    let optionsObj = {
        path: req.file.path,
        name: req.file.originalname
    };
    try{
        let saveOptions = new Options({option_value: optionsObj, type: 'banner'});
        let saved = await saveOptions.save();
        res.json({success: true, option: saved._doc})
    }catch(error){
        console.log(error);
    }
}

adminsController.getBanners = async (req, res) => {
    let banners = await Options.find({type: 'banner'}, null,{sort: {'createdAt': -1}, limit: 3});
    if(banners){
        res.json({success: true, banners: banners});
    }else{
        res.json({success: false, message: 'Failed to fetch banners'})
    }
}

module.exports = adminsController;

/** this ends this file
* server/controllers/clients.controller
**/
