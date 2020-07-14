import { createPositions, getPositions } from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';

const router = express.Router();

router
    .get('/', getPositions)
    .post('/', validate(addPositionSchema), createPositions)

export default router;

