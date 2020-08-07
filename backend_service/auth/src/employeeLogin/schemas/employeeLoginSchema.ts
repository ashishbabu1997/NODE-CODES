import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    password: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Password should not be empty";
                    break;
                case "string.base":
                    err.message = "Password must be a string"
                    break;
                default:
                    err.message = "Invalid password"
                    break;
            }
        });
        return errors;
    }),
    email: Joi.string().email({ minDomainSegments: 2 }).required().error(error => {
        switch (error[0].type) {
            case 'string.base':
                return {
                    message: 'Invalid Email'
                }
            case 'any.required':
                return {
                    message: 'Email Id is required'
                }
            case 'string.email':
                return {
                    message: 'Invalid Email'
                }
            default:
                return {
                    message: 'Incorrect email id'
                }
        }
    })
});