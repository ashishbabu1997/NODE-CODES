import employeeLoginQuery from './query/EmployeeLoginQuery';
import database from '../common/database/database';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import * as crypto from 'crypto';


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

                const query = {
                    name: 'employee-login',
                    text: employeeLoginQuery.employeeLogin,
                    values: [emailID, hashedPassword],
                } 
                
                let results = await client.query(query);
                const data = results.rows

                // Check if the password is correct
                if (data.length > 0) {
                    const value = data[0];
                    let candidateId = null;
                    const token = jwt.sign({
                        employeeId: value.employeeId.toString(),
                        companyId: value.companyId.toString(),
                        userRoleId:value.userRoleId.toString()
                    }, config.jwtSecretKey, { expiresIn: '24h' });

                    // Check if the login user is a freelancer
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
                    // On success, user bearer token holding his/her companyId,userRoleId and employeeId; plus other details
                    // are being given to the front end.
                    resolve({
                        code: 200, message: "Login successful", data: {
                            token: `Bearer ${token}`,
                            companyId: value.companyId, companyName: value.companyName, companyLogo: value.companyLogo,
                            candidateId ,  
                            email: value.email, firstName: value.firstName, lastName: value.lastName, accountType: value.accountType,employeeId:value.employeeId,
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
