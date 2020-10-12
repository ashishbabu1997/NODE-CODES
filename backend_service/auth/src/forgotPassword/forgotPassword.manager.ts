import * as jwt from 'jwt-simple';
import jwtConfig from '../config/config'
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
import Query from './query/query';
import database from '../common/database/database';
import config from '../config/config'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
export const sendLink = (_body) => {
  return new Promise((resolve, reject) => {
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
    var lowerEmail=_body.email.toLowerCase()
    const checkEMail = {
      name: 'check-email',
      text: Query.checkEmail,
      values: [lowerEmail]
    }
    database().query(checkEMail, (error, results) => {
      if (error) {
          reject({ code: 400, message: "Database connection Error !!!!", data:  {} });
          return;
        }
      else if(results.rowCount==1)
      {
        var payload = { email:lowerEmail,
                        userRoleId:results.rows[0].userRoleId
                      }
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
        var link=_body.host+"/passwordset/"+token
        const subject="ellow.ai RESET PASSWORD LINK"
        readHTMLFile('emailTemplates/forgotPasswordText.html', function(err, html) {
          var template = handlebars.compile(html);
          var replacements = {
               resetLink: link
          };
          var htmlToSend = template(replacements);
        sendMail(lowerEmail, subject,htmlToSend, function(err,data) {
                if (err) {
                  console.log("........Email ERROR:.........",err)
                  reject({ code: 400, message: "Cannot send email", data:{}});
                  return;
                }
                console.log('Email sent successfully');
                resolve({ code: 200, message: "A Link to reset your password has been sent to your email successfully", data:{} });
            });
          })
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
