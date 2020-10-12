import * as jwt from 'jwt-simple';
import jwtConfig from '../config/config'
import {Promise} from 'es6-promise'
import {sendMail} from '../middlewares/mailer'
import Query from './query/query';
import database from '../common/database/database';
import config from '../config/config'
export const sendLink = (_body) => {
  return new Promise((resolve, reject) => {
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
        var textFormat = config.text.firstLine.fontsize(3).bold() + config.nextLine +config.nextLine+ config.text.thirdLine.fontsize(3).bold() + config.nextLine  + link + config.nextLine+config.nextLine + config.text.fourthLine.fontsize(3).bold() + config.nextLine + config.text.fifthLine.fontsize(3).bold()
        sendMail(lowerEmail, subject,textFormat, function(err,data) {
                if (err) {
                  console.log("........Email ERROR:.........",err)
                  reject({ code: 400, message: "Cannot send email", data:{}});
                  return;
                }
                console.log('Email sent successfully');
                resolve({ code: 200, message: "A Link to reset your password has been sent to your email successfully", data:{} });
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
