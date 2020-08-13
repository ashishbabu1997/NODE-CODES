import Query from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'
import * as crypto from 'crypto'
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
        else {
        resolve({ code: 200, message: "Password changed successfully", data: {} });
        }
     })
    }
    else{
        reject({ code: 400, message: "Password does'nt  match", data:{} });
        }
  })
}