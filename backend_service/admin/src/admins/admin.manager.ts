import admineQuery from './query/admin.query';
import database from '../common/database/database';
import {Promise} from "es6-promise";
import { sendMail } from '../middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import config from '../config/config'

export const listUsersDetails = (_body) => {
    return new Promise((resolve, reject) => {
            var selectQuery = admineQuery.listUsers;
            if(_body.filter)
            {
                 selectQuery =selectQuery +" "+"AND LOWER(p.company_name) LIKE '%" +_body.filter.toLowerCase() +"%'";
            }
            const listquery = {
                name: 'list-candidates',
                text:selectQuery,
                values:[false,2]
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
                if(_body.filter)
                {
                     selectQuery =selectQuery +" "+"AND LOWER(p.company_name) LIKE '%" +_body.filter.toLowerCase() +"%'";
                }
                var orderBy = ' ORDER BY p.created_on DESC';
                selectQuery = selectQuery + orderBy;

                const listquery = {
                    name: 'list-candidates',
                    text:selectQuery,
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
                    text:admineQuery.retrieveUserInfo,
                    values:[_body.employeeId]
                }
                database().query(userInfo, (error, results) => {
                    if (error) {
                        console.log(error, "eror")
                        reject({ code: 400, message: "Database Error", data: {} });
                        return;
                    }
                    const user=results.rows
                    let result = {};
                    user.forEach(step => {
                        result= {
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
            if (_body.decisionValue==1)
            {
                const adminApprovalQuery = {
                    name: 'admin-panel',
                    text:admineQuery.clearanceQuery,
                    values:[_body.employeeId,true,1]
                }
                database().query(adminApprovalQuery, (error, results) => {
                    if (error) {
                        reject({ code: 400, message: "Database Error", data: {} });
                        return;
                    }
                    // resolve({ code: 200, message: "Users listed successfully", data: { Users: results.rows } });
                })
                const password = passwordGenerator.generate({
                    length: 10,
                    numbers: true
                });
                var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                const subject = " ellow.io LOGIN PASSWORD "
                const storePasswordQuery = {
                    name: 'store-encrypted-password',
                    text: admineQuery.storePassword,
                    values: [hashedPassword,_body.email],
                }
                database().query(storePasswordQuery, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject({ code: 400, message: "Database Error", data: {} });
                        return;
                    }
                })
                // var desc=_body.description
                // var description=desc.fontsize(3).bold()
                var textFormat = config.text.firstLine + config.nextLine + config.text.secondLine + config.nextLine+config.text.thirdLine + config.nextLine + config.text.password + password + config.nextLine + config.text.fourthLine + config.nextLine + config.text.fifthLine
                sendMail(_body.email, subject, textFormat, function (err, data) {
                    if (err) {
                        console.log(err)
                        reject({ code: 400, message: "Mailer Error", data: {} });
                        return;
                    }
                    console.log('A password has been send to your email !!!');
                });
                resolve({ code: 200, message: "User Approval Successfull", data: {} });
            }
            else
            {
                const adminApprovalQuery = {
                    name: 'admin-panel',
                    text:admineQuery.clearanceQuery,
                    values:[_body.employeeId,false,0]
                }
                database().query(adminApprovalQuery, (error, results) => {
                    if (error) {
                        console.log(error)
                        reject({ code: 400, message: "Database Error", data: {} });
                        return;
                    }
                })
                var desc=_body.description
                var description=desc.fontsize(3).bold()
                var subject="ellow.io ACCOUNT REJECTION MAIL "
                var textFormat = config.rejectText.firstLine + config.nextLine + config.rejectText.secondLine + config.nextLine+description+config.nextLine+config.rejectText.thirdLine + config.nextLine + config.rejectText.fourthLine + config.nextLine + config.rejectText.fifthLine
                sendMail(_body.email, subject, textFormat, function (err, data) {
                    if (err) {
                        console.log(err)
                        reject({ code: 400, message: "Mailer Error", data: {} });
                        return;
                    }
                    console.log('An admin rejection message has been sent to your email!!!');
                });
                resolve({ code: 200, message: "User Rejection Successfull", data: {} });


            }       
    })
}
