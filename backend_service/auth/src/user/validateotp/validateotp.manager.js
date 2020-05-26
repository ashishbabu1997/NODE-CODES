"use strict";
const validateotpQuery = require('./query/validateotp.query.json');
const database = require.main.require("./common/database/dbConnection.js");

async function validate(_body) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(_body.type) != '[object String]' || _body.type == '') {
            reject('406: Invalid Type.');
            return;
        }
        if (Object.prototype.toString.call(_body.username) != '[object String]' || _body.username == '') {
            reject('406: Invalid Username.');
            return;
        }
        if (Object.prototype.toString.call(_body.otp) != '[object String]' || _body.otp == '') {
            reject('406: Invalid OTP.');
            return;
        }
        resolve(true);
    });
};

async function getUserId(_userName) {
    return new Promise((resolve, reject) => {
        database().query(forgotpasswordQuery.getUserId, [_userName], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length === 0) {
                return reject('404: User Not Found.');
            } else {
                return resolve(results[0].userId);
            }
        });
    });
}

async function getOTPToken(_data) {
    return new Promise((resolve, reject) => {
        database().query(validateotpQuery.getOTPToken, [_data.otp, _data.username], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length === 0) return reject('404: Invalid data.');
            else resolve(results[0]);
        });
    });
}

exports.validate = validate;
exports.getUserId = getUserId;
exports.getOTPToken = getOTPToken;