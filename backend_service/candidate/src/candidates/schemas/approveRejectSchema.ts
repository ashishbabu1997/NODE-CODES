import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    userRoleId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "User Role Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "User Role Id must be a number"
                    break;
                default:
                    err.message = "Invalid User Role Id"
                    break;
            }
        });
        return errors;
    }),
    userId:Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "User Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "User Id must be a number"
                    break;
                default:
                    err.message = "Invalid User Id"
                    break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Candidate Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Candidate Id must be a number"
                    break;
                default:
                    err.message = "Invalid Candidate Id"
                    break;
            }
        });
        return errors;
    }),
    decisionValue:Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Decision Value should not be empty!";
                    break;
                case "number.base":
                    err.message = "Decision Value must be a number"
                    break;
                default:
                    err.message = "Invalid Decision Value"
                    break;
            }
        });
        return errors;
    }),
}).unknown(true);