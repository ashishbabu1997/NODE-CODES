import { candidateDetails, listCandidates,approveRejectCandidates,interviewRequest,candidateReview } from './candidates.controller';
import * as express from 'express';
import checkUserRole from '../middlewares/checkUserRole';
import validate from '../middlewares/joiVaildation';
import approveRejectSchema from './schemas/approveRejectSchema';
import interviewRequestSchema from './schemas/interviewRequestSchema';
import { jwtAuth } from '../middlewares/jwtAuthenticate';
import setData from '../middlewares/setData';

const router = express.Router();
router
    .get('/candidateDetails',  jwtAuth, setData(),candidateDetails)
    .get('/listCandidates', jwtAuth, setData(), listCandidates)
    .post('/candidateApproveReject',jwtAuth, setData(),validate(approveRejectSchema),approveRejectCandidates)
    .post('/requestForInterview',jwtAuth, setData(),validate(interviewRequestSchema),interviewRequest)
    .post('/review',candidateReview)
export default router;
