import database from '../common/database/database';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import * as crypto from 'crypto';
import * as emailClient from '../emailService/emailService';
import * as fs from 'fs';
import recruiterSignupQuery from './query/recruiterSignupQuery';



// FUNC. Signup for ellow recruiter
export const recruiterPostSignup = (_body) => {
    return new Promise((resolve, reject) => {
        console.log("_body : ",_body.body);
        let hashedAccess = crypto
        .createHash("sha512")
        .update(_body.accesskey)
        .digest("hex");
        
        if(hashedAccess === '2201c26b2bc107c5d5a80ffe48fe7f750135695cf2168698cab5332aef173b90ccf98175c2258f47d1bc38818b2225f8030a7bcadecfc8db8475bc22847990c8')
        {
            const currentTime = Math.floor(Date.now());        
            (async () => {
                const client = await database()
                try {
                    await client.query('BEGIN');
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
