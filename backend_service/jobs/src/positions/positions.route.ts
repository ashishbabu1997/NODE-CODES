import { editPositionHiringSteps, getPositionDetails,positionDeletion, createPositions, getPositions, updatePositions, publishPositions,changePositionStatus,getCompanyNames } from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';
import getCompanyNameSchema from './schemas/getCompanyNameSchema';
import getPositionSchema from './schemas/getPositionsSchema';
import updatePositionSchema from './schemas/updatePositionSchema';
import positionIdSchema from './schemas/positionIdSchema';
import jobStatusSchema from './schemas/jobStatusSchema';
import editPositionHiringStepSchema from './schemas/editPositionHiringStepSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();


router
    .get('/',jwtAuth, setData(), validate(getPositionSchema),getPositions)
    .get('/companyNames',jwtAuth, setData(),validate(getCompanyNameSchema),getCompanyNames)
    .post('/',jwtAuth, setData(), validate(addPositionSchema),createPositions)
    .put('/', jwtAuth, setData(), validate(updatePositionSchema),updatePositions)
    .get('/:positionId', jwtAuth, setData(),getPositionDetails)
    .put('/hiringSteps',  jwtAuth, setData(),validate(editPositionHiringStepSchema), editPositionHiringSteps)
    .post('/publish',jwtAuth, setData(), validate(positionIdSchema), publishPositions)
    .post('/changePositionStatus',jwtAuth, setData(),validate(jobStatusSchema),changePositionStatus)
    .post('/deletePosition',jwtAuth, setData(),validate(positionIdSchema),positionDeletion)
export default router;