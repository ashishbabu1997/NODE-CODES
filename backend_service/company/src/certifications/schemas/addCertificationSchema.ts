import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    companyId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
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
    certificateId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "Certificate Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Certificate Id must be a number"
                    break;
                default:
                    err.message = "Invalid Certificate Id"
                    break;
            }
        });
        return errors;
    }), 
    certificateNumber: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Certificate Number should not be empty";
                    break;
                case "string.base":
                    err.message = "Certificate Number must be a string"
                    break;
                default:
                    err.message = "Invalid Certificate Number"
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
    })
});