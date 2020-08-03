import Query from './query/query';
import database from '../common/database/database';
import  * as otpGenerator from "otp-generator"
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
export const sendOtp = (_body) => {
  return new Promise((resolve, reject) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
    console.log(_body)
    const checkQuery = {
      name: 'checkEmail',
      text: Query.checkEmail,
      values: [_body],
  }
  database().query(checkQuery, (error, results) => {
      if (error) {
          reject({ code: 400, message: "Failed. Please try again.", data:  {} });
          return;
        }
        if (results.rowCount!=0)
        {
          reject({ code: 400, message: "Email Already in use.", data:  {} });
          return;
        }
      const query = {
          name: 'add-email-otp',
          text: Query.insertEmailOtp,
          values: [_body,otp],
      }
      database().query(query, (error, results) => {
          if (error) {
              reject({ code: 400, message: "Error in database connection.", data:{} });
              return;
          }
          const subject="Your OTP is";
          sendMail(_body, subject, otp, function(err,data) {
                if (err) {
                  console.log("........Email ERROR:.........",err)
                  reject({ code: 400, message: "Cannot send email", data:{}});
                  return;
                }
                console.log('Email sent!!!');
                resolve({ code: 200, message: "OTP  has sent to your email successfully", data:{} });
            });
          })
      })
  })

}
