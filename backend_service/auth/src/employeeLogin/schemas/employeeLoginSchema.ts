import * as Joi from '@hapi/joi';
export default Joi.object().keys({
    otp: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "OTP should not be empty";
                    break;
                case "string.base":
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