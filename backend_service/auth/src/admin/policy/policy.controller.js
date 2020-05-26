"use strict";
let ResponseManager = require.main.require('./common/response/response');
let policyManager = require('./policy.manager');

async function getPolicy(request, response, next) {
    let validateTokenRes = await policyManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if (typeof validateTokenRes === "undefined") return;

    await policyManager.readPolicy(request.query.userId).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
}

async function putPolicy(request, response, next) {
    let validateTokenRes = await policyManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if (typeof validateTokenRes === "undefined") return;
    
    let validateRes = await policyManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if (validateRes !== true) return;
    
    await policyManager.writePolicy(request.query.userId, request.body.policy).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
}

module.exports.get = getPolicy;
module.exports.put = putPolicy;
