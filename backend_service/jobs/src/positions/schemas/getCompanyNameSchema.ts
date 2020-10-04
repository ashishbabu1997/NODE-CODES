import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    accountType: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Account Type should not be empty!";
                    break;
                case "number.base":
                    err.message = "Account Type must be a number"
                    break;
                default:
                    err.message = "Invalid Account Type"
                    break;
            }
        });
        return errors;
    })
});