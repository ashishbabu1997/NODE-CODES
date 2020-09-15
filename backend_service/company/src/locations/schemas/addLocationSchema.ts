import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    streetAddress1: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "streetAddress1 should not be empty";
                    break;
                case "string.base":
                    err.message = "streetAddress1 must be a string"
                    break;
                default:
                    err.message = "Invalid streetAddress1"
                    break;
            }
        });
        return errors;
    }),
    streetAddress2: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "streetAddress2 should not be empty";
                    break;
                case "string.base":
                    err.message = "streetAddress2 must be a string"
                    break;
                default:
                    err.message = "Invalid streetAddress2"
                    break;
            }
        });
        return errors;
    }),
    city: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "city should not be empty";
                    break;
                case "string.base":
                    err.message = "city must be a string"
                    break;
                default:
                    err.message = "Invalid city"
                    break;
            }
        });
        return errors;
    }),
    zipCode: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "zipCode should not be empty!";
                    break;
                case "number.base":
                    err.message = "zipCode must be a number"
                    break;
                default:
                    err.message = "Invalid zipCode"
                    break;
            }
        });
        return errors;
    }),
    stateId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "stateId should not be empty!";
                    break;
                case "number.base":
                    err.message = "stateId must be a number"
                    break;
                default:
                    err.message = "Invalid stateId"
                    break;
            }
        });
        return errors;
    }),
    countryId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "Country Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Country Id must be a number"
                    break;
                default:
                    err.message = "Invalid Country Id"
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company Id must be a number"
                    break;
                default:
                    err.message = "Invalid Company Id"
                    break;
            }
        });
        return errors;
    })
});