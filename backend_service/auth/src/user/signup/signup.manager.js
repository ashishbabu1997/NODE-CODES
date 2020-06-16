const signupQuery = require('./query/signup.query.json');
const database = require.main.require("./common/database/dbConnection.js");

async function validate(_body) {
    return new Promise((resolve, reject) => {
        if (_body.hasOwnProperty('companySizeId') == false) {
            reject('406: Company Size Is Required.');
            return;
        }
        if (_body.hasOwnProperty('roleId') == false) {
            reject('406: Role Is Required.');
            return;
        }
        if (Number(_body.companySizeId) == 'NaN' || _body.companySizeId == '' || isFinite(_body.companySizeId) == false) {
            reject('406: Invalid Company Size.');
            return;
        }
        if (Number(_body.roleId) == 'NaN' || _body.roleId == '' || isFinite(_body.roleId) == false) {
            reject('406: Invalid Role.');
            return;
        }
        if (_body.accountType.toLowerCase() != 'buyer' && _body.accountType.toLowerCase() != 'seller') {
            reject('406: Invalid Account Type');
            return;
        }
        resolve(true);
    });
};

async function insertCompany(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.insertCompany, [_body.companyName, _body.companyWebsite, _body.companySizeId], function (error, results) {
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

async function insertEmployee(_body, companyId) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.insertEmployee, [_body.firstName, _body.lastName, _body.accountType, companyId, _body.phoneNumber, _body.roleId], function (error, results) {
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
exports.insertCompany = insertCompany;
exports.insertEmployee = insertEmployee;