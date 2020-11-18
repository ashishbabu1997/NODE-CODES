import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    currencyTypeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Currency should not be empty!";
                    break;
                case "number.base":
                    err.message = "Currency must be a number"
                    break;
                default:
                    err.message = "Invalid currency"
                    break;
            }
        });
        return errors;
    }),
}).unknown(true);