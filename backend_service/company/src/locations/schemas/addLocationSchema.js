"use strict";
exports.__esModule = true;
var Joi = require("@hapi/joi");
exports["default"] = Joi.object().keys({
    companyAddress: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Company address should not be empty";
                    break;
                case "string.base":
                    err.message = "Company address must be a string";
                    break;
                default:
                    err.message = "Invalid Company address";
                    break;
            }
        });
        return errors;
    }),
    countryId: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            console.log(err);
            switch (err.code) {
                case "any.required":
                    err.message = "Country Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Country Id must be a number";
                    break;
                default:
                    err.message = "Invalid Country Id";
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company Id must be a number";
                    break;
                default:
                    err.message = "Invalid Company Id";
                    break;
            }
        });
        return errors;
    })
});
