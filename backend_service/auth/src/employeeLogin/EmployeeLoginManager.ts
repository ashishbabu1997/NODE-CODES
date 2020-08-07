import employeeLoginQuery from './query/EmployeeLoginQuery';
import database from '../common/database/database';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import * as crypto from 'crypto';



export const employeeLoginMethod = (_body) => {
    return new Promise((resolve, reject) => {
        var hashedPassword = crypto
            .createHash("sha256")
            .update(_body.password)
            .digest("hex");
        const query = {
            name: 'employee-login',
            text: employeeLoginQuery.employeeLogin,
            values: [_body.email, hashedPassword],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            const data = results.rows
            if (data.length > 0) {
                console.log(data)
                const token = jwt.sign({
                    employeeId: data[0].employeeId.toString(),
                    companyId: data[0].companyId.toString()
                }, config.jwtSecretKey, { expiresIn: '24h' });
                resolve({ code: 200, message: "Login successful", data: { token: `Bearer ${token}`, companyId: data[0].companyId } });
            } else {
                reject({ code: 400, message: "Invalid email or password", data: {} });
            }

        })
    })
}