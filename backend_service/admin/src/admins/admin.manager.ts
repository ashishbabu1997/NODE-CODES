import admineQuery from './query/admin.query';
import database from '../common/database/database';
import { sendMail } from '../middleware/mailer'
import * as passwordGenerator from 'generate-password'
import * as crypto from "crypto";
import config from '../config/config'

export const listUsersDetails = (_body) => {
    return new Promise((resolve, reject) => {
        var selectQuery = admineQuery.listUsers;
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND LOWER(p.company_name) LIKE '%" + _body.filter.toLowerCase() + "%'";
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
        if (_body.filter) {
            selectQuery = selectQuery + " " + "AND LOWER(p.company_name) LIKE '%" + _body.filter.toLowerCase() + "%'";
        }
        var orderBy = ' ORDER BY p.created_on DESC';
        selectQuery = selectQuery + orderBy;

        const listquery = {
            name: 'list-candidates',
            text: selectQuery,
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
            values: [_body.employeeId]
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
                        values: [_body.employeeId,hashedPassword]
                    }
                    var approveResult = await client.query(adminApprovalQuery);
                    var email = approveResult.rows[0].email;

                    const subject = " ellow.io LOGIN PASSWORD "
                    var textFormat = config.text.firstLine + config.nextLine + config.text.secondLine + config.nextLine + config.text.thirdLine + config.nextLine + config.text.password + password + config.nextLine + config.text.fourthLine + config.nextLine + config.text.fifthLine
                    sendMail(email, subject, textFormat, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Mailer Error", data: {} });
                            return;
                        }
                    });
                    await client.query('COMMIT'); 
                    resolve({ code: 200, message: "User Approval Successfull", data: {} });
                }
                else {
                    const adminRejectQuery = {
                        name: 'admin-panel',
                        text: admineQuery.clearanceQuery,
                        values: [_body.employeeId, false, 0]
                    }
                    await client.query(adminRejectQuery);

                    var desc = _body.description
                    var description = desc.fontsize(3).bold()
                    var subject = "ellow.io ACCOUNT REJECTION MAIL "
                    var textFormat = config.rejectText.firstLine + config.nextLine + config.rejectText.secondLine + config.nextLine + description + config.nextLine + config.rejectText.thirdLine + config.nextLine + config.rejectText.fourthLine + config.nextLine + config.rejectText.fifthLine
                    sendMail(email, subject, textFormat, function (err, data) {
                        if (err) {
                            console.log(err)
                            reject({ code: 400, message: "Mailer Error", data: {} });
                            return;
                        }
                    });
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