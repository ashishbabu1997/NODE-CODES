import Query from './query/query';
import nodemailer from "nodemailer"
import database from '../common/database/database';
 export const addDetails = (email,otp) => {
     return new Promise((resolve, reject) => {
         const query = {
             name: 'add-email-otp',
             text: Query.createUser,
             values: email,otp,
         }
         database().query(query, (error, results) => {
-            console.log(results, error)
             if (error) {
                 reject({ code: 400, message: "Failed. Please try again.", data: {} });
                 return;
                }
                database().query(query, (error, results) => {
       -            console.log(results, error)
                    if (error) {
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });
                        return;
            });
        
    export const mailer = (email,otp) => {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'yourmail@gmail.com',
                  pass: 'password'
                }
              });
              var mailOptions = {
                from: 'yourmail@gmail.com',
                to: email,
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
            }
        }

