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

const router = express.Router();


router
    .get('/', validate(getPositionSchema),getPositions)
    .get('/companyNames',validate(getCompanyNameSchema),getCompanyNames)
    .post('/', validate(addPositionSchema),createPositions)
    .put('/', validate(updatePositionSchema),updatePositions)
    .get('/:positionId',getPositionDetails)
    .put('/hiringSteps', validate(editPositionHiringStepSchema), editPositionHiringSteps)
    .post('/publish', validate(positionIdSchema), publishPositions)
    .post('/changePositionStatus',validate(jobStatusSchema),changePositionStatus)
    .get('/deletePosition/:positionId',positionDeletion)
export default router;