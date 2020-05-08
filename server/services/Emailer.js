const api_key = 'XXXXXXXXXXXXXXXXXXXXXXX';
const domain = 'www.mydomain.com';
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