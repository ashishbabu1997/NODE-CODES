import * as Joi from '@hapi/joi';

export default Joi.object().keys({
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
    certificationId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Certification Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Certification Id must be a number"
                    break;
                default:
                    err.message = "Invalid Certification Id"
                    break;
            }
        });
        return errors;
    }), 
    certificationNumber: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Certification Number should not be empty";
                    break;
                case "string.base":
                    err.message = "Certification Number must be a string"
                    break;
                default:
                    err.message = "Invalid Certification Number"
                    break;
            }
        });
        return errors;
    }), 
    logo: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Logo should not be empty";
                    break;
                case "string.base":
                    err.message = "Logo must be a string"
                    break;
                default:
                    err.message = "Invalid Logo"
                    break;
            }
        });
        return errors;
    }),
    document: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
               case "string.base":
                    err.message = "Document must be a string"
                    break;
                default:
                    err.message = "Invalid Document"
                    break;
            }
        });
        return errors;
    }),
    certificationType: Joi.string().required().valid('certification', 'award').insensitive().lowercase().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
               case "string.base":
                    err.message = "Certification Type must be a string"
                    break;
               case "any.only":
                         err.message = "Certification Type must certification or award"
                         break;
                default:
                    err.message = "Invalid Certification Type"
                    break;
            }
        });
        return errors;
    })
});