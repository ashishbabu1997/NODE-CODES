"use strict";
exports.__esModule = true;
var Joi = require("@hapi/joi");
exports["default"] = Joi.object().keys({
    profileUrl: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            console.log(err);
            switch (err.code) {
                case "any.required":
                    err.message = "Profile URL should not be empty!";
                    break;
                case "string.base":
                    err.message = "Profile URL must be a string";
                    break;
                default:
                    err.message = "Invalid Profile URL";
                    break;
            }
        });
        return errors;
    }),
    description: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Description  should not be empty!";
                    break;
                case "string.base":
                    err.message = "Description should be string";
                    break;
                default:
                    err.message = "Description is invalid";
                    break;
            }
        });
        return errors;
    }),
    logo: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "logo  should not be empty!";
                    break;
                case "string.base":
                    err.message = "logo should be string";
                    break;
                default:
                    err.message = "logo is invalid";
                    break;
            }
        });
        return errors;
    }),
    coverPage: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Cover Page  should not be empty!";
                    break;
                case "string.base":
                    err.message = "Cover Page should be string";
                    break;
                default:
                    err.message = "Cover Page is invalid";
                    break;
            }
        });
        return errors;
    }),
    tagline: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Tagline  should not be empty!";
                    break;
                case "string.base":
                    err.message = "Tagline should be string";
                    break;
                default:
                    err.message = "Tagline is invalid";
                    break;
            }
        });
        return errors;
    }),
    facebookId: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Facebook Id should not be empty";
                    break;
                case "string.base":
                    err.message = "Facebook Id must be a string of charectors";
                    break;
                default:
                    err.message = "Invalid Facebook Id";
                    break;
            }
        });
        return errors;
    }),
    instagramId: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Instagram Id should not be empty";
                    break;
                case "string.base":
                    err.message = "Instagram Id must be a string of charectors";
                    break;
                default:
                    err.message = "Invalid Instagram Id";
                    break;
            }
        });
        return errors;
    }),
    twitterId: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Twitter Id should not be empty";
                    break;
                case "string.base":
                    err.message = "Twitter Id must be a string of charactors";
                    break;
                default:
                    err.message = "Invalid Twitter Id";
                    break;
            }
        });
        return errors;
    }),
    linkedinId: Joi.string().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Linkedin Id should not be empty";
                    break;
                case "string.base":
                    err.message = "Linkedin Id must be a string of charectors";
                    break;
                default:
                    err.message = "Invalid Linkedin Id";
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(function (errors) {
        errors.forEach(function (err) {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Id should not be empty";
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
