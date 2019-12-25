const uniqid = require('uniqid');
module.exports = {
    jwt: {
        secret: "e#03ltB",
        uniqid: function(){
            return uniqid('jwb-');
        }
    }
}