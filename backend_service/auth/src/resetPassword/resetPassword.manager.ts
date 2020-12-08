import Query from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken';
import config from '../config/config';


// FUNC.
// Continuation of forgotPassword routes.
// When the user clicks on the link in the mail, it redirects to page to enter a recovery new password.
export const addPassword = (_body) => {
  return new Promise((resolve, reject) => {
    if (_body.newPassword == _body.confirmPassword)
    {   
        var hashedPassword = crypto.createHash("sha256").update(_body.newPassword).digest("hex");
        const query = {
            name: 'add-password',
            text: Query.addPassword,
            values: [_body.token,hashedPassword],
          }
        database().query(query, (error, results) => {
        if (error) {
            console.log(error)
            reject({ code: 400, message: "Error in database connection.", data:{} });
            return;
            }
        else{
                const query = {
                    name: 'Retrieve-Data',
                    text: Query.retrieveDetails,
                    values: [_body.token],
                 }
                 database().query(query, (error, results) => {
                  if (error) {
                      console.log(error)
                      reject({ code: 400, message: "Failed. Please try again.", data: {} });
                      return;
                  }
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
                 )}
     })
    }
    else{
        reject({ code: 400, message: "Password does'nt  match", data:{} });
        }
  })
}