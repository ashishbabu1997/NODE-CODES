import * as Joi from '@hapi/joi';

export default Joi.object().keys({ 
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
    // roleId: Joi.number().required().error(errors => {
    //     errors.forEach(err => {
    //         switch (err.code) {
    //             case "any.required":
    //                 err.message = "Role Id should not be empty!";
    //                 break;
    //             case "number.base":
    //                 err.message = "Role Id must be a number"
    //                 break;
    //             default:
    //                 err.message = "Invalid Role Id"
    //                 break;
    //         }
    //     });
    //     return errors;
    // }),
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
    }),
    // company_website: Joi.string().required().regex( /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/i).error(errors => {
    //     errors.forEach(err => {
    //         switch (err.code) {
    //             case "any.required":
    //                 err.message = "Company Website should not be empty";
    //                 break;
    //             case "string.base":
    //                 err.message = "Company Website must be a string"
    //                 break;
    //             default:
    //                 err.message = "Invalid Company Website"
    //                 break;
    //         }
    //     });
    //     return errors;
    // }),
    // companySizeId: Joi.number().required().error(errors => {
    //     errors.forEach(err => {
    //         switch (err.code) {
    //             case "any.required":
    //                 err.message = "Company Size Id should not be empty!";
    //                 break;
    //             case "number.base":
    //                 err.message = "Company Size Id must be a number"
    //                 break;
    //             default:
    //                 err.message = "Invalid Company Size Id"
    //                 break;
    //         }
    //     });
    //     return errors;
    // })
}).unknown(true);