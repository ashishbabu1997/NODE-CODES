<<<<<<< HEAD
import { createPositions, getPositions, getPositionDetails } from './positions.controller';
=======
import { createPositions, getPositions, getAllPositions, getPositionById, updateFlag, updateReject, addPositionProfile, getProfile} from './positions.controller';
>>>>>>> feature/job_received
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';

const router = express.Router();

router
    .get('/', getPositions)
<<<<<<< HEAD
    .get('/:positionId', getPositionDetails)
=======
    .get('/all', getAllPositions)
    .get('/details', getPositionById)
>>>>>>> feature/job_received
    .post('/', validate(addPositionSchema), createPositions)
    .put('/', updateFlag)
    .put('/reject', updateReject)
    .post('/profile', addPositionProfile)
    .get('/profile', getProfile)

export default router;

