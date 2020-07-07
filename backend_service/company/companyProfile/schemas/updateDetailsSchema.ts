import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    company_name: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company name should not be empty";
                    break;
                case "string.base":
                    err.message = "Company name must be a string"
                    break;
                default:
                    err.message = "Invalid Company name"
                    break;
            }
        });
        return errors;
    }),
    company_website: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "Company_website should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company_website must be a number"
                    break;
                default:
                    err.message = "Invalid Company_website"
                    break;
            }
        });
        return errors;
    }),
    company_size: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company size should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company size must be a number"
                    break;
                default:
                    err.message = "Invalid Company Size"
                    break;
            }
        });
        return errors;
    })
});