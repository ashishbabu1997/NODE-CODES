import * as Joi from '@hapi/joi';

export const candidateIdSchema = Joi.object()
  .keys({
    candidateId: Joi.number()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.required':
              err.message = 'Candidate Id should not be empty!';
              break;
            case 'number.base':
              err.message = 'Candidate Id must be a number';
              break;
            default:
              err.message = 'Invalid Candidate Id';
              break;
          }
        });
        return errors;
      }),
  })
  .unknown(true);
