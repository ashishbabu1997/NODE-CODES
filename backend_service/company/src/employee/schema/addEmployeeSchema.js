"use strict";
exports.__esModule = true;
var Joi = require("@hapi/joi");
exports["default"] = Joi.object().keys({
    firstName: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Firstname should not be empty";
                    break;
                case "string.base":
                    err.message = "Firstname must be a string";
                    break;
                default:
                    err.message = "Invalid Firstname";
                    break;
            }
        });
        return errors;
    }),
    lastName: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Lastname should not be empty";
                    break;
                case "string.base":
                    err.message = "Lastname must be a string";
                    break;
                default:
                    err.message = "Invalid Lastname";
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "company Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "company Id must be a number";
                    break;
                default:
                    err.message = "Invalid company Id";
                    break;
            }
        });
        return errors;
    }),
    email: Joi.string().required().email({ minDomainSegments: 2 }).error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Email should not be empty";
                    break;
                case "string.base":
                    err.message = "Email must be a string";
                    break;
                default:
                    err.message = "Invalid Email";
                    break;
            }
        });
        return errors;
    }),
    roleId: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Role Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Role Id must be a number";
                    break;
                default:
                    err.message = "Invalid Role Id";
                    break;
            }
        });
        return errors;
    }),
    document: Joi.string().allow('').error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "string.base":
                    err.message = "Document name must be a string";
                    break;
                default:
                    err.message = "Invalid Document name";
                    break;
            }
        });
        return errors;
    }),
    contactNumber: Joi.string().allow('').error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "string.base":
                    err.message = "Contact Number must be a string";
                    break;
                default:
                    err.message = "Invalid Contact Number";
                    break;
            }
        });
        return errors;
    })
}).unknown(true);
