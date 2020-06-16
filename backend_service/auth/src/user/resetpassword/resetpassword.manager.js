"use strict";
const resetpasswordQuery = require('./query/resetpassword.query.json');
const database = require.main.require("./common/database/dbConnection.js");

async function validate(_body) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(_body.username) != '[object String]' || _body.username == '') {
            reject('406: Invalid Username.');
            return;
        }
        if (Object.prototype.toString.call(_body.password) != '[object String]' || _body.password == '') {
            reject('406: Invalid Password.');
            return;
        }
        if (Object.prototype.toString.call(_body.otptoken) != '[object String]' || _body.otptoken == '') {
            reject('406: Invalid OTP Token.');
            return;
        }
        resolve(true);
    });
};

async function verifyOTPToken(_data) {
    return new Promise((resolve, reject) => {
        database().query(resetpasswordQuery.verifyOTPToken, [_data.otptoken, _data.username], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length === 0) {
                return reject('404: Invalid OTPToken.');
            } else {
                _data.userId = results[0].userId;
                return resolve(_data);
            }
        });
    });
}

async function updatePassword(_data) {
    return new Promise((resolve, reject) => {
        database().query(resetpasswordQuery.updatePassword, [_data.password, _data.userId, _data.username], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            console.log(results);
            resolve(true);
        });
    });
}

async function deleteOTP(_data) {
    return new Promise((resolve, reject) => {
        database().query(resetpasswordQuery.deleteOTP, [_data.userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(true);
        });
    });
}

exports.validate = validate;
exports.verifyOTPToken = verifyOTPToken;
exports.updatePassword = updatePassword;
exports.deleteOTP = deleteOTP;