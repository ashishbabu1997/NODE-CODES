import employeeQuery from './query/employee.query';
import database from './common/database/database';
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import config from './config/config'
import { nanoid } from 'nanoid';
import { createNotification } from './common/notifications/notifications';
import * as emailClient from './emailService/emailService';
import * as utils from './utils/utils'
// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Registration of a new employee(company)
export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const mailId = _body.body.email
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
                let companyId = _body.body.companyId;
                let adminApproveStatus = 1, approvalStatus = true;
                if (companyId == null) {
                    var domain=utils.domainExtractor(loweremailId)
                    const createCompanyQuery = {
                        name: 'createCompany',
                        text: employeeQuery.createCompany,
                        values: [_body.body.companyName, currentTime,domain],
                    }
                    const result = await client.query(createCompanyQuery);
                    companyId = result.rows[0].company_id;
                    adminApproveStatus = null;
                    approvalStatus = false;
                    _body.primaryEmail=true
                }
                else {
                    _body.primaryEmail=false

                    console.log("Subuser registration")
                }
                if (_body.body.accountType == 1) {
                    _body.userRoleId = 2
                }
                else {
                    _body.userRoleId = 3
                }
                const createEmployeeQuery = {
                    name: 'createEmployee',
                    text: employeeQuery.createEmployee,
                    values: [_body.body.firstName, _body.body.lastName, loweremailId, _body.body.accountType, companyId, _body.body.telephoneNumber, currentTime, _body.userRoleId, approvalStatus, adminApproveStatus,_body.primaryEmail],
                }
                await client.query(createEmployeeQuery);
                let message = `A new user ${_body.body.firstName + ' ' + _body.body.lastName} with company name ${_body.body.companyName} has registered with us`
                createNotification({ companyId: companyId, message: message, notificationType: 'employee', userRoleId: 2, employeeId: null, firstName: _body.body.firstName, lastName: _body.body.lastName })
                const getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: employeeQuery.getellowAdmins,
                    values: []


                }
                var ellowAdmins = await client.query(getEllowAdmins)
                if (Array.isArray(ellowAdmins.rows)) {
                    let recruitersSubject = 'Company Signup Notification'
                    let recruitersPath = 'src/emailTemplates/userSignupText.html';
                    let recruitersReplacements = { fName: _body.body.firstName, lName: _body.body.lastName, email: loweremailId, company: _body.body.companyName };
                    ellowAdmins.rows.forEach(element => {
                        if (element.email != null || '' || undefined) {
                            emailClient.emailManager(element.email, recruitersSubject, recruitersPath, recruitersReplacements);
                        }
                        else {
                            console.log("Email Recipient is empty")
                        }

                    })

                }
                else {
                    console.log("Error in fetch admin query")
                }
                // create an entry in settings table later used for company preferences like currency
                const createSettingsQuery = {
                    name: 'createSettings',
                    text: employeeQuery.createSettings,
                    values: [companyId, currentTime],
                }
                await client.query(createSettingsQuery);
                if (approvalStatus) {
                    const password = passwordGenerator.generate({
                        length: 10,
                        numbers: true
                    });
                    var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                    const subject = " ellow.io LOGIN PASSWORD "
                    const storePasswordQuery = {
                        name: 'store-encrypted-password',
                        text: employeeQuery.storePassword,
                        values: [hashedPassword, loweremailId],
                    }
                    await client.query(storePasswordQuery);

                    let path = 'src/emailTemplates/newUserText.html';
                    let userReplacements = { loginPassword: password };
                    if (loweremailId != null || '' || undefined) {
                        emailClient.emailManager(loweremailId, subject, path, userReplacements);
                    }
                    else {
                        console.log("Email Recipient is empty")
                    }
                    let Name = _body.body.firstName.charAt(0).toUpperCase() + _body.body.firstName.slice(1) + " " + _body.body.lastName.charAt(0).toUpperCase() + _body.body.lastName.slice(1)
                    let companyName = _body.body.companyName
                    let emailAddress = _body.body.email
                    let number = ![null, undefined].includes(_body.body.telephoneNumber) ? _body.body.telephoneNumber : ""
                    let adminPath = 'src/emailTemplates/applicationText.html';
                    let adminReplacements = { applicantName: Name, company: companyName, email: emailAddress, phoneNumber: number };
                    const getEllowAdmins = {
                        name: 'get-ellow-admin',
                        text: employeeQuery.getellowAdmins,
                        values: []


                    }
                    var ellowAdmins = await client.query(getEllowAdmins)
                    if (Array.isArray(ellowAdmins.rows)) {

                        ellowAdmins.rows.forEach(element => {

                            emailClient.emailManagerForNoReply(element.email, config.text.subject, adminPath, adminReplacements);

                        })
                    }
                }
                else {
                    console.log("Waiting for admin approval")
                }


                await client.query('COMMIT')
                resolve({ code: 200, message: "Employee added successfully", data: {} });
            } catch (e) {
                console.log("Error1", e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error2", e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
        })

    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>> Registration of an employee(company) by admin  
