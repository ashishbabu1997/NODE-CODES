"use strict";
let ResponseManager = require.main.require('./common/response/response');
let resetpasswordManager = require('./resetpassword.manager');

async function resetpassword(request, response, next) {
    
    let validateRes = await resetpasswordManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(validateRes !== true) return;

    let verifyOTPTokenRes = await resetpasswordManager.verifyOTPToken(request.body).catch(ResponseManager.catchError.bind(this, response));
    console.log(verifyOTPTokenRes);
    if(typeof verifyOTPTokenRes === "undefined") return;

    let updatePasswordRes = await resetpasswordManager.updatePassword(verifyOTPTokenRes).catch(ResponseManager.catchError.bind(this, response));
    if(updatePasswordRes !== true) return;

    await resetpasswordManager.deleteOTP(verifyOTPTokenRes).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));

}

module.exports = resetpassword;
