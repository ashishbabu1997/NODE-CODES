import Query from './query/query';
import database from '../common/database/database';
export const otpValidate = (_body) => {
  return new Promise((resolve, reject) => {
      const query = {
          name: 'add-email-otp',
          text: Query.validate,
          values: [_body.otp],
      }
      database().query(query, (error, results) => {
          if (error) {
              reject({ code: 400, message: "Failed. Please try again.", data:  [_body.otp] });
              return;
          }
          resolve({ code: 200, message: "OTP login successful", data:  [_body.otp] });
      })
  })
}