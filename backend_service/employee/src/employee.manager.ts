import employeeQuery from './query/employee.query';
import database from './common/database/database';
import { sendMail } from './middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import config from './config/config'
import * as handlebars from 'handlebars'
import * as fs from 'fs'


export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const mailId = _body.email
        const loweremailId = mailId.toLowerCase()
        const currentTime = Math.floor(Date.now() / 1000);
        
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var readHTMLFile = function(path, callback) {
                    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };
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

export const createEmployeeByAdmin = (_body) => {
    return new Promise((resolve, reject) => {
        const loweremailId = _body.email.toLowerCase()
        const currentTime = Math.floor(Date.now() / 1000);
        
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                var readHTMLFile = function(path, callback) {
                    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                        if (err) {
                            throw err;
                            callback(err);
                        }
                        else {
                            callback(null, html);
                        }
                    });
                };
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
