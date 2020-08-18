import Query from './query/query';
import database from '../common/database/database';
import config from '../config/config'
import { Promise } from 'es6-promise'
export const otpValidate = (_body) => {
  return new Promise((resolve, reject) => {
    const currentTime = Math.floor(Date.now()/1000);
    const query = {
      name: 'validate-otp',
      text: Query.validateOtp,
      values: [_body.otp, _body.email],
    }
    database().query(query, (error, results) => {
      if (error) {
        console.log(error)
        return;
      }
      else {
        if (results.rowCount==0) {
          reject({ code: 400, message: "Incorrect OTP entry", data: {} });
          return
        }
        if (currentTime-results.rows[0].updated_on<=config.timeLimit)
        {
          resolve({ code: 200, message: "Otp validation successfull", data: {employeeId:results.rows[0].employeeId} });
        }
        else{
          reject({ code: 400, message: "Your OTP has expired", data: {} });

        }
      }
    })
  })
}