"use strict";
let ResponseManager = require.main.require('./common/response/response');
let loginManager = require('./login.manager');

async function login(request, response, next) {

    let validationRes = await loginManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if (validationRes !== true) return;
    
    let userId = await loginManager.doLogin(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(typeof userId === "undefined") return;

    let loginResult = await loginManager.getLoginInfo(userId).catch(ResponseManager.catchError.bind(this, response));
    if(typeof loginResult === "undefined") return;

    let tokenRes = await loginManager.generateToken(loginResult).catch(ResponseManager.catchError.bind(this, response));
    if(typeof tokenRes === "undefined") return;
    
    let loginRes = {
        userId: userId,
        tokens: tokenRes
    }

    return ResponseManager.sendResponse(response, loginRes);
}

module.exports = login;
