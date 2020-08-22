import { createHiringSteps, getHiringSteps, editHiringSteps } from './hiringStep.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addHiringStepSchema from './schemas/addHiringStepSchema';
import editHiringStepSchema from './schemas/editHiringStepSchema';

const router = express.Router();

router
    .get('/:companyId', getHiringSteps)
    .post('/', validate(addHiringStepSchema), createHiringSteps)
    .put('/', validate(editHiringStepSchema), editHiringSteps)

export default router;

