import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    empId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Firstname should not be empty";
                    break;
                case "number.base":
                    err.message = "employeeId must be a number"
                    break;
                default:
                    err.message = "Invalid employeeId"
                    break;
            }
        });
        return errors;
    }),
    decisionValue: Joi.number().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "number.base":
                    err.message = "decisionValue must be a number"
                    break;
                default:
                    err.message = "Invalid decisionValue"
                    break;
            }
        });
        return errors;
    }),
 
}).unknown(true);