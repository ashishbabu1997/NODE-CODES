import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    hiringStepId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Hiring step id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Hiring step id must be a number"
                    break;
                default:
                    err.message = "Invalid Hiring step id"
                    break;
            }
        });
        return errors;
    }),
    hiringStepName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Hiring step name should not be empty";
                    break;
                case "string.base":
                    err.message = "Hiring step name must be a string"
                    break;
                default:
                    err.message = "Invalid hiring step name"
                    break;
            }
        });
        return errors;
    }),
    description: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Description should not be empty";
                    break;
                case "string.base":
                    err.message = "Description must be a string"
                    break;
                default:
                    err.message = "Invalid description"
                    break;
            }
        });
        return errors;
    }),
    hiringStages: Joi.array().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'number.base':
                    err.message = 'Hiring stages must be an Array';
                    break;
                case 'any.required':
                    err.message = 'Hiring stages is required'
                    break;
                default:
                    err.message = 'Invalid hiring stages'
                    break;
            }
        })
        return errors;
    }),
}).unknown(true);