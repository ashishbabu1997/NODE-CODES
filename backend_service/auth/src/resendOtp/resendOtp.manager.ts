import Query from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'
import  * as otpGenerator from "otp-generator"
export const otpSender = (_body) => {
  return new Promise((resolve, reject) => {
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
        const currentTime = Math.floor(Date.now()/1000);
        const query = {
            name: 'update-otp',
            text: Query.updateOtp,
            values: [otp,currentTime,_body.email],
          }
        database().query(query, (error, results) => {
        if (error) {
            console.log(error)
            reject({ code: 400, message: "Error in database connection.", data:{} });
            return;
            }
        else {
        resolve({ code: 200, message: "OTP resended successfully", data: {} });
        }
     })
    })
}