"use strict";
const fs = require('fs');
const jwt = require("jsonwebtoken");
const AppConfig = require.main.require("../config/config.json");
const userQuery = require('./query/user.query.json');
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


async function getUserList() {
    return new Promise((resolve, reject) => {
        database().query(userQuery.getUserList, [], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(results);
        });
    });
}

async function deleteUser(_userId) {
    return new Promise((resolve, reject) => {
        database().query(userQuery.deleteUser, [_userId], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            if(results.affectedRows === 0){
                reject('404: User Not Found.');
            }else{
                resolve(true);
            }
        });
    });
}

async function deleteUserPolicy(_userId) {
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(`${G__dirname}data/policy/${_userId}.json`);
            resolve(true);
        } catch (err) {
            console.error(err);
            resolve(true);
        }
    });
}


exports.validateToken = validateToken;
exports.getUserList = getUserList;
exports.deleteUser = deleteUser;
exports.deleteUserPolicy = deleteUserPolicy;
