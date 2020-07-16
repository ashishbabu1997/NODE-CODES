import { createPositions, getPositions, getPositionDetails } from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';

const router = express.Router();

router
    .get('/', getPositions)
    .get('/:positionId', getPositionDetails)
    .post('/', validate(addPositionSchema), createPositions)

export default router;

