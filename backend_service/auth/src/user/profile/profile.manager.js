"use strict";
const jwt = require("jsonwebtoken");
const AppConfig = require.main.require("../config/config.json");
const profileQuery = require('./query/profile.query.json');
const database = require.main.require("./common/database/dbConnection.js");

async function validateToken(token) {
    return new Promise((resolve, reject) => {
        try{
            var decoded = jwt.verify(token, AppConfig.jwt.secretKey);
            resolve(decoded);
        }catch(e){
            reject('401: UnAuthorization');
        }
        
    });
};

async function validate(_body) {
    return new Promise((resolve, reject) => {
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

async function getUserProfile(_userId) {
    return new Promise((resolve, reject) => {
        database().query(profileQuery.getUserProfile, [_userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if(results.length === 0){
                reject('404: User Not Found.');
                return;
            }
            resolve(results[0]);
        });
    });
}

async function putUserProfile(_body, _userId) {
    return new Promise((resolve, reject) => {
        database().query(profileQuery.putUserProfile, [_body.firstName, _body.lastName, _body.email, _body.phoneNo, _userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(true);
        });
    });
}

exports.validateToken = validateToken;
exports.validate = validate;
exports.getUserProfile = getUserProfile;
exports.putUserProfile = putUserProfile;
