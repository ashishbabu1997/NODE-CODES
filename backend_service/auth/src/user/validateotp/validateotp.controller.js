"use strict";
let ResponseManager = require.main.require('./common/response/response');
let validateotpManager = require('./validateotp.manager');

async function validateotp(request, response, next) {
    
    let validateRes = await validateotpManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(validateRes !== true) return;

    request.body.otp = parseInt(request.body.otp);
    await validateotpManager.getOTPToken(request.body).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));

}

module.exports = validateotp;
