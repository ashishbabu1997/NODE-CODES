import Query from './query/query';
import database from '../common/database/database';
import {Promise} from 'es6-promise'
export const otpValidate = (_body) => {
   return new Promise((resolve, reject) => {
      const query = {
          name: 'validate-otp',
          text: Query.validateOtp,
          values: [_body],
      }
      database().query(query, (error, results) => {
          if (error) {
              reject({ code: 400, message: "Failed. Please try again.", data:  [_body] });
              return;
          }
          resolve({ code: 200, message: "OTP login successful", data:  [_body] });
      })
  })
}