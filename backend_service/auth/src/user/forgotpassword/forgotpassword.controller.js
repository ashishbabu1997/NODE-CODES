"use strict";
let ResponseManager = require.main.require('./common/response/response');
let forgotPasswordManager = require('./forgotpassword.manager');

async function forgotPassword(request, response, next) {
    
    let validateRes = await forgotPasswordManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(validateRes !== true) return;

    let otp = await forgotPasswordManager.generateOTP().catch(ResponseManager.catchError.bind(this, response));
    if(typeof otp === "undefined") return;

    let otpToken = await forgotPasswordManager.generateOTPToken().catch(ResponseManager.catchError.bind(this, response));
    if(typeof otpToken === "undefined") return;

    let userDetails = await forgotPasswordManager.getUserDetails(request.body.username).catch(ResponseManager.catchError.bind(this, response));
    if(typeof userDetails === "undefined") return;

    let checkExistingOTP = await forgotPasswordManager.checkData(userDetails.userId).catch(ResponseManager.catchError.bind(this, response));
    if(typeof checkExistingOTP === "undefined") return;

    let _payload = {
        userId: userDetails.userId,
        otp: otp,
        otpToken: otpToken
    };

    let storeDataRes;
    if(checkExistingOTP === true){
        storeDataRes = await forgotPasswordManager.updateData(_payload).catch(ResponseManager.catchError.bind(this, response));
    }

    if(checkExistingOTP === false){
        storeDataRes = await forgotPasswordManager.insertData(_payload).catch(ResponseManager.catchError.bind(this, response));
    }

    if(typeof storeDataRes === "undefined") return;

    await forgotPasswordManager.sendOTP(userDetails.phoneNo, otp).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));

}

module.exports = forgotPassword;
