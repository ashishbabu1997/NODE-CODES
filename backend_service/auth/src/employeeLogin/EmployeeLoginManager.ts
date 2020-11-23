import employeeLoginQuery from './query/EmployeeLoginQuery';
import database from '../common/database/database';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import * as crypto from 'crypto';


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

                const query = {
                    name: 'employee-login',
                    text: employeeLoginQuery.employeeLogin,
                    values: [emailID, hashedPassword],
                } 
                
                let results = await client.query(query);
                const data = results.rows
                
                if (data.length > 0) {
                    
                    const value = data[0];
                    let candidateId = null;
                    const token = jwt.sign({
                        employeeId: value.employeeId.toString(),
                        companyId: value.companyId.toString(),
                        userRoleId:value.userRoleId.toString()
                    }, config.jwtSecretKey, { expiresIn: '24h' });

                    if(value.userRoleId == 4)
                    {
                        const candidateQuery = {
                            name: 'candidate-details-fetch',
                            text: employeeLoginQuery.getCandidateDetail,
                            values: [value.employeeId],
                        }
                        
                        let candidateResult = await client.query(candidateQuery);
                        candidateId = candidateResult.rows[0].candidate_id;
                    }
                    await client.query('COMMIT')

                    resolve({
                        code: 200, message: "Login successful", data: {
                            token: `Bearer ${token}`,
                            companyName: value.companyName, companyLogo: value.companyLogo,
                            candidateId ,  
                            email: value.email, firstName: value.firstName, lastName: value.lastName, accountType: value.accountType,
                            masked: value.masked, currencyTypeId: value.currencyTypeId, companyProfile: value.companyProfile,userRoleId:value.userRoleId
                        }
                    });
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
            reject({ code: 400, message: "Failed. Please try again.", data: {} })
        })
        
    })
}
