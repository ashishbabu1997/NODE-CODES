import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    candidates: Joi.array().items(Joi.object({
        candidatename : Joi.string().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                        err.message = "Candidate name should not be empty";
                        break;
                    case "string.base":
                        err.message = "Candidate name must be a string"
                        break;
                    default:
                        err.message = "Invalid Candidate name"
                        break;
                }
            });
            return errors;
        }),
        companyId : Joi.number().required().error(errors => {
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
        positionId : Joi.number().required().error(errors => {
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
        coverNote : Joi.string().error(errors => {
                errors.forEach(err => {
                    switch (err.code) {
                       case "string.base":
                            err.message = "Position name must be a string"
                            break;
                        default:
                            err.message = "Invalid position name"
                            break;
                    }
                });
                return errors;
            }),
            rate : Joi.number().required().error(errors => {
                errors.forEach(err => {
                    switch (err.code) {
                        case "any.required":
                            err.message = "rate should not be empty!";
                            break;
                        case "number.base":
                            err.message = "rate must be a number"
                            break;
                        default:
                            err.message = "Invalid rate"
                            break;
                    }
                });
                return errors;
            })
    }) )
});