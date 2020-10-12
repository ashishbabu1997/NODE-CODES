import * as Joi from '@hapi/joi';

export const schemaFlag =  Joi.object().keys({
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
    flag: Joi.boolean().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "flag should not be empty";
                    break;
                case "boolean.base":
                    err.message = "flag must be a boolean"
                    break;
                default:
                    err.message = "Invalid flag"
                    break;
            }
        });
        return errors;
    })
}).unknown(true)

export const schemaReject =  Joi.object().keys({
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
    reject: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "reject should not be empty";
                    break;
                case "number.base":
                    err.message = "reject must be a number"
                    break;
                default:
                    err.message = "Invalid reject"
                    break;
            }
        });
        return errors;
    }),
}).unknown(true)