import Query from './query/query';
import database from '../common/database/database';
import  * as otpGenerator from "otp-generator"
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
const subject="Your OTP is";
export const sendOtp = (_body) => {
  return new Promise((resolve, reject) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
    const checkStatusQuery = {
      name: 'checkStatus',
      text: Query.checkStatus,
      values: [_body]
  }
  database().query(checkStatusQuery, (error, results) => {
      if (error) {
          reject({ code: 400, message: "Failed. Please try again.", data:  {} });
          return;
        }
        if (results.rowCount == 0)
         {
           const insertQuery = {
             name: 'add-email-otp',
             text: Query.insertEmailOtp,
             values: [_body,otp],
           }
           database().query(insertQuery, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Error in database connection.", data:{} });
                return;
            }
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
         }
        else
        {
          if (results.rows[0].status == true)
          {
              reject({ code: 400, message: "You are a registered user", data:  {} });
              return;
          }
          const query = {
            name: 'add-email-otp',
            text: Query.updateEmailOtp,
            values: [_body,otp],
          }
          database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Error in database connection.", data:{} });
                return;
            }
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
        }
      })
  })
}
