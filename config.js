const uniqid = require('uniqid');
module.exports = {
    jwt: {
        secret: "e#03ltB",
        uniqid: function(){
            return uniqid('jwb-');
        }
    },
    POS: {
        app_id: "baghalati-1be96a0e45",
        app_secret: "452e2c42d33e48c9b755bdae9991ce46",
        app_redirect_uri: "http://samiscoding.com/redirects",
        temp_code: "e92f52ce3166455c96f519aa98c706f903314c7a84f84ba9b72451babe924996"
    }
}