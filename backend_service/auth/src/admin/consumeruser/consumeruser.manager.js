"use strict";
const jwt = require("jsonwebtoken");
const AppConfig = require.main.require("../config/config.json");
const consumerUserQuery = require('./query/consumeruser.query.json');
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


async function getConsumerUserList() {
    return new Promise((resolve, reject) => {
        database().query(consumerUserQuery.getConsumerUserList, [], function (error, results) {
            if (error) {
                console.error(error);
                reject('500: Internal server error, please try after sometime.');
                return;
            }
            resolve(results);
        });
    });
}


exports.validateToken = validateToken;
exports.getConsumerUserList = getConsumerUserList;
