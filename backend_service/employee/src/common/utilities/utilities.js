 function invalidCheck(value) {
    if (value == '' || Number.isInteger(value) == false)
        return false;

    else
        return true;
}

function requiredFieldCheck(_body, value) {
    if (_body.hasOwnProperty(value)) {
        return false;
    }
    else
    return true;
}

exports.invalidCheck = invalidCheck;
exports.requiredFieldCheck=requiredFieldCheck;