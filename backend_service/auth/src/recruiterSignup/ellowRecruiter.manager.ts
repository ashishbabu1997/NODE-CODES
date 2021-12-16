import database from '../common/database/database';
import * as crypto from 'crypto';
import recruiterSignupQuery from './query/recruiterSignupQuery';



// FUNC. Signup for ellow recruiter
export const recruiterPostSignup = (_body) => {
    return new Promise((resolve, reject) => {
        let hashedAccess = crypto
        .createHash("sha512")
        .update(_body.accesskey)
        .digest("hex");        
        if(hashedAccess === 'd786b5ff501d4e3a36ef4eff84679c2f6bf1c2630d43babba7fa5a42fd9b679fbe0ad310fe352668ad71fc7d642a0847babe6e45f2187050928e238393849fd3')
        {
            const currentTime = Math.floor(Date.now());
            const mailId = _body.email;
            const loweremailId = mailId.toLowerCase();
            
            (async () => {                
                const client = await database()
                try {     
                    await client.query('BEGIN');
                    const getEmailQuery = {
                        name: 'get-email',
                        text: recruiterSignupQuery.getEmail,
                        values: [loweremailId],
                    }
                    const getEmailResult = await client.query(getEmailQuery);                    
                    if (getEmailResult.rowCount >= 1) {
                        var adminStatus = getEmailResult.rows[0].admin_approve_status
                        var emailId = getEmailResult.rows[0].email
                        if (emailId == loweremailId) {
                            if (adminStatus == 2 || adminStatus == null) {
                                reject({ code: 400, statusCode: 406, message: "Your account is held for Admin approval", data: {} });
                                return;
                            }
                            else if (adminStatus == 1) {
                                reject({ code: 400, statusCode: 407, message: "You are already registered", data: {} });
                                return;
                            }
                            else if (adminStatus == 0) {
                                reject({ code: 400, statusCode: 408, message: "This account is rejected by Ellow", data: {} });
                                return;
                            }
                        }
                        
                    }
                    var hashedPassword = crypto.createHash("sha256").update('admin@ellow').digest("hex");
                    const adminSignup = {
                        name: 'admin-signup',
                        text: recruiterSignupQuery.ellowAdminSignupQuery,
                        values: {firstname:_body.firstname,lastname:_body.lastname,email:_body.email,telephonenumber:_body.number,password:hashedPassword,accounttype:3,userroleid:1,status:true,adminapprovestatus:1,createdon:currentTime}
                    }
                    
                    await client.query(adminSignup);
                    resolve({ code: 200, message: "Signed up succesfully", data: {} });
                    await client.query('COMMIT')
                } catch (e) {
                    console.log("Error e1: ",e );
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                }
            })().catch(e => {
                console.log("Error e2: ",e );
                reject({ code: 400, message: "Database error", data: e.message })
            })
        }
        else
        reject({ code: 200, message: "Access key invalid", _body });
        
        
    })
}
