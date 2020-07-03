import employeeQuery  from './query/employee.query';
import database from './common/database/database';

export const createCompany = (_body) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'createCompany',
            text: employeeQuery.createCompany,
            values: [_body.companyName, _body.company_website, _body.companySizeId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(query);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve(results.rows[0].company_id);
        })
    });
}

 export const createEmployee = (_body, companyId) => {
    return new Promise((resolve, reject) => {
        const query = {
            name: 'createEmployee',
            text: employeeQuery.createEmployee,
            values: [_body.firstName, _body.lastName, _body.accountType, companyId, _body.telephoneNumber, _body.roleId],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(query);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employee added successfully", data: {} });
        })
    });
}