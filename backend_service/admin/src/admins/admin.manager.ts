import admineQuery from './query/admin.query';
import database from '../common/database/database';
import { sendMail } from '../middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import config from '../config/config'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
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
            "phoneNumber":'e.telephone_number'
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
            console.log(results.rowCount)
            resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
        })
    })
}

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
        
        // var orderBy = ' ORDER BY e.updated_on DESC';
        // selectQuery = selectQuery + orderBy;
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
                reject({ code: 400, message: "Database Error", data: {} });
                return;
            }
            console.log(results.rowCount)
            resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
        })
    })
}

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
export const clearance = (_body) => {
    return new Promise((resolve, reject) => {
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
        const currentTime = Math.floor(Date.now() / 1000);
        (async () => {
            const client = await database().connect()
            try {
                await client.query('BEGIN');
                
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
                    readHTMLFile('src/emailTemplates/adminApproveText.html', function(err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            loginPassword: password
                        };
                        var htmlToSend = template(replacements);
                        sendMail(email, subject, htmlToSend, function (err, data) {
                            if (err) {
                                console.log(err)
                                reject({ code: 400, message: "Mailer Error", data: {} });
                                return;
                            }
                        });
                    })
                    await client.query('COMMIT'); 
                    resolve({ code: 200, message: "User Approval Successfull", data: {} });
                }
                else {
                    const adminRejectQuery = {
                        name: 'admin-panel',
                        text: admineQuery.clearanceQuery,
                        values: [_body.selectedEmployeeId, false, 0,currentTime]
                    }
                    await client.query(adminRejectQuery);
                    
                    var desc = _body.description
                    var subject = "ellow.io ACCOUNT REJECTION MAIL "
                    readHTMLFile('src/emailTemplates/adminRejectText.html', function(err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                            description: desc
                        };
                        var htmlToSend = template(replacements);
                        sendMail(email, subject, htmlToSend, function (err, data) {
                            if (err) {
                                console.log(err)
                                reject({ code: 400, message: "Mailer Error", data: {} });
                                return;
                            }
                        });
                    })
                    await client.query('COMMIT'); 
                    resolve({ code: 200, message: "User Rejection Successfull", data: {} });
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