export const createEmployeeByAdmin = (_body) => {
    return new Promise((resolve, reject) => {
        const loweremailId = _body.email.toLowerCase()
        const currentTime = Math.floor(Date.now());

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
                    let message = adminStatus === null ? "EmailId is held for approval of Ellow recruiter"
                        : adminStatus == 1 ? "Email already registered"
                            : "This account is rejected by Ellow";

                    reject({ code: 400, statusCode: 406, message: message, data: {} });
                    return;
                }

                // If email does not exist allow registration
                // create a new company if companyId is null or use the same companyId to create employee and other details
                let companyId = _body.employeeCompanyId;
                let adminApproveStatus = 1, approvalStatus = true;
                if (companyId == null) {
                    var domain=utils.domainExtractor(loweremailId)
                    const createCompanyQuery = {
                        name: 'createCompany',
                        text: employeeQuery.createCompany,
                        values: [_body.companyName, currentTime,domain],
                    }
                    const result = await client.query(createCompanyQuery);
                    companyId = result.rows[0].company_id;
                    _body.primaryEmail=true
                }
                else{
                    _body.primaryEmail=false
                }
                const createEmployeeQuery = {
                    name: 'createEmployee',
                    text: employeeQuery.createEmployee,
                    values: [_body.firstName, _body.lastName, loweremailId, _body.accountType, companyId, _body.telephoneNumber, currentTime, 2, approvalStatus, adminApproveStatus,_body.primaryEmail],
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
                    values: [hashedPassword, loweremailId],
                }
                await client.query(storePasswordQuery);

                let path = 'src/emailTemplates/newUserText.html';
                var userReplacements = {
                    loginPassword: password
                };
                if (loweremailId != null || '' || undefined) {
                    emailClient.emailManager(loweremailId, subject, path, userReplacements);
                }
                else {
                    console.log("Email Recipient is empty")
                }

                let Name = _body.firstName.charAt(0).toUpperCase() + _body.firstName.slice(1) + " " + _body.lastName.charAt(0).toUpperCase() + _body.lastName.slice(1)
                let companyName = _body.companyName
                let emailAddress = _body.email
                let number = ![null, undefined].includes(_body.telephoneNumber) ? _body.telephoneNumber : "";
                path = 'src/emailTemplates/newApplicationText.html';
                let adminReplacements = { applicantName: Name, company: companyName, email: emailAddress, phoneNumber: number };
                const getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: employeeQuery.getellowAdmins,
                    values: []


                }
                var ellowAdmins = await client.query(getEllowAdmins)
                if (Array.isArray(ellowAdmins.rows)) {
                    ellowAdmins.rows.forEach(element => {

                        emailClient.emailManagerForNoReply(element.email, config.text.newCompanySubject, path, adminReplacements);


                    })

                }
                else {
                    console.log("Error in fetch admin query")
                }

                await client.query('COMMIT')
                resolve({ code: 200, message: "Employee added successfully", data: {} });
            } catch (e) {
                console.log("Error1", e)
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            } finally {
                client.release();
            }
        })().catch(e => {
            console.log("Error2", e)
            reject({ code: 400, message: "Failed. Please try again.", data: e.message })
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
        if (workMailExtension == 'gmail.com') {
            resolve({ code: 200, message: "Please enter your work mail", data: null });

        }
        else {
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
                        companyId: parseInt(results.rows[0].company_id),
                        companyName: results.rows[0].company_name,
                        adminApproveStatus: results.rows[0].admin_approve_status,
                        accountType: results.rows[0].account_type
                    }
                }
                resolve({ code: 200, message: "Company Details", data: companyDetails });
            })
        }

    })
}


