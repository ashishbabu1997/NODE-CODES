"use strict";
let ResponseManager = require.main.require('./common/response/response');
let profileManager = require('./profile.manager');

async function getProfile(request, response, next) {

    let validateTokenRes = await profileManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if(typeof validateTokenRes === "undefined") return;

    request.params.userId = parseInt(request.params.userId);
    if(request.params.userId !== validateTokenRes.userId){
        return ResponseManager.catchError.call(this, response, '401: UnAuthorization');
    }

    profileManager.getUserProfile(request.params.userId).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));
    
}

async function putProfile(request, response, next) {

    let validateTokenRes = await profileManager.validateToken(request.headers.authorization).catch(ResponseManager.catchError.bind(this, response));
    if(typeof validateTokenRes === "undefined") return;

    request.params.userId = parseInt(request.params.userId);
    if(request.params.userId !== validateTokenRes.userId){
        return ResponseManager.catchError.call(this, response, '401: UnAuthorization');
    }

    let putUserProfileRes = await profileManager.putUserProfile(request.body, request.params.userId).catch(ResponseManager.catchError.bind(this, response));
    if (putUserProfileRes !== true) return;

    profileManager.getUserProfile(request.params.userId).then(ResponseManager.sendResponse.bind(this, response)).catch(ResponseManager.catchError.bind(this, response));

}

module.exports.get = getProfile;
module.exports.put = putProfile;
