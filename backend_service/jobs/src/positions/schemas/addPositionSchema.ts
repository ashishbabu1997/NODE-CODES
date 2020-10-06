import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    skills: Joi.object().keys({
        topRatedSkill: Joi.array().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                        err.message = "Top Rated Skill must be present in skills !";
                        break;
                    case 'array.base':
                        err.message = 'Top Rated Skill must be an Array';
                        break;
                    default:
                        err.message = 'Invalid Top Rated Skill'
                        break;
                }
            })
            return errors;
        }),
        otherSkill: Joi.array().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                        err.message = "Other Skill must be present in skills !";
                        break;
                    case 'array.base':
                        err.message = 'Other Skill must be an Array';
                        break;
                    default:
                        err.message = 'Invalid Other Skill'
                        break;
                }
            })
            return errors;
        })
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
    jobCategoryId:Joi.number().required().error(errors => {
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
}).unknown(true);