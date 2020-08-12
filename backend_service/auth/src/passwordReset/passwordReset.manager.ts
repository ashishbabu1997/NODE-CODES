import * as jwt from 'jwt-simple';
import jwtConfig from '../config/config'
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
export const sendLink = (_body) => {
  return new Promise((resolve, reject) => {
    var payload = { email:_body.email}
    var secret = jwtConfig.jwtSecretKey
    var token = jwt.encode(payload, secret);
    const subject="Click on the link to reset your password"
          sendMail(_body.email, subject, "http://localhost:3000/email/"+token, function(err,data) {
                if (err) {
                  console.log("........Email ERROR:.........",err)
                  reject({ code: 400, message: "Cannot send email", data:{}});
                  return;
                }
                console.log('Email sent!!!');
                resolve({ code: 200, message: "Token  has sent to your email successfully", data:{} });
            });
          })

}
