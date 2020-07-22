import Query from './query/query';
import nodemailer from "nodemailer";
import database from '../common/database/database';
import * as get_otp from "./otpGenerator"
import {Promise} from 'es6-promise'

const otp=get_otp.otp
export const addDetails = (_body) => {
  return new Promise((resolve, reject) => {
      const query = {
          name: 'add-email-otp',
          text: Query.createUser,
          values: _body,otp,
      }
      database().query(query, (error, results) => {
          if (error) {
              reject({ code: 400, message: "Failed. Please try again.", data:  [_body,otp] });
              return;
          }
          console.log("Email Send")
          resolve({ code: 200, message: "Email and otp has added to database successfully", data:  [_body,otp] });
      })
  })
}
export const mailer = (_body) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
                  service:"gmail",
                  auth: {
                    user: 'ashish.babu@ellow.ai',
                    pass: 'Ash1526$'
                  }
                });
                var mailOptions = {
                  from: 'ashish.babu@ellow.ai',
                  to: _body,
                  subject: 'Your Ellow.AI otp is here',
                  text:otp
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    reject({ code: 400, message: "Failed. Please try again.", data:  [_body,otp] });
                    return;
                  } else {
                    resolve({ code: 200, message: "OTP has send to your email successfully", data:  [_body,otp] });
                    console.log('OTP has send successfully: ' + info.response);
                  }
                });
      
              })
}        

