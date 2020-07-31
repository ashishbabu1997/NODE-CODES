import Query from './query/query';
import database from '../common/database/database';
import {Promise} from 'es6-promise'
import * as passwordGenerator from 'generate-password'
import {sendMail} from '../middlewares/mailer'
import * as crypto from "crypto"
export const otpValidate = (_body) => {
   return new Promise((resolve, reject) => {
      const query = {
          name: 'validate-otp',
          text: Query.validateOtp,
          values: [_body.otp,_body.email],
      }
      database().query(query, (error, results) => {
          if (error) {
              console.log(error)
              return;
          }
          if(results.rowCount !=0)
          {
          const mailId=results.rows[0].email
          const password=passwordGenerator.generate({
            length: 10,
            numbers: true
        });
          var hashedPassword= crypto.createHash("sha256").update(password).digest("hex");
          const subject=" ELLOW LOGIN PASSWORD "
          const query = {
            name: 'store-encrypted-password',
            text: Query.storePassword,
            values: [hashedPassword,_body.otp],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error)
                return;
            }
          })
          sendMail(mailId, subject, "Your password is: "+password, function(err, data) {
            if (err) {
              console.log(error)
              return;
            }
            console.log('A password has send to your email !!!');
            });
          resolve({ code: 200, message: "OTP login successful", data:  [] });
          }
          else{
            reject({ code: 400, message: "Failed. Please try again.", data:  [] });

          }
      })
  })
}