import employeeQuery from './query/employee.query';
import database from './common/database/database';
import { sendMail } from './middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import config from './config/config'
import * as handlebars from 'handlebars'
import {nanoid} from 'nanoid';
import {readHTMLFile} from './middleware/htmlReader'
import { createNotification } from './common/notifications/notifications';

 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Registration of a new employee(company)
export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const mailId = _body.email
        const loweremailId = mailId.toLowerCase()
        const currentTime = Math.floor(Date.now() / 1000);
        
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                //Check if Email already exist reject in case exists        
                const getEmailQuery = {
                    name: 'get-email',
                    text: employeeQuery.getEmail,
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
                
                // If email does not exist allow registration
                // create a new company if companyId is null or use the same companyId to create employee and other details
                let companyId = _body.companyId;
                let adminApproveStatus=1,approvalStatus=true;
                if (companyId == null) {
                    const createCompanyQuery = {
                        name: 'createCompany',
                        text: employeeQuery.createCompany,
                        values: [_body.companyName, currentTime],
                    }
                    const result = await client.query(createCompanyQuery);
                    companyId = result.rows[0].company_id;
                    adminApproveStatus=null;
                    approvalStatus=false;
                }
                const createEmployeeQuery = {
                    name: 'createEmployee',
                    text: employeeQuery.createEmployee,
                    values: [_body.firstName, _body.lastName, loweremailId, _body.accountType, companyId, _body.telephoneNumber, currentTime, 2, approvalStatus, adminApproveStatus],
                }
                await client.query(createEmployeeQuery);
                
                // create an entry in settings table later used for company preferences like currency
                const createSettingsQuery = {
                    name: 'createSettings',
                    text: employeeQuery.createSettings,
                    values: [companyId, currentTime],
                }
                await client.query(createSettingsQuery);
                if(approvalStatus)
                {
                    const password = passwordGenerator.generate({
                        length: 10,
                        numbers: true
                    });
                    var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                    const subject = " ellow.io LOGIN PASSWORD "
                    const storePasswordQuery = {
                        name: 'store-encrypted-password',
                        text: employeeQuery.storePassword,
                        values: [hashedPassword,loweremailId],
                    }
                    await client.query(storePasswordQuery);
                    readHTMLFile('src/emailTemplates/newUserText.html', function(err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            loginPassword:password
                        };
                        var htmlToSend = template(replacements);
                        sendMail(loweremailId, subject, htmlToSend, function (err, data) {
                            if (err) {
                                console.log(err)
                                reject({ code: 400, message: "Mailer Error", data: {} });
                                return;
                            }
                        });
                    })
                }
                
                await client.query('COMMIT')                
                var Name = _body.firstName + " " + _body.lastName
                var companyName = _body.companyName
                var emailAddress = _body.email
                var number = ![null,undefined].includes(_body.telephoneNumber)?_body.telephoneNumber:""
                readHTMLFile('src/emailTemplates/applicationText.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        applicantName:Name,
                        company:companyName,
                        email:emailAddress,
                        phoneNumber:number
                    };
                    var htmlToSend = template(replacements);
                    sendMail(config.adminEmail, config.text.subject, htmlToSend, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Database Error", data: {} });
                            return;
                        }
                        console.log('Notification mail to admin has been sent !!!');
                        // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                    });
                })
                
                resolve({ code: 200, message: "Employee added successfully", data: {} });
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


 // >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Registration of an employee(company) by admin  
