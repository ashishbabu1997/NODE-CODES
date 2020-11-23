import * as jwt from 'jwt-simple';
import jwtConfig from '../config/config'
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
import Query from './query/query';
import database from '../common/database/database';
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import {readHTMLFile} from '../middlewares/htmlReader'



// FUNC. 
// Once when a user forgets his/her password, he clicks forgot forgot password button
// where a he has to enter his email. After submission , a reset password link is sent to his email.
export const sendLink = (_body) => {
  return new Promise((resolve, reject) => {
    // Checks whether the entered email is his/her own email.
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

        // Generates a token and stores the token on DB.
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

        // Sends the link with token attached at the end of the link.
        var link=_body.host+"/passwordset/"+token
        const subject="ellow.ai RESET PASSWORD LINK"
        readHTMLFile('src/emailTemplates/forgotPasswordText.html', function(err, html) {
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
