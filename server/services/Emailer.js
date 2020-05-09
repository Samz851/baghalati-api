const api_key = 'key-be742a5d437c8958e763f1a361003941';
const domain = 'mg.jubnawebaith.com';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

export default async (data) => {
   // Turn the mailgun-js send function into a promise
   return new Promise((resolve, reject) => {
      return mailgun.messages().send(data, (error, result) => {
         if (error) {
            // winston.error(`Error sending ${data.subject}`, error);
            return reject(error);
         }
         return resolve(result);
      });
   })
}