// >>>>>>> FUNC. >>>>>>>
// >>>>>>>>>>>>>>>>>>Registration of a freelance employee,email verification
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
                            reject({ code: 400, statusCode: 407, message: "Email you're trying to register already exists", data: {} });
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
                    values: { firstname: _body.firstName, lastname: _body.lastName, email: loweremailId, yoe: _body.yoe, phone: _body.telephoneNumber, createdtime: currentTime, token: uniqueId },
                }
                await client.query(createFreelancerQuery);
                let Name = _body.firstName.charAt(0).toUpperCase() + _body.firstName.slice(1) + " " + _body.lastName.charAt(0).toUpperCase() + _body.lastName.slice(1)
                let companyName = "Freelancer"
                let emailAddress = _body.email
                let number = ![null, undefined].includes(_body.telephoneNumber) ? _body.telephoneNumber : ""
                let verificationLink = _body.host + '/create-password/' + uniqueId;

                let adminReplacement = { applicantName: Name, company: companyName, email: emailAddress, phoneNumber: number };
                let path = 'src/emailTemplates/freelancerApplicationText.html';
                const message = `A new employee ${_body.firstName + ' ' + _body.lastName}  has been signed up with us as a freelancer`
                const freelancer = {
                    name: 'get-freelancer-companyid',
                    text: employeeQuery.getFreelancerCompanyId,
                    values: []

                }
                var freelancerService = await client.query(freelancer)
                var companyId = freelancerService.rows[0].company_id
                createNotification({ companyId: companyId, message: message, notificationType: 'employee', userRoleId: 4, employeeId: null, firstName: _body.firstName, lastName: _body.lastName })
                const getEllowAdmins = {
                    name: 'get-ellow-admin',
                    text: employeeQuery.getellowAdmins,
                    values: []


                }
                var ellowAdmins = await client.query(getEllowAdmins)
                if (Array.isArray(ellowAdmins.rows)) {

                    ellowAdmins.rows.forEach(element => {
                        if (element.email != null || '' || undefined) {
                            emailClient.emailManager(element.email, config.text.freelancerSubject, path, adminReplacement);
                        }
                        else {
                            console.log("Email Recipient is empty")
                        }
                    })

                }
                else {
                    console.log("Error in fetch admin query")
                }

                let freelancerReplacements = {
                    applicantName: Name,
                    link: verificationLink,
                };

                path = 'src/emailTemplates/sendLinkText.html';
                if (loweremailId != null || '' || undefined) {
                    emailClient.emailManagerForNoReply(loweremailId, config.text.userSubject, path, freelancerReplacements);
                }
                else {
                    console.log("Email Recipient is empty")
                }
                await client.query('COMMIT')
                resolve({ code: 200, message: "Employee added successfully", data: {} });
            } catch (e) {
                console.log(e)
                console.log("Error e1: ", e.message);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            reject({ code: 400, message: "Failed. Please try again.", data: { e } })
        })

    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Password reset for freelancer  
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
                    values: { token: _body.token, pass: hashedPassword },
                }

                let result = await client.query(resetToken);

                await client.query('COMMIT')
                if (Array.isArray(result.rows) && ![undefined, null].includes((result.rows[0])) && ![undefined, null].includes(result.rows[0].employee_id)) {
                    let companyId = result.rows[0].company_id
                    let emailAddress = result.rows[0].email
                    let firstName = result.rows[0].firstname
                    let lastName = result.rows[0].lastname
                    let replacements = {
                    };
                    let path = 'src/emailTemplates/resetConfirmationText.html';
                    const message = `A new employee, ${firstName + ' ' + lastName}  has been registered with us as a freelancer.`

                    emailClient.emailManagerForNoReply(emailAddress, config.text.resetConfirmSubject, path, replacements);


                    resolve({ code: 200, message: "Employee token reset successfully and password updated", data: { email: emailAddress } });
                }
                else
                    reject({ code: 400, message: "Invalid token id or token expired", data: {} });

            } catch (e) {
                console.log("Error e1: ", e);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ", e);
            reject({ code: 400, message: "Failed. Please try again.", data: { e } })
        })

    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Password reset for freelancer  
