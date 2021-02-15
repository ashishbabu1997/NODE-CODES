import admineQuery from './query/admin.query';
import database from '../common/database/database';
import { sendMail } from '../middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import * as handlebars from 'handlebars'
import {readHTMLFile} from '../middleware/htmlReader'
import * as emailClient from '../emailService/emailService';


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>List all the users
export const listUsersDetails = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = admineQuery.listUsers;
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND LOWER(p.company_name) LIKE '%" + _body.filter.toLowerCase() + "%'";
        }
        const orderBy = {
            "firstName":'e.firstname',
            "lastName":'e.lastname',
            "email":'e.email',
            "phoneNumber":'e.telephone_number',
            "companyName":'p.company_name'
        }

        if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
                {
                    selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
                }  
        
        const listquery = {
            name: 'list-candidates',
            text: selectQuery
        }
        database().query(listquery, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
        })
    })
}



 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>List all registered users 
export const allUsersList = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = admineQuery.allRegisteredUsersList;
        console.log("filter : ",_body.filter);
        
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND (c.company_name ilike '%"+_body.filter+"%' OR e.firstname ilike '%"+_body.filter+"%' OR e.lastname ilike '%"+_body.filter+"%')";
        }
        const orderBy = {
            "updatedOn": 'e.updated_on',
            "firstName":'e.firstname',
            "lastName":'e.lastname',
            "email":'e.email',
            "accountType":'e.account_type',
            "phoneNumber":'e.telephone_number',
            "companyName":'c.company_name'

        }


        if(_body.sortBy && _body.sortType && Object.keys(orderBy).includes(_body.sortBy))  
                {
                    selectQuery = selectQuery + ' ORDER BY ' + orderBy[_body.sortBy] + ' ' + _body.sortType
                }  
        
        const listquery = {
            name: 'list-candidates',
            text: selectQuery,
            values:[_body.usersType]
        }
        database().query(listquery, (error, results) => {
            if (error) {
                console.log(error)
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Get details of a single user.
export const getUserDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const userInfo = {
            name: 'user-Details',
            text: admineQuery.retrieveUserInfo,
            values: [_body.selectedEmployeeId]
        }
        database().query(userInfo, (error, results) => {
            if (error) {
                console.log(error, "eror")
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            const user = results.rows
            let result = {};
            user.forEach(step => {
                result = {
                    employeeId: step.employeeId,
                    firstName: step.firstName,
                    lastName: step.lastName,
                    email: step.email,
                    accountType: step.accountType,
                    companyName: step.companyName,
                    companyWebsite: step.companyWebsite,
                    companySize: step.companySize
                }
                resolve({ code: 200, message: "User details listed successfully", data: { User: result } });
            })
        })
    })
}



 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Function for admin to approve or reject a user who has signed up
export const clearance = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                const  getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: admineQuery.getellowAdmins,
                    values: []
            

                }
                var ellowAdmins=await client.query(getEllowAdmins)
                const  getCompanyName = {
                    name: 'get-comapny-name-from-employeeId',
                    text: admineQuery.getCompanyNameQuery,
                    values: [_body.selectedEmployeeId]
            

                }
                var companyName=await client.query(getCompanyName)

                // Approving a user
                if (_body.decisionValue == 1) {
                    
                    const password = passwordGenerator.generate({
                        length: 10,
                        numbers: true
                    });
                    var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                    const adminApprovalQuery = {
                        name: 'admin-panel',
                        text: admineQuery.approveEmployeeQuery,
                        values: [_body.selectedEmployeeId,hashedPassword,currentTime]
                    }
                    var approveResult = await client.query(adminApprovalQuery);
                    var email = approveResult.rows[0].email;
                    const subject = " ellow.io LOGIN PASSWORD "

                    // Sending an email with login credentials
                    let path = 'src/emailTemplates/adminApproveText.html';
                    let replacements = {
                        loginPassword: password
                    };
                    emailClient.emailManager(email,subject,path,replacements);
                    await client.query('COMMIT');
                    if(Array.isArray(ellowAdmins.rows))
                    {
                        let recruitersSubject='User Registration Notification'
                        let recruitersPath = 'src/emailTemplates/userApprovalMailText.html';
                        let recruitersReplacements = { fName:approveResult.rows[0].firstname,lName:approveResult.rows[0].lastname,email:approveResult.rows[0].email,cName:companyName.rows[0].company_name};
                        ellowAdmins.rows.forEach(element => {
                        emailClient.emailManager(element.email,recruitersSubject,recruitersPath,recruitersReplacements);         
                        })
                        resolve({ code: 200, message: "User Approval Successfull", data: {} });                            
                    }
                }
                else {

                    // Rejecting a user
                    const adminRejectQuery = {
                        name: 'admin-panel',
                        text: admineQuery.clearanceQuery,
                        values: [_body.selectedEmployeeId, false, 0,currentTime]
                    }
                    await client.query(adminRejectQuery);
                    var desc = _body.description
                    var subject = "ellow.io ACCOUNT REJECTION MAIL "

                    // Rejection mail to the user
                    let path = 'src/emailTemplates/adminRejectText.html';
                    var userReplacements = {
                        description: desc
                    };
                    emailClient.emailManager(email,subject,path,userReplacements);
                    await client.query('COMMIT'); 
                    if(Array.isArray(ellowAdmins.rows))
                    {
                        let subject='User Rejection Notification'
                        let path = 'src/emailTemplates/userRejecetionMailText.html';
                        let replacements = { fName:approveResult.rows[0].firstname,lName:approveResult.rows[0].lastname,email:approveResult.rows[0].email,cName:companyName.rows[0].company_name};
                        ellowAdmins.rows.forEach(element => {
                        emailClient.emailManager(element.email,subject,path,replacements);         
                        })
                        resolve({ code: 200, message: "User Rejection Successfull", data: {} });
                    }
                }
            } catch (e) {
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

