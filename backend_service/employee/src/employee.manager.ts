import employeeQuery  from './query/employee.query';
import database from './common/database/database';

export const createCompany = (_body) => {
    console.log(_body);
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'createCompany',
            text: employeeQuery.createCompany,
            values: [_body.companyName, _body.company_website, _body.companySizeId, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log("This is the new error " + error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve(results.rows[0].company_id);
        })
    });
}

 export const createEmployee = (_body, companyId) => {
    return new Promise((resolve, reject) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const query = {
            name: 'createEmployee',
            text: employeeQuery.createEmployee,
            values: [_body.firstName, _body.lastName, _body.accountType, companyId, _body.telephoneNumber, _body.roleId, currentTime],
        }
        database().query(query, (error, results) => {
            if (error) {
                console.log(error);
                reject({ code: 400, message: "Failed. Please try again.", data: {} });
                return;
            }
            resolve({ code: 200, message: "Employee added successfully", data: {} });
        })
    });
}