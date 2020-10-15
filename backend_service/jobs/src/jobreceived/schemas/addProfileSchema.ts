import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    candidates: Joi.object().keys({
        firstName : Joi.string().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                        err.message = "candidate FirstName should not be empty";
                        break;
                    case "string.base":
                        err.message = "Candidate FirstName must be a string"
                        break;
                    default:
                        err.message = "Invalid Candidate FirstName"
                        break;
                }
            });
            return errors;
        }),
        candidateStatus : Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                        err.message = "Candidate Status should not be empty!";
                        break;
                    case "number.base":
                        err.message = "Candidate Status must be a number"
                        break;
                    default:
                        err.message = "Invalid Candidate Status"
                        break;
                }
            });
            return errors;
        }),
        
        jobReceivedId : Joi.number().allow('',null).error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "number.base":
                        err.message = "job Received Id must be a number"
                        break;
                    default:
                        err.message = "Invalid job Received Id"
                        break;
                }
            });
            return errors;
        })
    }).unknown(true)
}).unknown(true);