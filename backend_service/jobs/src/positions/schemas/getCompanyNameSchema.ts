import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    companyType: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Type should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company Type must be a number"
                    break;
                default:
                    err.message = "Invalid Account Type"
                    break;
            }
        });
        return errors;
    })
}).unknown(true);