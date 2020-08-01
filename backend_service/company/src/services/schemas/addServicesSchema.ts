import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    services: Joi.array().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case 'number.base':
                    err.message = 'Services must be an Array';
                    break;
                case 'any.required':
                    err.message = 'Services is required';
                    break;
                default:
                    err.message = 'Invalid Services';
                    break;
            }
        })
        return errors;
    }),
    domains: Joi.array().required().error(error => {
        switch (error[0].type) {
            case 'number.base':
                return {
                    message: 'Domains must be an Array'
                }
            case 'any.required':
                return {
                    message: 'Domains is required'
                }
            default:
                return {
                    message: 'Invalid Domains'
                }
        }
    }),
    technologyAreas: Joi.array().required().error(error => {
        switch (error[0].type) {
            case 'number.base':
                return {
                    message: 'Technology areas must be an Array'
                }
            case 'any.required':
                return {
                    message: 'Technology areas is required'
                }
            default:
                return {
                    message: 'Invalid Technology areas'
                }
        }
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
    supportingDocument: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Supporting document should not be empty";
                    break;
                case "string.base":
                    err.message = "Supporting document must be a string"
                    break;
                default:
                    err.message = "Invalid supporting Document"
                    break;
            }
        });
        return errors;
    })
});