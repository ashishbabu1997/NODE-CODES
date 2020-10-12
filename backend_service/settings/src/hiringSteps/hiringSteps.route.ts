import { createHiringSteps, getHiringSteps, editHiringSteps } from './hiringStep.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addHiringStepSchema from './schemas/addHiringStepSchema';
import editHiringStepSchema from './schemas/editHiringStepSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();

router
    .get('/:companyId',jwtAuth, setData(), getHiringSteps)
    .post('/',jwtAuth, setData(), validate(addHiringStepSchema), createHiringSteps)
    .put('/', jwtAuth, setData(),validate(editHiringStepSchema), editHiringSteps)

export default router;

