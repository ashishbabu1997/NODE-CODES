const employeeQuery = require('./query/employee.query.json');
const database = require.main.require("./common/database/dbConnection.js");
const utility=require.main.require("./common/utilities/utilities.js");

async function validate(_body) {
   
    return new Promise((resolve, reject) => {
       
        if (utility.requiredFieldCheck(_body, 'companySizeId')) {
            reject('406: Company Size Is Required.');
            return;
        }
        if (utility.requiredFieldCheck(_body, 'roleId')) {
            reject('406: Role Is Required.');
            return;
        }
        if(!utility.invalidCheck(_body.roleId))
        {
            reject('406: Invalid Role.');
            return;
        }
        if(!utility.invalidCheck(_body.companySizeId))
        {
            reject('406: Invalid Company Size.');
            return;
        }
        if (_body.accountType.toLowerCase() != 'buyer' && _body.accountType.toLowerCase() != 'seller') {
            reject('406: Invalid Account Type');
            return;
        }
       
        resolve(true);
    });
};

async function createCompany(_body) {
    return new Promise((resolve, reject) => {
        database().query(employeeQuery.createCompany, [_body.companyName, _body.companyWebsite, _body.companySizeId], function (error, results) {
            if (error) {
                console.error(error);
                if (error.code == 23503) {
                    reject('406: CompanySize does not exist.');
                }
                else {
                    reject('500: Internal server error, please try after sometime.');
                }
                return;
            }
            resolve(results.rows[0]);
        });
    });
}

async function createEmployee(_body, companyId) {
    return new Promise((resolve, reject) => {
        database().query(employeeQuery.createEmployee, [_body.firstName, _body.lastName, _body.accountType, companyId, _body.phoneNumber, _body.roleId], function (error, results) {
            if (error) {
                console.error(error);
                if (error.code == 23503) {
                    reject('406: Role does not exist.');
                }
                else {
                    reject('500: Internal server error, please try after sometime.');
                }
                return;
            }

            resolve({ employeeId: results.rows[0].pk_id })
        });
    });
}


exports.validate = validate;
exports.createCompany = createCompany;
exports.createEmployee = createEmployee;