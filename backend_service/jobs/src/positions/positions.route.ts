import { createPositions, getPositions, getAllPositions, getPositionById, updateFlag, updateReject, addPositionProfile, getProfile} from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';

const router = express.Router();

router
    .get('/', getPositions)
    .get('/all', getAllPositions)
    .get('/details', getPositionById)
    .post('/', validate(addPositionSchema), createPositions)
    .put('/', updateFlag)
    .put('/reject', updateReject)
    .post('/profile', addPositionProfile)
    .get('/profile', getProfile)

export default router;

