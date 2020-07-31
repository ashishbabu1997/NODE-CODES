import * as Joi from '@hapi/joi';
export default Joi.object().keys({
    email: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Email Address should not be empty";
                    break;
                case "string.base":
                    err.message = "Email Address should be a string"
                    break;
                default:
                    err.message = "Invalid Email Address"
                    break;
            }
        });
        return errors;
    }),
    otp: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "OTP should not be empty";
                    break;
                case "number.base":
                    err.message = "OTP must be a number"
                    break;
                default:
                    err.message = "Invalid OTP"
                    break;
            }
        });
        return errors;
    })
});