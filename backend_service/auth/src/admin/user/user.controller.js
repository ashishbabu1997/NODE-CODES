"use strict";
let ResponseManager = require.main.require('./common/response/response');
let userManager = require('./user.manager');

async function getUserList(request, response, next) {

    let validateTokenRes = await userManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if(typeof validateTokenRes === "undefined") return;

    await userManager.getUserList().then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
    
}

async function deleteUser(request, response, next) {

    let validateTokenRes = await userManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if(typeof validateTokenRes === "undefined") return;

    await userManager.deleteUserPolicy(request.params.userId).catch(ResponseManager.catchError.bind(this, response));

    await userManager.deleteUser(request.params.userId).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
    
}

module.exports.list = getUserList;
module.exports.delete = deleteUser;
