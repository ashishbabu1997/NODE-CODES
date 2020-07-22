import {getAllPositions, getPositionById, updateFlag, updateReject, addPositionProfile, getProfile } from './jobreceived.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addProfileSchema from './schemas/addProfileSchema';
import {schemaFlag, schemaReject} from './schemas/putSchema';

const router = express.Router();


router
    .get('/', getAllPositions)
    .get('/:PositionId', getPositionById)
    .put('/', validate(schemaFlag), updateFlag)
    .put('/reject', validate(schemaReject), updateReject)
    .post('/profile', validate(addProfileSchema),addPositionProfile)
    .get('/profile', getProfile)

export default router;

