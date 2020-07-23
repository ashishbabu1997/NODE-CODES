import employeeQuery from './query/employee.query';
import database from './common/database/database';

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
                client.query(createCompanyQuery, (err, res) => {
                    if (shouldAbort(err)) return
                    const companyId = res.rows[0].company_id
                    const createEmployeeQuery = {
                        name: 'createEmployee',
                        text: employeeQuery.createEmployee,
                        values: [_body.firstName, _body.lastName, _body.accountType, companyId, _body.telephoneNumber, _body.roleId, currentTime],
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