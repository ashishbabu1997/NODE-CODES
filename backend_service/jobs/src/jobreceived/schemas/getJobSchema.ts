import * as Joi from '@hapi/joi';

export const getJobReceivedSchema =  Joi.object().keys({
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
}).unknown(true)

export const getJobReceivedByIdSchema =  Joi.object().keys({
    jobReceivedId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "job Received Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "job Received Id must be a number"
                    break;
                default:
                    err.message = "Invalid job Received Id"
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Seller Company Id should not be empty";
                    break;
                case "number.base":
                    err.message = "Seller Company Id must be a number"
                    break;
                default:
                    err.message = "Invalid Seller Company Id"
                    break;
            }
        });
        return errors;
    }),
}).unknown(true)

