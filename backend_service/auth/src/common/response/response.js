"use strict";

let catchError = (response, msg) => {
    let _msgArray = msg.split(":");
    let code = 500;
    let message = "";
    if (_msgArray.length === 2) {
        code = _msgArray[0];
        message = _msgArray[1];
    } else if (_msgArray.length === 1) {
        message = _msgArray[0];
    }
    response.status(code).json({
        status:0,
        message: message,
        data:{}
    });
};

let sendResponse = (response, message, data) => {
    //response.status(200).json(data);
    response.status(200).json({
        status: 1,
        message: message,
        data: data
    })
};

exports.catchError = catchError;
exports.sendResponse = sendResponse;
