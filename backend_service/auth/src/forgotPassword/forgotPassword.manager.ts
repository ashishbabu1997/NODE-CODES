import * as jwt from 'jwt-simple';
import jwtConfig from '../config/config'
import Query from './query/query';
import database from '../common/database/database';
import * as emailClient from '../emailService/emailService';



// FUNC. 
// Once when a user forgets his/her password, he clicks forgot forgot password button
// where a he has to enter his email. After submission , a reset password link is sent to his email.
export const sendLink = (_body) => {
  return new Promise((resolve, reject) => {
    // Checks whether the entered email is his/her own email.
    (async () => {
      const client = await database().connect()
      try {
          var link
          var lowerEmail=_body.email.toLowerCase()
          console.log(lowerEmail)
          const checkEMail = {
              name: 'check-email',
              text: Query.checkEmail,
              values: [lowerEmail]
          }
          var results=await client.query(checkEMail);
          if(results.rowCount==1)
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
            await client.query(insertTokenQuery); 
            // Sends the link with token attached at the end of the link.
            if (_body.type=='generic')
            {
              link=_body.host+"/passwordset/"+token
            }
            else{
              link=_body.host+"/passwordSet/"+token
            }
            const subject="ellow.io Reset Password Link"
            let path = 'src/emailTemplates/forgotPasswordText.html';
            let replacements =  {
                resetLink: link
              };
              if(lowerEmail!=null || '' || undefined)
              {
                await emailClient.emailManager(lowerEmail,subject,path,replacements);
              }
              else
              {
                  console.log("Email Recipient is empty")
              } 
              resolve({ code: 200, message: "Link has sent to the email successfully", data:{}});

        }
        else
        {
          reject({ code: 400, message: "Provided email is not registered with ellow.io ! Please signup to continue", data:{}});
          return;

        }
      } catch (e) {
        console.log(e)
        await client.query('ROLLBACK')
        reject({ code: 400, message: "Failed. Please try again.", data: e.message });
    }
})().catch(e => {
    reject({ code: 400, message: "Failed. Please try again.", data: e.message })
})
})
}