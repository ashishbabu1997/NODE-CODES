"use strict";
let ResponseManager = require.main.require('./common/response/response');
let consumeruserManager = require('./consumeruser.manager');

async function getConsumerUserList(request, response, next) {

    let validateTokenRes = await consumeruserManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if(typeof validateTokenRes === "undefined") return;

    consumeruserManager.getConsumerUserList().then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
    
}


module.exports = getConsumerUserList;
