import { editPositionHiringSteps, getPositionDetails, createPositions, getPositions, updatePositions, publishPositions,closeJob } from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';
import publishPositionSchema from './schemas/publishPositionsSchema';
import editPositionHiringStepSchema from './schemas/editPositionHiringStepSchema';

const router = express.Router();


router
    .get('/', getPositions)
    .post('/', createPositions)
    .put('/', updatePositions)
    .get('/:positionId', getPositionDetails)
    .put('/hiringSteps', validate(editPositionHiringStepSchema), editPositionHiringSteps)
    .post('/publish', validate(publishPositionSchema), publishPositions)
    .post('/close',closeJob)
export default router;

