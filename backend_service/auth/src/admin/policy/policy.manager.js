"use strict";
const fs = require('fs');
const jwt = require("jsonwebtoken");
const AppConfig = require.main.require("../config/config.json");

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
        if (Object.prototype.toString.call(_body.policy) != '[object Array]') {
            reject('406: Invalid Policy.');
            return;
        }
        resolve(true);
    });
};

async function readPolicy(_userId) {
    return new Promise((resolve, reject) => {
        try{
            let policy = fs.readFileSync(`${G__dirname}data/policy/${_userId}.json`);
            let policyRes = {
                userId: _userId,
                policy: JSON.parse(policy.toString())
            };
            resolve(policyRes);
        }catch(e){
            console.log(e);
            reject('404: Policy not found.');
        }
    });
}

async function writePolicy(_userId, _payload) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(`${G__dirname}data/policy/${_userId}.json`, JSON.stringify(_payload));
            resolve(true);
        } catch (err) {
            console.error(err);
            reject('500: Internal server error, please try after sometime.');
        }
    });
    
}

exports.validateToken = validateToken;
exports.validate = validate;
exports.readPolicy = readPolicy;
exports.writePolicy = writePolicy;