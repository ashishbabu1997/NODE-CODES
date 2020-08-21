import employeeQuery from './query/employee.query';
import database from './common/database/database';
import {sendMail} from './middleware/mailer'
import * as passwordGenerator from 'generate-password'
import {Promise} from 'es6-promise'
import * as crypto from "crypto";
import config from './config/config'
export const createEmployee = (_body) => {
    return new Promise((resolve, reject) => {
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
            client.query('BEGIN', err => {
                if (shouldAbort(err)) return
                const createCompanyQuery = {
                    name: 'createCompany',
                    text: employeeQuery.createCompany,
                    values: [_body.companyName, _body.company_website, _body.companySizeId, currentTime],
                }
                
                const getEmailQuery = {
                    name: 'get-email',
                    text: employeeQuery.getEmail,
                    values: [_body.email],
                }
                database().query(getEmailQuery, (error, results) => {
                    if (error) {
                        reject({ code: 400, message: "Error in database connection.", data:{} });
                        return;
                    }
                    if(results.rowCount >=1)
                    {
                        reject({ code: 400, message: "Email Already exists.", data:{} });
                        return;  
                    }
                    
                });
                client.query(createCompanyQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const companyId = res.rows[0].company_id
                    const createEmployeeQuery = {
                        name: 'createEmployee',
                        text: employeeQuery.createEmployee,
                        values: [_body.firstName, _body.lastName,_body.email, _body.accountType, companyId, _body.telephoneNumber, _body.roleId, currentTime,true],
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
                                const mailId=_body.email
                                const password = passwordGenerator.generate({
                                        length: 10,
                                        numbers: true
                                    });
                                var hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                                const subject = " ELLOW LOGIN PASSWORD "
                                const storePasswordQuery = {
                                        name: 'store-encrypted-password',
                                        text: employeeQuery.storePassword,
                                        values: [hashedPassword,mailId],
                                }
                                database().query(storePasswordQuery, (error, results) => {
                                        if (error) {
                                          console.log(error)
                                          return;
                                        }
                                })
                                var textFormat=config.text.firstLine+config.nextLine+config.text.secondLine+config.nextLine+config.text.thirdLine+config.nextLine+password+config.nextLine
                                sendMail(mailId, subject, textFormat, function (err, data) {
                                    if (err) {
                                      console.log(err)
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
}