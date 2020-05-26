"use strict";
const jwt = require("jsonwebtoken");
const AppConfig = require.main.require("../config/config.json");
const loginQuery = require('./query/login.query.json');
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
        resolve(true);
    });
};

async function doLogin(_body) {
    return new Promise((resolve, reject) => {
        database().query(loginQuery.login, [_body.username, _body.password], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if(results.length === 0){
                reject('404: User Not Found.');
                return;
            }
            resolve(results[0].userId);
        });
    });
}

async function getLoginInfo(_userId) {
    return new Promise((resolve, reject) => {
        database().query(loginQuery.loginInfo, [_userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(results[0]);
        });
    });
}


async function generateToken(_data) {
    return new Promise((resolve, reject) => {
        try{
            let tokenRes = {};
            tokenRes.accessToken = jwt.sign(JSON.stringify({ ..._data, createdTime: Date.now(), expires: AppConfig.jwt.expires}), AppConfig.jwt.secretKey);
            tokenRes.expires = AppConfig.jwt.expires;
            tokenRes.refreshToken = jwt.sign(JSON.stringify(_data), AppConfig.jwt.secretKey);
            resolve(tokenRes);
        }catch(e){
            console.log(e);
            reject('500: Internal server error, please try after sometime.');
        }
        
    });
}

exports.validate = validate;
exports.doLogin = doLogin;
exports.getLoginInfo = getLoginInfo;
exports.generateToken = generateToken;
