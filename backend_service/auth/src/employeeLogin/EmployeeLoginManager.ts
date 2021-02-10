import employeeLoginQuery from './query/EmployeeLoginQuery';
import database from '../common/database/database';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import * as crypto from 'crypto';
import * as emailClient from '../emailService/emailService';
import * as fs from 'fs';

// FUNC. Login for a registered user
export const employeeLoginMethod = (_body) => {
    return new Promise((resolve, reject) => {
        var emailID=_body.email.toLowerCase()
        var hashedPassword = crypto
        .createHash("sha256")
        .update(_body.password)
        .digest("hex");
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                let userRole = _body.type === 'freelancer'?[4]:[1,2,3]
                const query = {
                    name: 'employee-login',
                    text: employeeLoginQuery.employeeLogin,
                    values: [emailID, hashedPassword,userRole],
                } 
                
                let results = await client.query(query);
                const data = results.rows

                // Check if the password is correct
                if (data.length > 0) {
                    const value = data[0];
                    if(value.status)
                    {
                       
                        const token = jwt.sign({
                            employeeId: value.employeeId.toString(),
                            companyId: value.companyId.toString(),
                            userRoleId:value.userRoleId.toString()
                        }, config.jwtSecretKey, { expiresIn: '24h' });
                        
                        // Check if the login user is a freelancer
                        await client.query('COMMIT')
                        // On success, user bearer token holding his/her companyId,userRoleId and employeeId; plus other details
                        // are being given to the front end.
                        resolve({
                            code: 200, message: "Login successful", data: {
                                token: `Bearer ${token}`,
                                companyName: value.companyName, companyLogo: value.companyLogo,
                                candidateId:value.candidateId ,  candidateStatus:value.candidateStatus,
                                email: value.email, firstName: value.firstName, lastName: value.lastName, accountType: value.accountType,
                                masked: value.masked, currencyTypeId: value.currencyTypeId, companyProfile: value.companyProfile,userRoleId:value.userRoleId
                            }
                        });
                    }
                    else
                    {
                        value.token != null?
                        reject({ code: 400, message: "Please verify your email to login", data: {} }):
                        reject({ code: 400, message: "Invalid email or password", data: {} });
                    }
                    
                } else {
                    reject({ code: 400, message: "Invalid email or password", data: {} });
                }
                
            } catch (e) {
                console.log(e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log(e)
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
        
    })
}