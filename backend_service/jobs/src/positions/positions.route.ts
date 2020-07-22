import { editPositionHiringSteps, getPositionDetails, createPositions, getPositions} from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';
import editPositionHiringStepSchema from './schemas/editPositionHiringStepSchema';

const router = express.Router();


router
    .get('/', getPositions)
    .post('/', validate(addPositionSchema), createPositions)
    .get('/:positionId', getPositionDetails)
    .put('/hiringSteps', validate(editPositionHiringStepSchema), editPositionHiringSteps)

export default router;

