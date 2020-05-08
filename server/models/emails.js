
    var nodemailer = require("nodemailer");

    const domain = "https://mysterious-beach-59514.herokuapp.com/"
    let mailTransporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
            api_key: 'key-be742a5d437c8958e763f1a361003941',
            domain: 'sandboxd3612106dbc141b7a5134f0fddce769a.mailgun.org',
            user: 'postmaster@sandboxd3612106dbc141b7a5134f0fddce769a.mailgun.org',
            pass: '12345',
            secure: false,
        }
    });
    module.exports = {
    activationEmail: function(userToken, userEmail){
        link= domain+"verifyemail/"+userToken;
        mailOptions={
            to : userEmail,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        mailTransporter.sendMail(mailOptions, function(err, res){
            if(err){
                res.JSON({success: false, message: "error sending email"})
            }else{
                res.JSON({succes: true, message:"sent"});
            }
        });
    },
    resendUsername: function(email, user){
        mailOptions={
            to: email,
            subject: "Your Username at STDNT APP",
            html: "Hello, \n You have requested your username\nUsername:"+user.username
        }
        mailTransporter.sendMail(mailOptions, function(err, res){
            if(err) {
                res.JSON({success: false, message:"error sending email"})
            }else{
                res.JSON({success:true, message:"Username sent to your email"})
            }
        })
    },

    resendPassword: function(email, name, token){
        var url= domain+"resetpassword/"+token;
        mailOptions={
            to: email,
            subject: "Reset Your Password at STDNT APP",
            html: "Hello "+name+" You have requested to reset your password, please follow the link below\n"+url
        }
        mailTransporter.sendMail(mailOptions, function(err, res){
            if(err) throw err;
            res.json({success: true, message: "Password Link Sent"})
        })
    }


    
    
}