import employeeQuery from './query/employee.query';
import database from './common/database/database';
import {sendMail} from './middleware/mailer'
import * as passwordGenerator from 'generate-password'
import {Promise} from 'es6-promise'
import * as crypto from "crypto";
export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        console.log("Hello")
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
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const createCompanyQuery = {
                    name: 'createCompany',
                    text: employeeQuery.createCompany,
                    values: [_body.companyName, _body.company_website, _body.companySizeId, currentTime],
                }
                client.query(createCompanyQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const companyId = res.rows[0].company_id
                    const createEmployeeQuery = {
                        name: 'createEmployee',
                        text: employeeQuery.createEmployee,
                        values: [_body.firstName, _body.lastName, _body.accountType, companyId, _body.telephoneNumber, _body.roleId, currentTime, _body.employeeId],
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
                            client.query('COMMIT', err => {
                                if (err) {
                                    console.error('Error committing transaction', err.stack)
                                    reject({ code: 400, message: "Failed. Please try again.", data: {} });
                                    return;
                                }
                                const getEmailQuery = {
                                    name: 'add-email-otp',
                                    text: employeeQuery.getEmail,
                                    values: [_body.employeeId],
                                }
                                database().query(getEmailQuery, (error, results) => {
                                    if (error) {
                                        reject({ code: 400, message: "Error in database connection.", data:{} });
                                        return;
                                    }
                                    const mailId=results.rows[0].email
                                    const password = passwordGenerator.generate({
                                        length: 10,
                                        numbers: true
                                });
                                var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                                const subject = " ELLOW LOGIN PASSWORD "
                                const storePasswordQuery = {
                                        name: 'store-encrypted-password',
                                        text: employeeQuery.storePassword,
                                        values: [hashedPassword,_body.employeeId],
                                }
                                database().query(storePasswordQuery, (error, results) => {
                                        if (error) {
                                          console.log(error)
                                          return;
                                        }
                                })
                                sendMail(mailId, subject, "Your password is: " + password, function (err, data) {
                                    if (err) {
                                      console.log(error)
                                      return;
                                    }
                                    console.log('A password has send to your email !!!');
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
}