import employeeQuery from './query/employee.query';
import database from './common/database/database';
import { sendMail } from './middleware/mailer'
import * as passwordGenerator from 'generate-password'
import { Promise } from 'es6-promise'
// import * as crypto from "crypto";
import config from './config/config'
export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const mailId = _body.email
        const loweremailId = mailId.toLowerCase()
        const currentTime = Math.floor(Date.now() / 1000);
        database().connect((err, client, done) => {
            const shouldAbort = err => {
                if (err) {
                    console.error('Error in transaction', err.stack)
                    client.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                            reject({ code: 400, message: "Failed. Please try again.", data: {} });
                            return;
                        }
                        done();
                        reject({ code: 400, message: "Failed. Please try again.", data: {} });

                    })
                }
                return !!err
            }
            const getEmailQuery = {
                name: 'get-email',
                text: employeeQuery.getEmail,
                values: [loweremailId],
            }
            database().query(getEmailQuery, (error, results) => {
                if (error) {
                    reject({ code: 400, message: "Error in database connection.", data: {} });
                    return;
                }
                if (results.rowCount >= 1) {
                    var adminStatus = results.rows[0].admin_approve_status
                    var emailId=results.rows[0].email
                    if (emailId == loweremailId) {
                        if (adminStatus==2)
                        {
                            reject({ code: 400,statusCode:406, message: "Your account is held for admins approval", data: {} });
                            return;
                        }
                        else if(adminStatus==1)
                        {
                            reject({ code: 400,statusCode:407, message: "Your are a registered", data: {} });
                            return;
                        }
                        else if(adminStatus==0)
                        {
                            reject({ code: 400,statusCode:408, message: "This account is rejected by our admin panel", data: {} });
                            return;
                        }
                    }

                }
                client.query('BEGIN', err => {
                    if (shouldAbort(err)) return
                    const createCompanyQuery = {
                        name: 'createCompany',
                        text: employeeQuery.createCompany,
                        values: [_body.companyName, currentTime],
                    }
                    client.query(createCompanyQuery, (err, res) => {
                        if (shouldAbort(err)) return
                        const companyId = res.rows[0].company_id
                        const createEmployeeQuery = {
                            name: 'createEmployee',
                            text: employeeQuery.createEmployee,
                            values: [_body.firstName, _body.lastName, loweremailId, _body.accountType, companyId, _body.telephoneNumber, currentTime,2,false,2],
                        }
                        client.query(createEmployeeQuery, (err, res) => {
                            if (shouldAbort(err)) return
                            const createSettingsQuery = {
                                name: 'createSettings',
                                text: employeeQuery.createSettings,
                                values: [companyId, currentTime],
                            }
                            client.query(createSettingsQuery, (err, res) => {
                                if (shouldAbort(err)) return
                                const hiringStepDetails = config.defaultHiringStep;
                                const hiringStageDetails = hiringStepDetails.hiringStages;
                                const addHiringStepQuery = {
                                    name: 'add-hiring-steps',
                                    text: employeeQuery.addHiringSteps,
                                    values: [companyId, hiringStepDetails.hiringStepName, hiringStepDetails.description, currentTime, currentTime],
                                }
                                client.query(addHiringStepQuery, (err, res) => {
                                    if (shouldAbort(err)) return
                                    const hiringStages = hiringStageDetails;
                                    const hiringStepId = res.rows[0].hiring_step_id;
                                    let hiringStageValues = ''
                                    const length = hiringStages.length;
                                    hiringStages.forEach((element, i) => {
                                        const end = i != length - 1 ? "," : ";"
                                        hiringStageValues = hiringStageValues + "('" + element.hiringStageName + "','" + element.hiringStageDescription + "'," + hiringStepId + "," + element.hiringStageOrder + "," + currentTime + "," + currentTime + ")" + end
                                    });
                                    const query = employeeQuery.addHiringStages + hiringStageValues
                                    client.query(query, (err, res) => {
                                        if (shouldAbort(err)) return
                                        client.query('COMMIT', err => {
                                            if (err) {
                                                console.error('Error committing transaction', err.stack)
                                                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                                return;
                                            }
                                            var Name=_body.firstName.fontsize(3).bold()+" "+_body.lastName.fontsize(3).bold()
                                            var companyName=_body.companyName.fontsize(3).bold()
                                            var emailAddress=_body.email.fontsize(3).bold()
                                            var number=_body.telephoneNumber.fontsize(3).bold()
                                            var textFormat = config.text.firstLine.fontsize(3).bold() + config.nextLine +config.nextLine+ config.text.secondLine.fontsize(3).bold() + config.nextLine+config.text.thirdLine.fontsize(3).bold() + config.nextLine + config.text.name.fontsize(3).bold() + config.colon + Name+ config.nextLine + config.text.companyName.fontsize(3).bold()+config.colon+companyName+config.nextLine+config.text.email.fontsize(3).bold()+config.colon+emailAddress+config.nextLine+config.text.phone.fontsize(3).bold()+config.colon+number + config.nextLine+config.nextLine+config.text.fifthLine.fontsize(3).bold()+config.nextLine+config.text.sixthLine.fontsize(3).bold()
                                            sendMail(config.adminEmail, config.text.subject, textFormat, function (err, data) {
                                                    if (err) {
                                                            console.log(err)
                                                            reject({ code: 400, message: "Database Error", data: {} });
                                                            return;
                                                    }
                                                    console.log('Notification mail to admin has been sent !!!');
                                                    // resolve({ code: 200, message: "User Approval Successfull", data: {} });
                                            });
                                            done()
                                            resolve({ code: 200, message: "Employee added successfully", data: {} });
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}