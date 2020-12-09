import * as Joi from '@hapi/joi';

export const languageProficiencySchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidateLanguageId: Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Language Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Language Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Candidate Language Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);

export const availabilitySchema = Joi.object().keys({
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
}).unknown(true);


export const projectSchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidateProjectId : Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Project Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Project Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Candidate Project Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);

export const profileDetailSchema = Joi.object().keys({
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
}).unknown(true);

export const workExperienceSchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidateWorkExperienceId : Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Work Experience Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Work Experience Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Work Experience Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);

export const educationSchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidateEducationId : Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Education Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Education Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Education Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);


export const awardSchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidateAwardId : Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Award Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Award Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Award Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);

export const skillSchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidateSkillId : Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Skill Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Skill Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Skill Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);

export const publicationSchema = Joi.object().keys({
    action: Joi.string().required().valid('add','update','delete').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "Action should not be empty!";
                break;
                case "number.base":
                err.message = "Action must be a string"
                break;
                default:
                err.message = "Invalid action"
                break;
            }
        });
        return errors;
    }),
    candidateId: Joi.number()
    .when('action',{
        is:['add','update'],
        then:Joi.number().required().error(errors => {
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
        otherwise:Joi.optional()
    }),
    candidatePublicationId  : Joi.number()
    .when('action',{
        is:['update','delete'],
        then:Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "any.required":
                    err.message = "Candidate Publication Id should not be empty!";
                    break;
                    case "number.base":
                    err.message = "Candidate Publication Id must be a number"
                    break;
                    default:
                    err.message = "Invalid Publication Id"
                    break;
                }
            });
            return errors;
        }),
        otherwise:Joi.optional()
    }),
}).unknown(true);

export const assementLinkAndStatusSchema = Joi.object().keys({
    type: Joi.string().required().valid('codeTest','interviewTest').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                err.message = "type should not be empty!";
                break;
                case "number.base":
                err.message = "type must be a string"
                break;
                default:
                err.message = "Invalid type (codeTest/interviewTest)"
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
    })
}).unknown(true);

