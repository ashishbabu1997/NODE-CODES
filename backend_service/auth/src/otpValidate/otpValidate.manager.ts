import Query from './query/query';
import database from '../common/database/database';
import { Promise } from 'es6-promise'
export const otpValidate = (_body) => {
  return new Promise((resolve, reject) => {
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
        resolve({ code: 200, message: "Otp validation successfull", data: {employeeId:results.rows[0].employeeId} });

      }
    })
  })
}