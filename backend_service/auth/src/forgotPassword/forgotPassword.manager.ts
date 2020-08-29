import * as jwt from 'jwt-simple';
import jwtConfig from '../config/config'
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
import Query from './query/query';
import database from '../common/database/database';
export const sendLink = (_body) => {
  return new Promise((resolve, reject) => {
    const checkEMail = {
      name: 'check-email',
      text: Query.checkEmail,
      values: [_body.email]
    }
    database().query(checkEMail, (error, results) => {
      if (error) {
          reject({ code: 400, message: "Database connection Error !!!!", data:  {} });
          return;
        }
      else if(results.rowCount==1)
      {
        var payload = { email:_body.email}
        var secret = jwtConfig.jwtSecretKey
        var token = jwt.encode(payload, secret);
        const insertTokenQuery = {
          name: 'insertToken',
          text: Query.insertToken,
          values: [_body.email,token]
        }
        database().query(insertTokenQuery, (error, results) => {
        if (error) {
          reject({ code: 400, message: "Database connection Error !!!!", data:  {} });
          return;
        }
        var link="http://localhost:3000/passwordset/"+token
        const subject="ellow.ai RESET PASSWORD LINK"
        const text="Click on the link to reset your password : "
        sendMail(_body.email, subject,text+link, function(err,data) {
                if (err) {
                  console.log("........Email ERROR:.........",err)
                  reject({ code: 400, message: "Cannot send email", data:{}});
                  return;
                }
                console.log('Email sent successfully');
                resolve({ code: 200, message: "Token  has sent to your email successfully", data:{} });
            });
          })
      }
      else
      {
        reject({ code: 400, message: "Email does'nt Exist", data:{}});
        return;

      }
    })

  })
}
