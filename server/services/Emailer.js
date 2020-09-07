const api_key = 'key-19a844f86e8b94e96832db4268d400dd';
// const domain = 'mg.jubnawebaith.com';
const domain = 'mg.samiscoding.com';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports =  async (data) => {
   // Turn the mailgun-js send function into a promise
   return new Promise((resolve, reject) => {
      return mailgun.messages().send(data, (error, result) => {
         if (error) {
            console.log('Errored Email Markup!!!!');
            console.log(error);
            // winston.error(`Error sending ${data.subject}`, error);
            return reject(error);
         }
         return resolve(result);
      });
   })
}