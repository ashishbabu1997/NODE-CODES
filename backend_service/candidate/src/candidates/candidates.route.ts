import { candidateDetails, candidateVettingStatus, listCandidates, listFreeCandidates, approveRejectCandidates, interviewRequest, candidateReview, deleteCandidateFromPosition, addCandidateToPosition, deleteCandidate } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
import validate from '../middlewares/joiVaildation';
import approveRejectSchema from './schemas/approveRejectSchema';
import interviewRequestSchema from './schemas/interviewRequestSchema';
import candidateVettingSchema from './schemas/candidateVettingSchema';
import addCandidateToPositionSchema from './schemas/addCandidateToPositionSchema';

import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();
router
    .get('/candidateDetails', jwtAuth, setData(), candidateDetails)
    .get('/listCandidates', jwtAuth, setData(), listCandidates)
    .get('/listFreeCandidates', jwtAuth, setData(), listFreeCandidates)
    .post('/candidateApproveReject', jwtAuth, setData(), validate(approveRejectSchema), approveRejectCandidates)
    .post('/requestForInterview', jwtAuth, setData(), validate(interviewRequestSchema), interviewRequest)
    .post('/review', jwtAuth, setData(), candidateReview)
    .put('/candidateVettingStatus', jwtAuth, setData(), validate(candidateVettingSchema), candidateVettingStatus)
    .delete('/', jwtAuth, setData(), deleteCandidateFromPosition)
    .put('/linkCandidateToPosition', jwtAuth, setData(), validate(addCandidateToPositionSchema), addCandidateToPosition)
    .delete('/deleteCandidate', jwtAuth, setData(), deleteCandidate)
export default router;
