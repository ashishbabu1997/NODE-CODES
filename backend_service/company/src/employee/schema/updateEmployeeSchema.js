"use strict";
exports.__esModule = true;
var Joi = require("@hapi/joi");
exports["default"] = Joi.object().keys({
    empId: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Firstname should not be empty";
                    break;
                case "number.base":
                    err.message = "employeeId must be a number";
                    break;
                default:
                    err.message = "Invalid employeeId";
                    break;
            }
        });
        return errors;
    }),
    decisionValue: Joi.number().allow('').error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "number.base":
                    err.message = "decisionValue must be a number";
                    break;
                default:
                    err.message = "Invalid decisionValue";
                    break;
            }
        });
        return errors;
    })
}).unknown(true);