export const tokenCheck = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');
                const checkToken = {
                    name: 'check-token',
                    text: employeeQuery.checkTokenExistance,
                    values: { token: _body.token },
                }

                let result = await client.query(checkToken);
                if (result.rowCount == 1) {
                    resolve({ code: 200, message: "Success", data: { email: result.rows[0].email } });
                }
                else {
                    reject({ code: 400, message: "Password already updated", data: {} })
                }

                await client.query('COMMIT')
            } catch (e) {
                console.log("Error e1: ", e);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ", e);
            reject({ code: 400, message: "Failed. Please try again.", data: { e } })
        })

    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Ellow recruiter signup API  
export const ellowAdminSignup = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        const mailId = _body.body.email
        const loweremailId = mailId.toLowerCase()
            (async () => {
                const client = await database()
                try {
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
                    await client.query('BEGIN');
                    var password = 'admin@ellow'
                    var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                    const adminSignup = {
                        name: 'admin-signup',
                        text: employeeQuery.ellowAdminSignupQuery,
                        values: { firstname: _body.firstName, lastname: _body.lastName, email: _body.email, telephonenumber: _body.phoneNumber, password: hashedPassword, accounttype: 3, userroleid: 1, status: true, adminapprovestatus: 1, createdon: currentTime }
                    }

                    await client.query(adminSignup);
                    resolve({ code: 200, message: "Success", data: {} });
                    await client.query('COMMIT')
                } catch (e) {
                    console.log("Error e1: ", e);
                    await client.query('ROLLBACK')
                    reject({ code: 400, message: "Failed. Please try again.", data: e.message });
                }
            })().catch(e => {
                console.log("Error e2: ", e);
                reject({ code: 400, message: "Failed. Please try again.", data: { e } })
            })

    })
}


// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Ellow recruiter signup API  
export const getAdminDetails = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now());
        (async () => {
            const client = await database()
            try {
                await client.query('BEGIN');

                const adminSignup = {
                    name: 'admin-signup',
                    text: employeeQuery.getellowAdmins,
                    values: []
                }
                let result = await client.query(adminSignup);
                resolve({ code: 200, message: "Success", data: { adminDetails: result.rows } });
                await client.query('COMMIT')
            } catch (e) {
                console.log("Error e1: ", e);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ", e);
            reject({ code: 400, message: "Failed. Please try again.", data: { e } })
        })

    })
}

// >>>>>>> FUNC. >>>>>>>
//>>>>>>>>>>>>>>>>>>Get employees
export const getAllEmployees = (_body) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client = await database()
            var value;
            try {
                await client.query('BEGIN');

                if (_body.userRoleId == 1) {
                    value = _body.hirerCompanyId
                }
                else {
                    value = _body.companyId
                }
                const getCompanyEmployees = {
                    name: 'get-employees',
                    text: employeeQuery.getEmployeesQuery,
                    values: [value]
                }

                var result = await client.query(getCompanyEmployees);
                resolve({ code: 200, message: "Employees listed successfully", data: { employees: result.rows } });
                await client.query('COMMIT')
            } catch (e) {
                console.log("Error e1: ", e);
                await client.query('ROLLBACK')
                reject({ code: 400, message: "Failed. Please try again.", data: e.message });
            }
        })().catch(e => {
            console.log("Error e2: ", e);
            reject({ code: 400, message: "Failed. Please try again.", data: { e } })
        })

    })
}