export const createEmployeeByAdmin = (_body) => {
    return new Promise((resolve, reject) => {
        const loweremailId = _body.email.toLowerCase()
        const currentTime = Math.floor(Date.now() / 1000);
        
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                //Check if Email already exist reject in case exists        
                const getEmailQuery = {
                    name: 'get-email',
                    text: employeeQuery.getEmail,
                    values: [loweremailId],
                }
                const getEmailResult = await client.query(getEmailQuery);
                
                if (getEmailResult.rowCount >= 1) {
                    var adminStatus = getEmailResult.rows[0].admin_approve_status
                    let message = adminStatus===null?"EmailId is held for approval of Ellow recruiter"
                    :adminStatus==1?"Email already registered"
                    :"This account is rejected by Ellow";
                    
                    reject({ code: 400, statusCode: 406, message:message , data: {} });
                    return;
                }
                
                // If email does not exist allow registration
                // create a new company if companyId is null or use the same companyId to create employee and other details
                let companyId = _body.employeeCompanyId;
                let adminApproveStatus=1,approvalStatus=true;
                if (companyId == null) {
                    const createCompanyQuery = {
                        name: 'createCompany',
                        text: employeeQuery.createCompany,
                        values: [_body.companyName, currentTime],
                    }
                    const result = await client.query(createCompanyQuery);
                    companyId = result.rows[0].company_id;
                }
                const createEmployeeQuery = {
                    name: 'createEmployee',
                    text: employeeQuery.createEmployee,
                    values: [_body.firstName, _body.lastName, loweremailId, _body.accountType, companyId, _body.telephoneNumber, currentTime, 2, approvalStatus, adminApproveStatus],
                }
                await client.query(createEmployeeQuery);
                
                // create an entry in settings table later used for company preferences like currency
                const createSettingsQuery = {
                    name: 'createSettings',
                    text: employeeQuery.createSettings,
                    values: [companyId, currentTime],
                }
                await client.query(createSettingsQuery);
                
                const password = passwordGenerator.generate({
                    length: 10,
                    numbers: true
                });
                
                var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                const subject = " ellow.io LOGIN PASSWORD "
                const storePasswordQuery = {
                    name: 'store-encrypted-password',
                    text: employeeQuery.storePassword,
                    values: [hashedPassword,loweremailId],
                }
                await client.query(storePasswordQuery);
                
                readHTMLFile('src/emailTemplates/newUserText.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        loginPassword:password
                    };
                    var htmlToSend = template(replacements);
                    sendMail(loweremailId, subject, htmlToSend, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Mailer Error", data: {} });
                            return;
                        }
                    });
                })
                
                
                await client.query('COMMIT')                
                var Name = _body.firstName + " " + _body.lastName
                var companyName = _body.companyName
                var emailAddress = _body.email
                var number = ![null,undefined].includes(_body.telephoneNumber)?_body.telephoneNumber:""
                readHTMLFile('src/emailTemplates/applicationText.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        applicantName:Name,
                        company:companyName,
                        email:emailAddress,
                        phoneNumber:number
                    };
                    var htmlToSend = template(replacements);
                    sendMail(config.adminEmail, config.text.subject, htmlToSend, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Database Error", data: {} });
                            return;
                        }
                        console.log('Notification mail to admin has been sent !!!');
                        // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                    });
                })
                
                resolve({ code: 200, message: "Employee added successfully", data: {} });
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


 // >>>>>>> FUNC. >>>>>>> 
//>>>>>>>>>>>>>>>>>>Verifying email address of a registered user
export const checkCompanyByWorkMail = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        
        var email = _body.emailId;
        var workMailExtension = email.substring(email.lastIndexOf('@') + 1);
        const query = {
            name: 'add-employee',
            text: employeeQuery.checkEmailForCompany,
            values: ['%@' + workMailExtension],
        }
        database().query(query, (error, results) => {
            if (error) {
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            var companyDetails = null;
            if (Array.isArray(results.rows) && results.rows.length) {
                companyDetails = {
                    companyId:parseInt(results.rows[0].company_id),
                    companyName:results.rows[0].company_name,
                    adminApproveStatus:results.rows[0].admin_approve_status,
                    accountType:results.rows[0].account_type
                }
            }
            resolve({ code: 200, message: "Company Details", data: companyDetails });
        })
    })
}


 // >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Registration of a freelance employee
