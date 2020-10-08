import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    candidateId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Candidate ID should not be empty!";
                    break;
                case "number.base":
                    err.message = "Candidate ID must be a number"
                    break;
                default:
                    err.message = "Invalid candidateID"
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company ID should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company ID must be a number"
                    break;
                default:
                    err.message = "Invalid Company ID"
                    break;
            }
        });
        return errors;
    }),
    candidateStatus:Joi.number().required().error(errors => {
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
    firstName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Firstname should not be empty";
                    break;
                case "string.base":
                    err.message = "Firstname must be a string"
                    break;
                default:
                    err.message = "Invalid Firstname"
                    break;
            }
        });
        return errors;
    }),
    billingTypeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Billing Type ID should not be empty";
                    break;
                case "number.base":
                    err.message = "Billing Type ID must be a number"
                    break;
                default:
                    err.message = "Invalid Billing Type ID"
                    break;
            }
        });
        return errors;
    }),
    currencyTypeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Currency Type ID should not be empty";
                    break;
                case "number.base":
                    err.message = "Currency Type ID must be a number"
                    break;
                default:
                    err.message = "Invalid Currency Type ID"
                    break;
            }
        });
        return errors;
    })
}).unknown(true);