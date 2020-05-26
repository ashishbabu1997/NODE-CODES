"use strict";
let ResponseManager = require.main.require('./common/response/response');
let signupManager = require('./signup.manager');

async function signup(request, response, next) {

    let validationRes = await signupManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if (validationRes !== true) return;

    let validateUsernameRes = await signupManager.validateUsername(request.body).catch(ResponseManager.catchError.bind(this, response));
    if (validateUsernameRes !== true) return;

    let validateEmailRes = await signupManager.validateEmail(request.body).catch(ResponseManager.catchError.bind(this, response));
    if (validateEmailRes !== true) return;

    let validatePhoneNoRes = await signupManager.validatePhoneNo(request.body).catch(ResponseManager.catchError.bind(this, response));
    if (validatePhoneNoRes !== true) return;
    
    let signupResult = await signupManager.doSignup(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(typeof signupResult === "undefined") return;

    let signupInfo = await signupManager.getSignupInfo(signupResult).catch(ResponseManager.catchError.bind(this, response));
    if(typeof signupInfo === "undefined") return;
    
    await signupManager.savePolicy(signupResult);

    await signupManager.generateToken(signupInfo).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
    
}

module.exports = signup;
