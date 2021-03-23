import Query from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'
import * as crypto from 'crypto'



// FUNC.  Changing the password of the user.
export const addNewPassword = (_body) => {
  return new Promise((resolve, reject) => {

    // Password encryption 
    var passwordHashed = crypto
                    .createHash("sha256")
                    .update(_body.currentPassword)
                    .digest("hex");
            const query = {
            name: 'check-password',
            text: Query.checkPassword,
            values: [_body.email, passwordHashed],
            }

            // Check if the user already exists.For that, check if there exist a password in his/her details.
            // If there is password in the field, and the password does not match the current;returns rejection.
            
            database().query(query, (error, results) => {
            if (error || results.rows[0]===undefined) {
                console.log(error)
                reject({ code: 400, message: "Your current password  is incorrect", data: {} });
                return;
            }
            if (_body.currentPassword==_body.newPassword)
            {
              reject({ code: 400, message: "You are using the same password! Please enter a new password.", data:{} });
            }
            if (_body.newPassword == _body.confirmPassword)
                      {   
                          var hashedPassword = crypto.createHash("sha256").update(_body.newPassword).digest("hex");
                            const query = {
                                name: 'add-password',
                                text: Query.addPassword,
                                values: [_body.email,hashedPassword],
                              }
                              console.log(hashedPassword)
                            database().query(query, (error, results) => {
                            if (error) {
                                console.log(error)
                                reject({ code: 400, message: "Error in database connection.", data:{} });
                                return;
                                }
                            else {
                            resolve({ code: 200, message: "Password changed successfully", data: {} });
                            }
                        })
              }
              else{
                          reject({ code: 400, message: "Password does'nt  match", data:{} });
                  }
          
            })
  })
}