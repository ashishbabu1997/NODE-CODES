import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    companyAddress: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company address should not be empty";
                    break;
                case "string.base":
                    err.message = "Company address must be a string"
                    break;
                default:
                    err.message = "Invalid Company address"
                    break;
            }
        });
        return errors;
    }),
    locationId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "Location Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Location Id must be a number"
                    break;
                default:
                    err.message = "Invalid Location Id"
                    break;
            }
        });
        return errors;
    }),
    countryId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Country Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Country Id must be a number"
                    break;
                default:
                    err.message = "Invalid Country Id"
                    break;
            }
        });
        return errors;
    })
});