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
const clientsController = {};
const Clients = require('../models/clients');
const Config = require('../../config');
const jwt = require('jsonwebtoken');
const https = require('axios');

clientsController.getClients = async (req, res) => {
    const clients = await Clients.find();
    res.json(clients);
};

clientsController.createClient = async (req, res) => {
    console.log(req.body);
    req.body.customer_id = mongoose.Types.ObjectId();
    if (req.body.password){
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
    }
    const client = new Clients(req.body);
    try{
        let user = await client.save();
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
            message: "Registration successful",
            token: token,
            sid: Config.jwt.uniqid()
        });
        res.json({ "success": true, user: {_id: user._id}});
    }
    catch(err){
        res.json({"success": false, "message": err})
    }
};

clientsController.editClientSimpleData = async (req, res) => {
    const { id } = req.params;
    
    let cliente = await Clients.findById(id);


   cliente.full_name = req.body.full_name;
   cliente.contact_email = cliente.contact_email;
   cliente.billing_address = cliente.billing_address;
   cliente.contact_no = cliente.contact_no;

    await cliente.save()
        .then( () => {
            res.json({ "status": "200"});
        } );

};

clientsController.editEmailsData = async (req, res) => {
    /*
        model for req: 
            {
                "verified": false,
                "email": "correo@pedroruizhidalgo.es"
            }
    */
    const { id } = req.params;
    const { email }  = req.params;
   
    await Clients.findOneAndUpdate(
        {
            "_id": id,
            "contact_email._id": email
        },
        { '$set': {
            'contact_email.$': req.body
        }})
            .then( doc => {
                res.json({"status": "200"});
            })
            .catch( e => {
                console.log(e);
            });
};

clientsController.editAddressData = async (req, res) => {

    /*
        model for req: 
        {
            "contact": "contact", no required
            "street": "street", required
            "city": "city", required
            "province": "province", required
            "zip": "zip", required
        }
    */

    const { id } = req.params;
    const { address } = req.params;

    await Clients.findOneAndUpdate(
        {
            "_id": id,
            "billing_address._id": address
        },
        {
            "$set": {
                "billing_address.$": req.body
            }
        }
    )
        .then(doc => {
            res.json({ "status": "200" });
        })
        .catch(e => {
            console.log(e);
        });
};

clientsController.editPhonesData = async (req, res) => {
    /*
        model for phones
    {
        phoneType: { type: String, required: false },
        prefix: { type: String, required: false},
        number: { type: String, required: true },
        subfix: { type: String, requied: false},
        memo: { type: String, required: false, description: "use if you need other data" },

        required: false
    }
    */

    const { id } = req.params;
    const { phone } = req.params;

    await Clients.findOneAndUpdate(
        {
            "_id": id,
            "contact_no._id": phone
        },
        {
            "$set": {
                "contact_no.$": req.body
            }
        }
    )
        .then(doc => {
            res.json({ "status": "200" });
        })
        .catch(e => {
            console.log(e);
        });

};

// Redundant Push block start

clientsController.pushEmails = async (req, res) => {
    const newEmails = req.body;
    const { id } = req.params;


    await Clients.findById(id)
        .then ( (client) => {
            client.emails.push(newEmails);
            client.save();
        }).catch ( (e) => {
            console.log(e);
        }).then (
            res.json({"status":"200"})
        );
    
};

clientsController.pushAddresses = async (req, res) => {
    const newAddresses = req.body;
    const { id } = req.params;
    await Clients.update(
        { _id: id },
        { $push: { billing_address: newAddresses } }
    ).then( (result) => {
            if(result.nModified > 0){
                res.json({success: true, message: 'address saved'})
            }else{
                res.json({success: false, message: 'failed to save address', error: e})
            }
        }).catch( e => res.json({success: false, message: 'failed to save address', error: e}));
};

clientsController.pushPhones = async (req, res) => {
    const newPhones = req.body;
    const { id } = req.params;

    await Clients.findById(id)
        .then((client) => {
            client.phones.push(newPhones);
            client.save();
        }).catch(e => console.log(e)).then(
            res.json({ "status": "200" })
        );
};

// Redundant Push block end

clientsController.deleteEmails = async (req, res) => {
    const { email } = req.params;
    const { id } = req.params;

    await Clients.update(
        {_id: id},
        { $pull: {emails: {_id: email} } },
        { safe: true}
    )
        .then( (client) => {
            console.log(client);
        })
        .catch( e => console.log(e))
        .then( () => {
            res.json({"status": "200"});
        })
};

clientsController.deleteAddresses = async (req, res) => {
    const { address } = req.params;
    const { id } = req.params;

    await Clients.update(
        {_id: id},
        { $pull: {billing_address: {_id: address} } },
        {safe: true}
    )
        .then( (result) => {
            if(result.nModified > 0){
                res.json({success: true, message: 'address deleted'})
            }else{
                res.json({success: false, message: 'failed to delete address', error: e})
            }
        }).catch( e => res.json({success: false, message: 'failed to delete address', error: e}));
};

clientsController.deletePhones = async (req, res) => {
    const { phone } = req.params;
    const { id } = req.params;

    await Clients.update(
        {_id: id },
        { $pull: {phones: {_id: phone} } },
        { safe:true }
    )
        .then( ( response ) => {
            console.log(response);
        })
        .catch( e => console.log(e))
        .then( () => {
            res.json({"status": "200"});
        });
        
};

clientsController.deleteClient = async (req, res) => {
    const { id } = req.params;

    await Clients.findByIdAndRemove(id)
        .then( () => {
            res.json({"status":"200"});
        });
};

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
