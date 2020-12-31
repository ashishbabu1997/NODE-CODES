import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import * as hiringController from './hiring.controller';
import * as hiringSchema from './schema/hiringSchema';
const router = express.Router();
router
.get('/fetchPositionHiringSteps', jwtAuth, setData(),validate(hiringSchema.positionIdSchema),hiringController.getPositionHiringSteps)
.get('/fetchCandidateClientHiringSteps',jwtAuth, setData(),validate(hiringSchema.candidateIdSchema), hiringController.getCandidateClientHiringStepsupdateGeneralInfo)
export default router;
