import * as express from 'express';
import validate from '../middlewares/joiVaildation';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';
import * as freelancerController from './freelancer.controller';
import * as freelancerSchema from './schema/freelancerSchema';
const router = express.Router();
router
.get('/fetchJobList', jwtAuth, setData(),freelancerController.fetchJobLists)
.put('/updateGeneralInfo',jwtAuth, setData(),validate(freelancerSchema.candidateIdSchema), freelancerController.updateGeneralInfo)
.put('/updateOtherInfoAndSubmit',jwtAuth, setData(), freelancerController.updateOtherInfoAndSubmit)
.get('/getCandidateStatuses',jwtAuth, setData(), freelancerController.candidateStatus)
.put('/submitFreelancerProfile',jwtAuth, setData(), freelancerController.submitProfile)
.get('/getCandidatePositionDetails',jwtAuth, setData(), freelancerController.getCandidatePositionDetails)


export default router;
