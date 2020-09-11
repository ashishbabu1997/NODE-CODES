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
  
    email: Joi.string().required().email({ minDomainSegments: 2 }).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Email should not be empty";
                    break;
                case "string.base":
                    err.message = "Email must be a string"
                    break;
                default:
                    err.message = "Invalid Email"
                    break;
            }
        });
        return errors;
    }),
    phoneNumber: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Phone Number should not be empty!";
                    break;
                case "number.base":
                    err.message = "Phone Number must be a number"
                    break;
                default:
                    err.message = "Invalid Phone Number"
                    break;
            }
        });
        return errors;
    }),
    rate: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Rate should not be empty!";
                    break;
                case "number.base":
                    err.message = "Rate must be a number"
                    break;
                default:
                    err.message = "Invalid Rate"
                    break;
            }
        });
        return errors;
    }),
    billingTypeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Billing Type ID should not be empty";
                    break;
                case "number.base":
                    err.message = "Billing Type ID must be a number"
                    break;
                default:
                    err.message = "Invalid Billing Type ID"
                    break;
            }
        });
        return errors;
    }),
    resume: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Resume should not be empty";
                    break;
                case "string.base":
                    err.message = "Resume must be a string"
                    break;
                default:
                    err.message = "Invalid Resume"
                    break;
            }
        });
        return errors;
    }),
    currencyTypeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Currency Type ID should not be empty";
                    break;
                case "number.base":
                    err.message = "Currency Type ID must be a number"
                    break;
                default:
                    err.message = "Currency Billing Type ID"
                    break;
            }
        });
        return errors;
    }),
    coverNote: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Cover note should not be empty";
                    break;
                case "string.base":
                    err.message = "Cover note must be a string"
                    break;
                default:
                    err.message = "Invalid Cover note"
                    break;
            }
        });
        return errors;
    })
});