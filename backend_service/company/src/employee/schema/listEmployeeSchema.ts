import * as Joi from '@hapi/joi';

export default Joi.object().keys({ 
    filter: Joi.string().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "string.base":
                    err.message = "Filter must be a string";
                    break;
                default:
                    err.message = "Invalid Filter";
                    break;
            }
        });
        return errors;
    }),
    companyId: Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "company Id should not be empty!";
                    break;
                case "number.base":
                    err.message = "company Id must be a number";
                    break;
                default:
                    err.message = "Invalid company Id";
                    break;
            }
        });
        return errors;
    }), 
    sortBy: Joi.string().required().valid('DESC','ASC').insensitive().lowercase().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.required":
                    err.message = "sortBy should not be empty";
                    break;
                case "string.base":
                    err.message = "sortBy must be a string";
                    break;
                default:
                    err.message = "Invalid sortBy";
                    break;
            }
        });
        return errors;
    }), 
    limit:  Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "limit should not be empty!";
                    break;
                case "number.base":
                    err.message = "limit must be a number";
                    break;
                default:
                    err.message = "Invalid limit";
                    break;
            }
        });
        return errors;
    }), 
    skip:  Joi.number().required().error(errors => {
        errors.forEach(err => {
            console.log(err)
            switch (err.code) {
                case "any.required":
                    err.message = "Skip should not be empty!";
                    break;
                case "number.base":
                    err.message = "Skip must be a number"
                    break;
                default:
                    err.message = "Invalid Skip"
                    break;
            }
        });
        return errors;
    })
})