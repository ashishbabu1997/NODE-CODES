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
    positionName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Position name should not be empty";
                    break;
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
    jobCategoryId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Job Category Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Job Category Id must be a number"
                    break;
                default:
                    err.message = "Invalid Job Category Id"
                    break;
            }
        });
        return errors;
    }),
    developerCount: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Developer count should not be empty!";
                    break;
                case "number.base":
                    err.message = "Developer count must be a number"
                    break;
                default:
                    err.message = "Invalid developer count"
                    break;
            }
        });
        return errors;
    }),
    currencyTypeId: Joi.number().allow(null,'').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Currency type id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Currency type id must be a number"
                    break;
                default:
                    err.message = "Invalid currency type id"
                    break;
            }
        });
        return errors;
    }),
    minBudget: Joi.number().allow(null,'').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "number.base":
                    err.message = "Minimum budget must be a number"
                    break;
                default:
                    err.message = "Invalid minmum budget"
                    break;
            }
        });
        return errors;
    }),
    maxBudget: Joi.number().allow(null,'').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "number.base":
                    err.message = "Maximum budget must be a number"
                    break;
                default:
                    err.message = "Invalid maximum budget"
                    break;
            }
        });
        return errors;
    }),
    description: Joi.string().allow(null, '').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "string.base":
                    err.message = "Description must be a string"
                    break;
                default:
                    err.message = "Invalid description"
                    break;
            }
        });
        return errors;
    })
}).unknown(true);