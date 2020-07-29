import employeeLoginQuery from './query/EmployeeLoginQuery';
import database from '../common/database/database';

export const employeeLoginMethod = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'employee-login',
            text: employeeLoginQuery.employeeLogin,
            values: [_body.email, _body.password],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Login successful", data: [_body] });
        })
    })
}