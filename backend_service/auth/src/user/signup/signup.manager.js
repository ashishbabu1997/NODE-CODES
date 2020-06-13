const signupQuery = require('./query/signup.query.json');
const database = require.main.require("./common/database/dbConnection.js");

async function validate(_body) {
    return new Promise((resolve, reject) => {
        if (Number(_body.companySizeId) == 'NaN' || _body.companySizeId == '') {
            reject('406: Invalid Company Size.');
            return;
        }
        if (Number(_body.roleId) == 'NaN' || _body.roleId == '') {
            reject('406: Invalid Role.');
            return;
        }
        resolve(true);
    });
};

async function validateCompanySize(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.validateCompanySize, [_body.companySizeId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.rows.length == 0) {
                reject('406: CompanySize does not exist.');
                return;
            }
            resolve(true);
        });
    });
}

async function validateRole(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.validateRole, [_body.roleId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.rows.length == 0) {
                reject('406: Role does not exist.');
                return;
            }
            resolve(true);
        });
    });
}

async function validateRole(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.validateRole, [_body.roleId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.rows.length == 0) {
                reject('406: role does not exist.');
                return;
            }
            resolve(true);
        });
    });
}

async function insertCompany(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.insertCompany, [_body.companyName, _body.companyWebsite, _body.companySizeId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
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
                reject('500: Internal server error, please try after sometime.');
                return;
            }

            resolve({ employeeId: results.rows[0].pk_id })
        });
    });
}


exports.validate = validate;
exports.validateCompanySize = validateCompanySize;
exports.validateRole = validateRole
exports.insertCompany = insertCompany;
exports.insertEmployee = insertEmployee;