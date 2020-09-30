import * as Joi from '@hapi/joi';

export default Joi.object().keys({
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
    companyId:Joi.number().required().error(errors => {
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
    }),
}).unknown(true);