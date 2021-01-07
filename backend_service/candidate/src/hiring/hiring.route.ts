import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import * as hiringController from './hiring.controller';
import * as hiringSchema from './schema/hiringSchema';
const router = express.Router();
router
.get('/defaultHiringSteps',jwtAuth, setData(),hiringController.defaultHiringSteps)
.get('/getPositionHiringSteps', jwtAuth, setData(),validate(hiringSchema.positionIdSchema),hiringController.getPositionHiringSteps)
.get('/getCandidateHiringSteps',jwtAuth, setData(),validate(hiringSchema.candidateIdPositionIdSchema), hiringController.getCandidateHiringSteps)
.get('/getAllCandidateHiringSteps',jwtAuth, setData(),validate(hiringSchema.candidateIdSchema), hiringController.getAllCandidateHiringSteps)
.put('/updateCandidateHiringDetails',jwtAuth, setData(),hiringController.updateHiringStepDetails)
.put('/moveCandidateHiringStep',jwtAuth, setData(),hiringController.moveCandidateHiringStep)
.put('/rejectCandidateHiring',jwtAuth, setData(),hiringController.rejectFromHiringProcess)
.put('/addNewStageForCandidate',jwtAuth, setData(),hiringController.addNewStageForCandidate)
.put('/updateDefaultAssignee',jwtAuth, setData(),hiringController.updateDefaultAssignee)
.delete('/deletePositionHiringStep',jwtAuth, setData(),validate(hiringSchema.positionHiringStepIdSchema),hiringController.deletePositionHiringStep)
.put('/reorderHiringSteps',jwtAuth, setData(),hiringController.reorderCandidateHiringSteps)


export default router;
