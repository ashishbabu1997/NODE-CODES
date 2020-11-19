import * as Joi from '@hapi/joi';

export const companyRegistrationSchema = Joi.object().keys({ 
    firstName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Firstname should not be empty";
                break;
                case "string.base":
                err.message = "Firstname must be a string"
                break;
                default:
                err.message = "Invalid Firstname"
                break;
            }
        });
        return errors;
    }),
    lastName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Lastname should not be empty";
                break;
                case "string.base":
                err.message = "Lastname must be a string"
                break;
                default:
                err.message = "Invalid Lastname"
                break;
            }
        });
        return errors;
    }),
    accountType: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Account Type should not be empty";
                break;
                case "number.base":
                err.message = "Account Type must be a number"
                break;
                default:
                err.message = "Invalid Account Type"
                break;
            }
        });
        return errors;
    }),
    telephoneNumber: Joi.string().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "string.base":
                err.message = "Telephone Number must be a string"
                break;
                default:
                err.message = "Invalid Telephone Number"
                break;
            }
        });
        return errors;
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                err.message = "Email Address should not be empty!";
                break;
                case "string.base":
                err.message = "Email Address must be a string";
                break;
                default:
                err.message = "Invalid Email Address";
                break;
            }
        });
        return errors;
    }),
    companyName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Company Name should not be empty";
                break;
                case "string.base":
                err.message = "Company Name must be a string"
                break;
                default:
                err.message = "Invalid Company Name"
                break;
            }
        });
        return errors;
    })
}).unknown(true);


export const freelancerSchema = Joi.object().keys({ 
    firstName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Firstname should not be empty";
                break;
                case "string.base":
                err.message = "Firstname must be a string"
                break;
                default:
                err.message = "Invalid Firstname"
                break;
            }
        });
        return errors;
    }),
    lastName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Lastname should not be empty";
                break;
                case "string.base":
                err.message = "Lastname must be a string"
                break;
                default:
                err.message = "Invalid Lastname"
                break;
            }
        });
        return errors;
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                err.message = "Email Address should not be empty!";
                break;
                case "string.base":
                err.message = "Email Address must be a string";
                break;
                default:
                err.message = "Invalid Email Address";
                break;
            }
        });
        return errors;
    })
}).unknown(true);