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
        'statusCode': code,
        'statusMessage': message
    });
};

let sendResponse = (response, data) => {
    response.status(200).json(data);
};

exports.catchError = catchError;
exports.sendResponse = sendResponse;
