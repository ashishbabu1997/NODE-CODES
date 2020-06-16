"use strict";
let ResponseManager = require.main.require('./common/response/response');

async function logout(request, response, next) {
    
    console.log(request.params.token);
    ResponseManager.sendResponse.call(this, response, true);

}

module.exports = logout;
