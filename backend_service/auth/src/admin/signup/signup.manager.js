"use strict";
const fs = require('fs');
const jwt = require("jsonwebtoken");
const AppConfig = require.main.require("../config/config.json");
const signupQuery = require('./query/signup.query.json');
const DefaultPolicy = require('./query/policy.json');
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
        if (Object.prototype.toString.call(_body.firstName) != '[object String]' || _body.firstName == '') {
            reject('406: Invalid FirstName.');
            return;
        }
        if (Object.prototype.toString.call(_body.lastName) != '[object String]' || _body.lastName == '') {
            reject('406: Invalid LastName.');
            return;
        }
        if (Object.prototype.toString.call(_body.email) != '[object String]' || _body.email == '') {
            reject('406: Invalid Email.');
            return;
        }
        if (Object.prototype.toString.call(_body.phoneNo) != '[object String]' || _body.phoneNo == '') {
            reject('406: Invalid PhoneNo.');
            return;
        }
        resolve(true);
    });
};

async function validateUniqueUsername(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.validateUsername, [_body.username], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length > 0) {
                reject('406: Username already exist.');
                return;
            }
            resolve(true);
        });
    });
}

async function validateUniqueEmail(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.validateEmail, [_body.email], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length > 0) {
                reject('406: Email already exist.');
                return;
            }
            resolve(true);
        });
    });
}

async function validateUniquePhoneNo(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.validatePhone, [_body.phoneNo], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if (results.length > 0) {
                reject('406: PhoneNo already exist.');
                return;
            }
            resolve(true);
        });
    });
}

async function doSignup(_body) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.signup, [_body.username, _body.password, _body.firstName, _body.lastName, _body.email, _body.phoneNo], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(results.insertId);
        });
    });
}

async function getSignupInfo(_userId) {
    return new Promise((resolve, reject) => {
        database().query(signupQuery.signupInfo, [_userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(results[0]);
        });
    });
}

async function savePolicy(_userId) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(`${G__dirname}data/policy/${_userId}.json`, JSON.stringify(DefaultPolicy));
            resolve(true);
        } catch (err) {
            console.error(err);
            resolve(true);
        }
    });
}

async function generateToken(_data) {
    return new Promise((resolve, reject) => {
        try{
            _data.accessToken = jwt.sign(JSON.stringify({ ..._data, createdTime: Date.now()}), AppConfig.jwt.secretKey);
            _data.expires = AppConfig.jwt.expires;
            _data.refreshToken = jwt.sign(JSON.stringify(_data), AppConfig.jwt.secretKey);
            resolve(_data);
        }catch(e){
            console.log(e);
            resolve(_data);
        }
        
    });
}

exports.validate = validate;
exports.validateUsername = validateUniqueUsername;
exports.validateEmail = validateUniqueEmail;
exports.validatePhoneNo = validateUniquePhoneNo;
exports.doSignup = doSignup;
exports.getSignupInfo = getSignupInfo;
exports.savePolicy = savePolicy;
exports.generateToken = generateToken;
