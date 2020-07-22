import * as Joi from '@hapi/joi';

export const schemaFlag =  Joi.object().keys({
    positionId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Position Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Position Id must be a number"
                    break;
                default:
                    err.message = "Invalid Position Id"
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
})

export const schemaReject =  Joi.object().keys({
    positionId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Position Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Position Id must be a number"
                    break;
                default:
                    err.message = "Invalid Position Id"
                    break;
            }
        });
        return errors;
    }),
    reject: Joi.boolean().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "reject should not be empty";
                    break;
                case "boolean.base":
                    err.message = "reject must be a boolean"
                    break;
                default:
                    err.message = "Invalid reject"
                    break;
            }
        });
        return errors;
    })
})