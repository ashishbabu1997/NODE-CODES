"use strict";
const axios = require('axios');
const AppConfig = require('../../../config/config.json');
const forgotpasswordQuery = require('./query/forgotpassword.query.json');
const database = require.main.require("./common/database/dbConnection.js");

async function validate(_body) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(_body.username) != '[object String]' || _body.username == '') {
            reject('406: Invalid Username.');
            return;
        }
        resolve(true);
    });
};

async function generateOTP() {
    return new Promise((resolve, reject) => {
        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return resolve(OTP);
    });
}

async function generateOTPToken() {
    return new Promise((resolve, reject) => {
        let d = new Date().getTime();
        let otpToken = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return resolve(otpToken);
    });
}

async function getUserDetails(_userName) {
    return new Promise((resolve, reject) => {
        database().query(forgotpasswordQuery.getUserDetails, [_userName], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length === 0) {
                return reject('404: User Not Found.');
            } else {
                return resolve(results[0]);
            }
        });
    });
}

async function checkForgotpasswordData(_userId) {
    return new Promise((resolve, reject) => {
        database().query(forgotpasswordQuery.checkForgotpasswordData, [_userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length > 0) resolve(true);
            else resolve(false);
        });
    });
}

async function insertForgotpasswordData(_body) {
    return new Promise((resolve, reject) => {
        database().query(forgotpasswordQuery.insertForgotpasswordData, [_body.userId, _body.otp, _body.otpToken], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(true);
        });
    });
}

async function updateForgotpasswordData(_body) {
    return new Promise((resolve, reject) => {
        database().query(forgotpasswordQuery.updateForgotpasswordData, [_body.otp, _body.otpToken, _body.userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(true);
        });
    });
}

async function sendOTP(_phoneNo, _otp) {
    // OTP sent to the registered phone number
    return new Promise((resolve, reject) => {
        if (!_phoneNo) return reject("400: Bad request");
        if (!_otp) return reject("400: Bad request");

        axios.post(AppConfig.smsServerUrl, {
                number: _phoneNo,
                body: _otp+' '+AppConfig.msg.username
        })
        .then(function (response) {
            if (response.status === 200) {
                resolve({
                    notification: 'OTP sent to the registered phone number'
                });
            } else {
                reject(`${response.status}: ${response.statusText}`);
            }
        })
        .catch(function (error) {
            try{
                reject(error.response.status + ": code (" + error.response.data.code + ") moreInfo (" + error.response.data.moreInfo.replace("https://", "") + ")");
            }catch(e){
                console.log(e);
                reject('500: Unable to send OTP, please try again.');
            }
        });
    });
}

exports.validate = validate;
exports.generateOTP = generateOTP;
exports.generateOTPToken = generateOTPToken;
exports.getUserDetails = getUserDetails;
exports.checkData = checkForgotpasswordData;
exports.insertData = insertForgotpasswordData;
exports.updateData = updateForgotpasswordData;
exports.sendOTP = sendOTP;