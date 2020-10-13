import Query from './query/query';
import database from '../common/database/database';
import  * as otpGenerator from "otp-generator"
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
import config from '../config/config'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};
const subject="Your OTP is";
export const sendOtp = (_body) => {
  return new Promise((resolve, reject) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
    var hai="haaaaai"
    var ttFormat=+hai.fontsize(3).bold().charAt(0).toUpperCase()+config.text.firstLine+config.nextLine+config.nextLine+config.text.thirdLine+config.nextLine+otp+config.nextLine+config.text.fourthLine
    var textFormat=ttFormat.fontcolor("black")

    const checkStatusQuery = {
      name: 'checkStatus',
      text: Query.checkStatus,
      values: [_body]
  }
  console.log("Entering DB conectivity")
  console.log(__dirname)
  database().query(checkStatusQuery, (error, results) => {
      if (error) {
        console.log(error)
          reject({ code: 400, message: "Failed. Please try again.", data:  {} });
          return;
        }
        if (results.rowCount == 0)
         {
          const Time = Math.floor(Date.now()/1000);
           const insertQuery = {
             name: 'add-email-otp',
             text: Query.insertEmailOtp,
             values: [_body,otp,Time],
           }
           readHTMLFile('emailTemplates/otpmail.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                 otp: otp
            };
            var htmlToSend = template(replacements);
           database().query(insertQuery, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Error in database connection.", data:{} });
                return;
            }
            sendMail(_body,subject,htmlToSend, function(err,data) {
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
         }
        else
        {
          if (results.rows[0].status == true)
          {
              reject({ code: 400, message: "You are a registered user", data:  {} });
              return;
          }
          const currentTime = Math.floor(Date.now()/1000);
          const query = {
            name: 'add-email-otp',
            text: Query.updateEmailOtp,
            values: [_body,otp,currentTime],
          }
          database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Error in database connection.", data:{} });
                return;
            }
            sendMail(_body, subject, textFormat, function(err,data) {
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
