import * as Joi from '@hapi/joi';

export default Joi.object().keys({
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
    jobStatus: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Job Status should not be empty!";
                    break;
                case "number.base":
                    err.message = "Job Status must be a number"
                    break;
                default:
                    err.message = "Invalid Job Status"
                    break;
            }
        });
        return errors;
    })
});