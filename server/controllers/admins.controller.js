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

clientsController.clientAuthentication = async (req,res) =>{

    //TODO::
    //      Session management

    console.log(req.body)
    try{
        var user = await Clients.findOne({
                contact_email: req.body.contact_email
            }).exec();
        // console.log("User: "+ user);
        
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "The email does not exist"
            });
        }
        if (!Bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({
                success: false,
                message: "The password is invalid"
            });
        }
        //SAM prepare JWT
        var token = jwt.sign({
            ID: user._id, 
            name: user.full_name,
            dob: user.date_of_birth,
            phone: user.contact_no,
            email: user.contact_email,
            address: user.billing_address,
            sub_accounts: user.sub_accounts
        }, Config.jwt.secret);
        var decoded = jwt.verify(token, Config.jwt.secret);
        console.log(decoded);
        res.send({
            success: true,
            message: "The username and password combination is correct!",
            token: token,
            sid: Config.jwt.uniqid()
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

clientsController.getClient = async (req, res) => {
    const { id } = req.params;
    var user = await Clients.findOne({
        _id: id
    }).exec();
    // console.log("User: "+ user);

    if (!user) {
        return res.status(400).send({
            success: false,
            message: "The email does not exist"
        });
    }
    //SAM prepare JWT
    var token = jwt.sign({
        ID: user._id, 
        name: user.full_name,
        dob: user.date_of_birth,
        phone: user.contact_no,
        email: user.contact_email,
        address: user.billing_address,
        sub_accounts: user.sub_accounts
    }, Config.jwt.secret);
    var decoded = jwt.verify(token, Config.jwt.secret);
    console.log(decoded);
    res.send({
        success: true,
        message: "The username and password combination is correct!",
        token: token,
        sid: Config.jwt.uniqid()
    });
};

clientsController.pushPaymentCard = async (req, res) => {
    const payment_card = req.body;
    const { id } = req.params;

    await Clients.findById(id)
        .then((client) => {
            client.payment_cards.push(payment_card);
            client.save();
        }).catch(e => console.log(e))
        .then(
            res.json({ "status": "200" })
        );
};

clientsController.editPaymentCard = async (req, res) => {
    const { id } = req.params;
    const { idcard } = req.params;

    await Clients.findOneAndUpdate(
        { "_id": id, "payment_cards._id": idcard },
        { "$set": { "payment_cards.$": req.body } }
    )
        .then(doc => {
            res.json({ "status": "200" });
        })
        .catch(e => {
            console.log(e);
        });
};

clientsController.deletePaymentCard = async (req, res) => {
    const { idcard } = req.params;
    const { id } = req.params;

    await Clients.update(
        { _id: id },
        { $pull: { payment_cards: { _id: idcard } } },
        { safe: true }
    )
        .then((response) => {
            console.log(response);
        })
        .catch(e => console.log(e))
        .then(() => {
            res.json({ "status": "200" });
        });
};

clientsController.getPaymentCard = async (req, res) => {
    const { token } = req.params;
    try {
        let verified = await jwt.verify( token, Config.jwt.secret);
        if(verified){
            await Clients.findById(veriefied.id)
                    .then((client) => {
                        res.json({success: true, load: client.payment_cards})
                    }).catch(e => console.log(e));
        }
    }catch(err){
        throw err;
    }
}

clientsController.testUserAPI = function(req, res){
    res.json({success:true, message: 'User API working'});
}

module.exports = clientsController;

/** this ends this file
* server/controllers/clients.controller
**/
