import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    masking: Joi.boolean().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Masking should not be empty";
                    break;
                case "string.base":
                    err.message = "Masking must be boolean"
                    break;
                default:
                    err.message = "Invalid masking"
                    break;
            }
        });
        return errors;
    })
}).unknown(true);