export const createFreelancer = (_body) => {
    return new Promise((resolve, reject) => {
        const loweremailId = _body.email.toLowerCase()
        const currentTime = Math.floor(Date.now());
        
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                // Check if Email already exist reject in case exists        
                const getEmailQuery = {
                    name: 'get-email',
                    text: employeeQuery.getEmail,
                    values: [loweremailId],
                }
                const getEmailResult = await client.query(getEmailQuery);
                
                if (getEmailResult.rowCount >= 1) {
                    var adminStatus = getEmailResult.rows[0].admin_approve_status
                    var emailId = getEmailResult.rows[0].email
                    if (emailId == loweremailId) {
                        if (adminStatus == 1) {
                            reject({ code: 400, statusCode: 407, message: "Email you're trying to register already exist", data: {} });
                            return;
                        }
                        else {
                            reject({ code: 400, statusCode: 408, message: "Your account have been blocked by Ellow.io, please contact sales@ellow.io", data: {} });
                            return;
                        }
                    }
                    
                }
                
                // If email does not exist allow registration

                let uniqueId = nanoid();
                const createFreelancerQuery = {
                    name: 'createEmployee',
                    text: employeeQuery.createFreelancer,
                    values: {firstname:_body.firstName,lastname:_body.lastName,email:loweremailId,yoe:_body.yoe,phone:_body.phone,createdtime:currentTime,token:uniqueId},
                }
                await client.query(createFreelancerQuery);
                
                await client.query('COMMIT')                
                var Name = _body.firstName + " " + _body.lastName
                var companyName = _body.companyName
                var emailAddress = _body.email
                var number = ![null,undefined].includes(_body.telephoneNumber)?_body.telephoneNumber:""
                var verificationLink=_body.url+'/'+uniqueId
                readHTMLFile('src/emailTemplates/applicationText.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        applicantName:Name,
                        company:companyName,
                        email:emailAddress,
                        phoneNumber:number
                    };
                    var htmlToSend = template(replacements);
                    sendMail(config.adminEmail, config.text.subject, htmlToSend, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Database Error", data: {} });
                            return;
                        }
                        console.log('Notification mail to admin has been sent !!!');
                        // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                    });
                })
                readHTMLFile('src/emailTemplates/sendLinkText.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        applicantName:Name,
                        link:verificationLink,
                    };
                    var htmlToSend = template(replacements);
                    sendMail(loweremailId, config.text.userSubject, htmlToSend, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Database Error", data: {} });
                            return;
                        }
                        console.log('Verification link has been sent to the user !!!');
                        // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                    });
                })
                
                resolve({ code: 200, message: "Employee added successfully", data: {} });
            } catch (e) {
                console.log(e)
                console.log("Error e1: ",e.message );
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: {e} })
        })
        
    })
}

export const resetFreelancerToken = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());        
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                var hashedPassword = crypto.createHash("sha256").update(_body.password).digest("hex");
                
                const resetToken = {
                    name: 'reset-freelancer-token',
                    text: employeeQuery.resetPassword,
                    values: {token:_body.token,pass:hashedPassword},
                }
                const getMailAddress = {
                    name: 'get-user-mail',
                    text: employeeQuery.getRegisteredEmail,
                    values: [_body.employeeId],
                }
                let result = await client.query(resetToken);
                let emailAddress = await client.query(getMailAddress);

                await client.query('COMMIT')

                if(Array.isArray(result.rows) && ![undefined,null].includes((result.rows[0])) && ![undefined,null].includes(result.rows[0].employee_id))
                    {
                        readHTMLFile('src/emailTemplates/resetConfirmationText.html', function(err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                            };
                            var htmlToSend = template(replacements);
                            sendMail(emailAddress, config.text.resetConfirmSubject, htmlToSend, function (err, data) {
                                if (err) {
                                    console.log(err)
                                    reject({ code: 400, message: "Database Error", data: {} });
                                    return;
                                }
                                console.log('Confirmation mail has been sent to the user !!!');
                                // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                            });
                        })
                    resolve({ code: 200, message: "Employee token reset successfully and password updated", data: {} });
                    }
                else
                    reject({ code: 400, message: "Invalid token id or token expired", data: {} });

            } catch (e) {
                console.log(e)
                console.log("Error e1: ",e );
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ",e );
            reject({ code: 400, message: "Failed. Please try again.", data: {e} })
        })
        
    })
}