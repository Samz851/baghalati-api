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
                message: 'Login Failed'
            })
        }
        if (!Bcrypt.compareSync(password, user.password)) {
            return res.status(400).send({
                success: false,
                message: "The password is invalid"
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


module.exports = adminsController;

/** this ends this file
* server/controllers/clients.controller
**/