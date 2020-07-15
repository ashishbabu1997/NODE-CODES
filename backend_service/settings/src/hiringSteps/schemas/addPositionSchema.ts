import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    skills: Joi.array().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'number.base':
                    err.message = 'Skills must be an Array';
                    break;
                case 'any.required':
                    err.message = 'Skills is required'
                    break;
                default:
                    err.message = 'Invalid skills'
                    break;
            }
        })
        return errors;
    }),
    companyId: Joi.number().required().error(errors => {
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
    locationName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Location name should not be empty";
                    break;
                case "string.base":
                    err.message = "Location name must be a string"
                    break;
                default:
                    err.message = "Invalid location name"
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
    allowRemote: Joi.boolean().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Allow remote should not be empty!";
                    break;
                case "number.base":
                    err.message = "Allow remote must be a boolean"
                    break;
                default:
                    err.message = "Invalid allow remote"
                    break;
            }
        });
        return errors;
    }),
    experienceLevel: Joi.number().required().error(errors => {
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
    jobDescription: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Job Description should not be empty";
                    break;
                case "string.base":
                    err.message = "Job Description must be a string"
                    break;
                default:
                    err.message = "Invalid job description"
                    break;
            }
        });
        return errors;
    }),
    document: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Document should not be empty";
                    break;
                case "string.base":
                    err.message = "Document must be a string"
                    break;
                default:
                    err.message = "Invalid document"
                    break;
            }
        });
        return errors;
    }),
    contractPeriodId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Contract period id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Contract period id must be a number"
                    break;
                default:
                    err.message = "Invalid contract period id"
                    break;
            }
        });
        return errors;
    }),
    currencyTypeId: Joi.number().required().error(errors => {
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
    billingType: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Billing type should not be empty!";
                    break;
                case "number.base":
                    err.message = "Billing type must be a number"
                    break;
                default:
                    err.message = "Invalid billing type"
                    break;
            }
        });
        return errors;
    }),
    minBudget: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Minimum budget should not be empty!";
                    break;
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
    maxBudget: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Maximum budget should not be empty!";
                    break;
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
    hiringStepId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Hiring Step Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Hiring Step Id must be a number"
                    break;
                default:
                    err.message = "Invalid hiring step id"
                    break;
            }
        });
        return errors;
    }),
    userId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "User Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "User Id must be a number"
                    break;
                default:
                    err.message = "Invalid user id"
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
});