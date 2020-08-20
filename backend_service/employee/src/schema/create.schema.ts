import * as Joi from '@hapi/joi';

export default Joi.object().keys({ 
        firstName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Firstname should not be empty";
                    break;
                case "string.base":
                    err.message = "Firstname must be a string"
                    break;
                default:
                    err.message = "Invalid Firstname"
                    break;
            }
        });
        return errors;
    }),
    lastName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Lastname should not be empty";
                    break;
                case "string.base":
                    err.message = "Lastname must be a string"
                    break;
                default:
                    err.message = "Invalid Lastname"
                    break;
            }
        });
        return errors;
    }),
    accountType: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Account Type should not be empty";
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
    }),
    telephoneNumber: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Telephone Number should not be empty";
                    break;
                case "number.base":
                    err.message = "Telephone Number must be a number"
                    break;
                default:
                    err.message = "Invalid Telephone Number"
                    break;
            }
        });
        return errors;
    }),
    roleId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Role Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Role Id must be a number"
                    break;
                default:
                    err.message = "Invalid Role Id"
                    break;
            }
        });
        return errors;
    }),
    employeeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Employee Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Employee Id must be a number"
                    break;
                default:
                    err.message = "Invalid Employee Id"
                    break;
            }
        });
        return errors;
    }),
    companyName: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Name should not be empty";
                    break;
                case "string.base":
                    err.message = "Company Name must be a string"
                    break;
                default:
                    err.message = "Invalid Company Name"
                    break;
            }
        });
        return errors;
    }),
    company_website: Joi.string().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Website should not be empty";
                    break;
                case "string.base":
                    err.message = "Company Website must be a string"
                    break;
                default:
                    err.message = "Invalid Company Website"
                    break;
            }
        });
        return errors;
    }),
    companySizeId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "Company Size Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "Company Size Id must be a number"
                    break;
                default:
                    err.message = "Invalid Company Size Id"
                    break;
            }
        });
        return errors;
    })
});