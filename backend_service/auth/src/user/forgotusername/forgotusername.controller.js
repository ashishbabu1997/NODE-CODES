"use strict";
let ResponseManager = require.main.require('./common/response/response');
let forgotusernameManager = require('./forgotusername.manager');

async function forgotusername(request, response, next) {
    
    let validateRes = await forgotusernameManager.validate(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(validateRes !== true) return;

    let getUserDetailsRes = await forgotusernameManager.getUserDetails(request.body).catch(ResponseManager.catchError.bind(this, response));
    if(typeof getUserDetailsRes === "undefined") return;

    // let otp = await forgotusernameManager.generateOTP().catch(ResponseManager.catchError.bind(this, response));
    // if(typeof otp === "undefined") return;

    // let otpToken = await forgotusernameManager.generateOTPToken().catch(ResponseManager.catchError.bind(this, response));
    // if(typeof otpToken === "undefined") return;

    // let checkExistingOTP = await forgotusernameManager.checkData(getUserDetailsRes.userId).catch(ResponseManager.catchError.bind(this, response));
    // if(typeof checkExistingOTP === "undefined") return;

    // let _payload = {
    //     userId: getUserDetailsRes.userId,
    //     otp: otp,
    //     otpToken: otpToken
    // };

    // let storeDataRes;
    // if(checkExistingOTP === true){
    //     storeDataRes = await forgotusernameManager.updateData(_payload).catch(ResponseManager.catchError.bind(this, response));
    // }

    // if(checkExistingOTP === false){
    //     storeDataRes = await forgotusernameManager.insertData(_payload).catch(ResponseManager.catchError.bind(this, response));
    // }

    // if(typeof storeDataRes === "undefined") return;

    await forgotusernameManager.sendOTP(getUserDetailsRes.phoneNo, getUserDetailsRes.username).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));

}

module.exports = forgotusername;
