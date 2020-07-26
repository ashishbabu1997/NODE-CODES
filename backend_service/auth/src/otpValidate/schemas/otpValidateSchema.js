"use strict";
exports.__esModule = true;
var Joi = require("@hapi/joi");
exports["default"] = Joi.object().keys({
    otp: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "OTP should not be empty";
                    break;
                case "string.base":
                    err.message = "OTP must be a number";
                    break;
                default:
                    err.message = "Invalid OTP";
                    break;
            }
        });
        return errors;
    })
});
