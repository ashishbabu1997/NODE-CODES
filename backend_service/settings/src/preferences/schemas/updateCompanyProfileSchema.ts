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
});