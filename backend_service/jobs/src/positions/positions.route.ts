import * as positionController from './positions.controller';
import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import addPositionSchema from './schemas/addPositionSchema';
import getCompanyNameSchema from './schemas/getCompanyNameSchema';
import getPositionSchema from './schemas/getPositionsSchema';
import updatePositionSchema from './schemas/updatePositionSchema';
import positionIdSchema from './schemas/positionIdSchema';
import jobStatusSchema from './schemas/jobStatusSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
const router = express.Router();


router
    .post('/positionList',jwtAuth, setData(), validate(getPositionSchema),positionController.getPositions)
    .get('/companyNames',jwtAuth, setData(),validate(getCompanyNameSchema),positionController.getCompanyNames)
    .post('/',jwtAuth, setData(), validate(addPositionSchema),positionController.createPositions)
    .put('/', jwtAuth, setData(), validate(updatePositionSchema),positionController.updatePositions)
    .get('/:positionId', jwtAuth, setData(),positionController.getPositionDetails)
    .post('/publish',jwtAuth, setData(), validate(positionIdSchema), positionController.publishPositions)
    .post('/changePositionStatus',jwtAuth, setData(),validate(jobStatusSchema),positionController.changePositionStatus)
    .post('/deletePosition',jwtAuth, setData(),validate(positionIdSchema),positionController.positionDeletion)
    .put('/updateReadStatus',jwtAuth, setData(),validate(positionIdSchema),positionController.updateReadStatus)
    .put('/resetReadStatus',jwtAuth, setData(),validate(positionIdSchema),positionController.resetReadStatusAsNew)
    .put('/updateAllocatedTo',jwtAuth, setData(),positionController.updateAllocatedTo)
    
export default router;