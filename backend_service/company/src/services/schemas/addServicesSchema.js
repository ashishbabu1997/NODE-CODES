"use strict";
exports.__esModule = true;
var Joi = require("@hapi/joi");
exports["default"] = Joi.object().keys({
    services: Joi.array().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case 'number.base':
                    err.message = 'Services must be an Array';
                    break;
                case 'any.required':
                    err.message = 'Services is required';
                    break;
                default:
                    err.message = 'Invalid Services';
                    break;
            }
        });
        return errors;
    }),
    domains: Joi.array().required().error(function (error) {
        switch (error[0].type) {
            case 'number.base':
                return {
                    message: 'Domains must be an Array'
                };
            case 'any.required':
                return {
                    message: 'Domains is required'
                };
            default:
                return {
                    message: 'Invalid Domains'
                };
        }
    }),
    technologyAreas: Joi.array().required().error(function (error) {
        switch (error[0].type) {
            case 'number.base':
                return {
                    message: 'Technology areas must be an Array'
                };
            case 'any.required':
                return {
                    message: 'Technology areas is required'
                };
            default:
                return {
                    message: 'Invalid Technology areas'
                };
        }
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
    }),
    supportingDocument: Joi.string().allow('').error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "string.base":
                    err.message = "Supporting document must be a string";
                    break;
                default:
                    err.message = "Invalid supporting Document";
                    break;
            }
        });
        return errors;
    })
}).unknown(true);
