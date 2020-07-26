import Query from './query/query';
import database from '../common/database/database';
import  * as otpGenerator from "otp-generator"
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
export const sendOtp = (_body) => {
  return new Promise((resolve, reject) => {
      const query = {
          name: 'add-email-otp',
          text: Query.insertEmailOtp,
          values: [_body,otp],
      }
      database().query(query, (error, results) => {
          if (error) {
              reject({ code: 400, message: "Failed. Please try again.", data:  [_body,otp] });
              return;
          }
          resolve({ code: 200, message: "Email and otp has added to database successfully" });
          const subject="Your OTP is"
          sendMail(_body, subject, otp, function(err, data) {
                if (err) {
                  reject({ code: 400, message: "Failed. Please try again.", data:  [_body,otp] });
                  return;
                }
                console.log('Email sent!!!');
                resolve({ code: 201, message: "OTP  has sent to your email successfully", data: [_body, otp] });
            });
      })
  })
}
