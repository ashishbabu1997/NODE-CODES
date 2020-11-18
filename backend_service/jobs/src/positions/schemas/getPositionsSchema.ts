import * as Joi from '@hapi/joi';

export default Joi.object().keys({
    limit:Joi.number().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "number.base":
                    err.message = "Limit must be a number"
                    break;
                default:
                    err.message = "Invalid Limit"
                    break;
            }
        });
        return errors;
    }),
    offset:Joi.number().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "number.base":
                    err.message = "Offset must be a number"
                    break;
                default:
                    err.message = "Invalid Offset"
                    break;
            }
        });
        return errors;
    }),
    sortBy:Joi.string().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "string.base":
                    err.message = "Sort By must be a string"
                    break;
                default:
                    err.message = "Invalid Sort By"
                    break;
            }
        });
        return errors;
    }),
    sortType:Joi.string().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "string.base":
                    err.message = "Sort Type must be a string"
                    break;
                default:
                    err.message = "Invalid Sort Type"
                    break;
            }
        });
        return errors;
    }),
    searchKey:Joi.string().allow('').error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "string.base":
                    err.message = "Search Key must be a string"
                    break;
                default:
                    err.message = "Invalid Search Key"
                    break;
            }
        });
        return errors;
    }),
}).unknown(true);

