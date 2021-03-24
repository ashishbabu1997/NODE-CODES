import Query from './query/query';
import database from '../common/database/database';
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken';
import config from '../config/config';


// FUNC.
// Continuation of forgotPassword routes.
// When the user clicks on the link in the mail, it redirects to page to enter a recovery new password.
export const addPassword = (_body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const client = await database()
      try {
                  if (_body.newPassword == _body.confirmPassword)
                  {   
                    const getOldPassword = {
                      name: 'get-old-password',
                      text: Query.getOldPassword,
                      values: [_body.token],
                    }
                    let oldPassword=await client.query(getOldPassword)
                    var hashedPassword = crypto.createHash("sha256").update(_body.newPassword).digest("hex");
                    if (oldPassword.rows[0].password==hashedPassword)
                    {
                      reject({ code: 400, message: "Your password seems to be similar to the old one! Please enter a new password", data:{} });

                    }
                      const query = {
                          name: 'add-password',
                          text: Query.addPassword,
                          values: [_body.token,hashedPassword],
                        }
                        await client.query(query)

                      const detailsQuery = {
                                  name: 'Retrieve-Data',
                                  text: Query.retrieveDetails,
                                  values: [_body.token],
                      }
                      let results=await client.query(detailsQuery)
                      const data = results.rows
                      if (data.length > 0) {
                            const value = data[0];
                            const token = jwt.sign({
                                        employeeId: value.employeeId.toString(),
                                        companyId: value.companyId.toString()
                            }, config.jwtSecretKey, { expiresIn: '24h' });
                            resolve({ code: 200, message: "Login successful", data: {
                                              token: `Bearer ${token}`,
                                            companyId: value.companyId, companyName: value.companyName, companyLogo: value.companyLogo,
                                            email: value.email, firstName: value.firstName, lastName: value.lastName, accountType: value.accountType,
                                            masked: value.masked, currencyTypeId: value.currencyTypeId, companyProfile: value.companyProfile
                                          }});
                             }
                
                  }
                  else{
                      reject({ code: 400, message: "Password does'nt  match", data:{} });
                      }
    
            }
catch (e) {
  console.log("Error raised from try : ",e)
  await client.query('ROLLBACK')
  reject({ code: 400, message: "Failed. Please try again.", data: e.message });
} 
})().catch(e => {
console.log("Error raised from async : ",e)
reject({ code: 400, message: "Failed. Please try again.", data: e.message })
})
})
}