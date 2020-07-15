import Query from './query/query';
import nodemailer from "nodemailer";
import database from '../common/database/database';
import * as get_otp from "./otp_generator"
const otp=get_otp.otp
export const addDetails = (_body) => {
  return new Promise((resolve, reject) => {
      const query = {
          name: 'add-email-otp',
          text: Query.createUser,
          values: [_body.email,otp],
      }
      database().query(query, (error, results) => {
          if (error) {
              reject({ code: 400, message: "Failed. Please try again.", data:  [_body.email,otp] });
              return;
          }
          resolve({ code: 200, message: "Email and otp has added to database successfully", data:  [_body.email,otp] });
      })
  })
}
export const mailer = (_body) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'ashish.b@ellow.ai',
                    pass: 'Ash1526$'
                  }
                });
                var mailOptions = {
                  from: 'ashish.b@ellow.ai',
                  to: [_body.email],
                  subject: 'Your Ellow.AI otp is here',
                  text:otp
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('OTP has send successfully: ' + info.response);
                  }
                });
      
  })
}        

